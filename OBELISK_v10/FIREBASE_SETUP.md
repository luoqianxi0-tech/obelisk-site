# OBELISK v10 - Firebase 配置与部署说明

## 目录
1. [获取 Firebase 项目凭证](#一获取-firebase-项目凭证)
2. [填入项目环境变量](#二填入项目环境变量)
3. [设置管理员权限](#三设置管理员权限)
4. [部署 Security Rules](#四部署-security-rules)
5. [启用 Google 登录](#五启用-google-登录)
6. [整站部署到 Firebase Hosting](#六整站部署到-firebase-hosting)
7. [常见问题](#七常见问题)

---

## 一、获取 Firebase 项目凭证

1. 打开 [Firebase Console](https://console.firebase.google.com/) 并登录
2. 点击 **"Add project"** 创建新项目（或使用已有项目）
3. 项目名称建议：`OBELISK` 或 `obelisk-prod`
4. 等待项目创建完成后进入 **Project Overview**
5. 点击中间的 **Web 应用图标 `</>`**，注册 Web 应用
   - App nickname：`OBELISK Web`
   - **勾选** "Also set up Firebase Hosting for this app"
   - 点击 **Register app**
6. 进入下一步，你会看到 `firebaseConfig` 配置对象，类似：

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← 复制这个
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:..."
};
```

7. 跳过下一步 `npm install firebase` 脚本（项目已安装），直接进入控制台。

---

## 二、填入项目环境变量

在本项目根目录创建 `.env` 文件（参考 `.env.example`）：

```powershell
# Windows PowerShell
Copy-Item .env.example .env

# 然后编辑 .env，把 6 个值替换成上一步复制的真实值
notepad .env
```

**修改完成后一定要重启 `npm run dev`！** 因为 Vite 只在启动时读取 env。

**⚠️ 安全提醒**：`.env` 已加入 `.gitignore`，严禁提交到 Git 仓库。

---

## 三、设置管理员权限

由于我们把 Admin 判定从硬编码 UID 改成了读取 Firestore `users/{uid}.isAdmin` 字段，
你需要在 Firebase 控制台手动把第一个（或你的）账号设置为管理员。

### 步骤

1. 先用你的 Google 账号在前端登录一次（这样 users 文档会被自动创建）
2. 回到 Firebase Console → **Firestore Database**
3. 点开集合 `users` → 找到你自己 UID 对应的文档
4. 点击 **+ Add field**：
   - **Field**：`isAdmin`
   - **Type**：`boolean`
   - **Value**：`true`
5. 点击 **Save**
6. 前端退出登录重新登录，右上角导航栏会出现 **管理 / Admin** 入口

### 或者用 CLI 设置（推荐批量操作）

```powershell
# 安装 Firebase CLI（如果还没装）
npm install -g firebase-tools

# 登录 Firebase（浏览器会弹出）
firebase login

# 把你的 Firebase UID 填在下面，然后运行：
firebase firestore:update users/你的_Firebase_UID --data '{"isAdmin": true}'
```

---

## 四、部署 Security Rules

本项目已为你生成以下规则文件：

| 文件 | 作用 |
|------|------|
| `firestore.rules` | Firestore 数据库读写权限控制 |
| `storage.rules` | Cloud Storage 上传/下载权限控制 |
| `firestore.indexes.json` | Firestore 查询复合索引预生成 |

### 部署步骤

```powershell
# 1. 安装 Firebase CLI（如果没装）
npm install -g firebase-tools

# 2. 登录
firebase login

# 3. 查看当前项目
firebase projects:list

# 4. 选择或关联你的 Firebase 项目
firebase use your-project-id

# 5. 【推荐】先在模拟器里测试规则（可选）
firebase emulators:start --only firestore,storage

# 6. 部署 Firestore Rules 到生产环境
firebase deploy --only firestore:rules

# 7. 部署 Firestore Indexes（首次部署建议执行）
firebase deploy --only firestore:indexes

# 8. 部署 Storage Rules
firebase deploy --only storage

# 9. 一次性部署所有 Rules
firebase deploy --only firestore,storage
```

### Rules 权限概览

#### Firestore (`firestore.rules`)

| 集合 | 读 | 写 | 说明 |
|------|----|----|------|
| `users/{uid}` | 已登录可见 | 仅自己改基础字段 | isAdmin 字段仅能被控制台/CLI 修改 |
| `posts/{id}` | 所有人 | 仅作者本人修改/删除 | 点赞/收藏数组允许本人追加 |
| `comments/{id}` | 所有人 | 仅作者本人/管理员 | 字符上限 1000 |
| `resources/{id}`（军火库） | 所有人 | 仅管理员 | |
| `circle/*` | 所有人 | 仅作者/管理员 | 靶场/项目/漏洞/笔记 |
| `**` 其他 | 仅管理员 | 仅管理员 | 兜底保护 |

#### Storage (`storage.rules`)

| 路径 | 权限 | 说明 |
|------|------|------|
| `/avatars/{uid}/*` | 公开读，本人写 | 头像单文件 < 5MB |
| `/posts/{uid}/*` | 公开读，本人写 | 帖子图片单文件 < 10MB |
| `/circle/{uid}/*` | 公开读，本人写 | 圈子附件 < 10MB |
| `/admin/*` | 仅管理员 | 后台上传 |
| `**` 其他 | 禁止 | 兜底拒绝 |

---

## 五、启用 Google 登录

1. Firebase Console 左侧 **Build → Authentication → Sign-in method**
2. 点击 **Add new provider → Google**
3. **Enable** 开关 → 选择 Support email（你自己的邮箱）
4. 点击 **Save**
5. （生产部署必做）回到项目设置 **⚙️ Settings → General**，滚动到 **Authorized domains**，
   加入你最终部署的域名（本地 `localhost` 默认已允许）

---

## 六、整站部署到 Firebase Hosting

```powershell
# 1. 构建生产版本
npm run build

# 2. 部署到 Firebase Hosting（会使用 firebase.json 中的配置）
firebase deploy --only hosting

# 3. 首次部署时如果报错 Hosting 未初始化，执行：
firebase init hosting
#  What do you want to use as your public directory? → dist
#  Configure as a single-page app (rewrite all urls to /index.html)? → Yes
#  Set up automatic builds and deploys with GitHub? → 按需
```

部署成功后命令行会输出 `Hosting URL`，打开验证。

---

## 七、常见问题

### Q1: 打开站点后右下角显示「Firebase 未配置」
→ 说明 `.env` 文件没创建或变量值仍是占位符。回到第二节检查。

### Q2: 登录报错 `auth/unauthorized-domain`
→ Firebase Console → Authentication → Settings → Authorized domains，加入访问地址的域名。

### Q3: 发帖/点赞报错 `PERMISSION_DENIED`
→ Rules 没部署。按第四节执行 `firebase deploy --only firestore:rules`。

### Q4: 控制台黄色警告 `Missing or insufficient permissions`
→ Firestore 数据读取被 Rules 拦截，通常是 Rules 未部署成功或集合路径写得不匹配。

### Q5: 图片上传报错 `storage unauthorized`
→ `firebase deploy --only storage` 部署 Storage Rules。

### Q6: 如何查看 Rules 日志调试？
→ Firebase Console → Firestore → Rules → **Rules Playground** 或 **Monitor** 标签页。

### Q7: Admin 菜单找不到
→ 登录后去 Firestore 控制台把 `users/<你的UID>/isAdmin` 设为 `true`，然后重新登录。
