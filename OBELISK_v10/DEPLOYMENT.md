# OBELISK v10 - 三平台部署 & 404 修复指南

> 🚨 **绝大多数情况下的根域名 / 子路由 404，都是因为「构建产物目录不对」或「SPA rewrite 规则没配」。按本文件一步步检查后重新部署即可解决。**

---

## 0. 部署前的本地自检（必做）

先保证本地 build 成功，再推到云端：

```powershell
cd "d:\OBELISK project\OBELISK_v10"
npm install
npm run build
```

✅ 成功标志：最后会打印 `✓ built in xxxms`，然后 `dist/` 目录下至少有：

```
dist/
├── index.html          ← 必须有！没有就是 build 失败
├── assets/
│   ├── index-xxx.js
│   └── index-xxx.css
├── 404.html            ← 来自 public/，GitHub Pages SPA 回退
└── .nojekyll           ← 来自 public/，GitHub Pages 不跑 Jekyll
```

❌ 本地 build 都报错的话，先修错误，不要推到云端。

---

## 1. Vercel 部署（推荐）

### 1.0 ⚠️ 目录结构：项目在仓库的子目录 `OBELISK_v10/` 里

仓库根目录没有 `package.json`，Vercel 从仓库根导入时会「找不到项目」，构建产物为空 → 访问就是 404 / 白屏。
两种任选其一即可（**仓库根的 [../vercel.json](../vercel.json) 已经帮你做好了方案 A**）：

- **方案 A（默认，已配置）**：保持 Vercel 项目的 **Root Directory = 仓库根**，根目录的 `vercel.json` 会执行
  `npm --prefix OBELISK_v10 install` / `npm --prefix OBELISK_v10 run build`，输出目录为 `OBELISK_v10/dist`。
- **方案 B**：Vercel Dashboard → Project → Settings → General → **Root Directory** 填 `OBELISK_v10` → Save → Redeploy。
  此时生效的是本目录下的 `vercel.json`。

改完之后必须 **Redeploy 且不要勾选 Use existing Build Cache**。

### 1.1 核心配置文件：`vercel.json`（本项目已生成）

根目录已生成 [vercel.json](vercel.json)，内容包含：

```json
{
  "rewrites": [{ "source": "/((?!assets/|.*\\..*).*)", "destination": "/index.html" }],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

👉 **这个文件一推，Vercel 就按这里的配置走，不用再去 Dashboard 手动改 Settings。**

### 1.2 部署方式 A：GitHub 自动部署（推荐）

1. 把代码推到 GitHub 仓库
2. Vercel Dashboard → **Add New → Project** → Import 你的仓库
3. **Framework Preset**：选 **Vite**（或者自动识别到就行）
4. 其他 3 项直接让它读取 `vercel.json`：
   - Build Command：`npm run build`
   - Output Directory：`dist`
   - Install Command：留空（Vercel 默认 npm install）
5. **Environment Variables**（关键！）→ 添加 6 个 `VITE_FIREBASE_*` 变量（参考 `.env.example`）
6. 点 **Deploy**
7. 部署完成后点 **Continue to Dashboard → Visit** 即可访问

### 1.3 部署方式 B：Vercel CLI

```powershell
npm install -g vercel
vercel login
cd "项目根目录"
vercel            # 首次部署，跟着向导，最后会得到预览域名
vercel --prod     # 正式推到生产域名
```

### 1.4 Vercel 仍然 404？按这个顺序排查

| 现象 | 排查步骤 |
|------|---------|
| 根域名 `/` 404 | 1. 打开最近一次 Deployment → Build Log 最后 30 行，看有没有 `built in xxxms`。<br>2. Build Log 里找 `Output Directory` 是不是 `dist`。<br>3. Build 完点 Deployment 页的 **Output → Files**，确认列表里有 `index.html`。 |
| 根页正常、刷新子路由 `/beike` 404 | 说明 `vercel.json` 的 rewrites 没推上去，或者 Vercel 没读到。<br>1. 在 Vercel 项目 → **Git → Connected Git Repository** 确认是你推的分支。<br>2. 点一下 **Redeploy**（不要勾选「Use existing Build Cache」）。 |
| 静态资源 `.css/.js` 404 | 打开 F12 → Network，看请求的路径对不对。<br>如果你部署在 Vercel 自定义子路径，需要在项目设置里加环境变量 `VITE_BASE_PATH=/你的子路径/`，然后 **Redeploy**。 |
| 白屏但没有 404 | 这已经不是 404 范畴了。F12 → Console 看报错，通常是 Firebase 凭证没配，见 [FIREBASE_SETUP.md](FIREBASE_SETUP.md)。 |

---

## 2. Firebase Hosting 部署

### 2.1 核心配置文件：`firebase.json`（本项目已生成）

根目录已生成 [firebase.json](firebase.json)，里面配置了：

- `public: "dist"` → **不要改**，Vite 构建产物在 `dist/`
- `rewrites: [{ source: "**", destination: "/index.html" }]` → **SPA 核心**，解决刷新 404

### 2.2 部署步骤

```powershell
# 1. 安装 Firebase CLI
npm install -g firebase-tools

# 2. 登录（浏览器弹窗授权）
firebase login

# 3. 关联项目（如果 firebase.json 里还没绑定 projectId）
firebase use your-project-id

# 4. 先本地构建（每次部署前都会自动跑，保险起见手动执行一次）
npm run build

# 5. 部署 Hosting 前端文件
firebase deploy --only hosting
```

✅ 成功后命令行会打印：
```
✔  Deploy complete!
Hosting URL: https://你的项目名.web.app
```

### 2.3 Firebase Hosting 仍然 404？

| 现象 | 排查 |
|------|------|
| 根 `/` 404 | 1. `dist/` 里有没有 `index.html`？（没 build 成功）<br>2. `firebase.json` 里 `public` 是不是写了 `"build"` 而不是 `"dist"`？<br>3. 执行 `firebase deploy --only hosting --debug`，看最后上传了几个文件。 |
| 刷新子路由 404 | 确认 `firebase.json → hosting → rewrites` 存在且和本项目配置一致。然后重新 `firebase deploy --only hosting`。 |
| 配了自定义域还是默认域 | Firebase Console → Hosting → Add custom domain，按提示配 DNS 验证。 |

---

## 3. GitHub Pages 部署（最容易 404，因为默认带子路径）

### 3.1 关键概念：base path

GitHub Pages 默认地址是：
```
https://<你的用户名>.github.io/<仓库名>/
                                ↑↑↑↑↑↑↑↑
                              这就是 base path
```
Vite 默认 `base: '/'`，所有静态资源都请求 `/assets/xxx.js`，
但 Pages 实际需要的是 `/<仓库名>/assets/xxx.js` → **404**。

### 3.2 部署步骤

#### 方式 A：Pages 部署到 gh-pages 分支（推荐）

1. 准备环境变量，在 `.env` 中追加：
   ```env
   VITE_BASE_PATH=/你的仓库名/
   ```
2. 重新构建：
   ```powershell
   npm run build
   ```
3. 把 `dist/` 推到 `gh-pages` 分支（推荐用官方包）：
   ```powershell
   npx -y gh-pages -d dist
   ```
4. GitHub 仓库 → **Settings → Pages**：
   - **Source**：Deploy from a branch
   - **Branch**：`gh-pages` → `/ (root)`
   - **Save**

#### 方式 B：用 GitHub Actions 自动部署（进阶，推荐）

把下面文件放到 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: echo "VITE_BASE_PATH=/${{ github.event.repository.name }}/" >> $GITHUB_ENV
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```

然后仓库 Settings → Pages → Source 改为 **GitHub Actions**。

### 3.3 GitHub Pages 仍然 404？

| 现象 | 原因 & 修复 |
|------|------------|
| 根就 404 | 1. 等 1-5 分钟，Pages 生效有延迟。<br>2. 仓库是否 Public？Private repo 需要 Pro 才能用 Pages。<br>3. Settings → Pages 里 Branch 选的是不是 `gh-pages / root`？ |
| 页面打开了但 CSS/JS 404（白屏没样式） | **99% 是 base path 问题！**<br>F12 → Network 看请求的资源 URL。正确的应该是 `/仓库名/assets/...`，如果只有 `/assets/...` → 说明 build 时没设 `VITE_BASE_PATH=/仓库名/`。重新设并 build。 |
| 首页正常，刷新子路由 404 | `public/404.html` 和 `public/.nojekyll` 已在本项目提供。如果没生效，检查它们是否被正确复制到了 `dist/` 里（构建后看 dist 目录）。 |

---

## 4. 三平台部署配置对照表

| 配置项 | Vercel | Firebase Hosting | GitHub Pages |
|--------|--------|------------------|--------------|
| 配置文件 | `vercel.json` ✅ | `firebase.json` ✅ | `.env` + workflow YML |
| SPA 刷新不 404 的关键 | `rewrites` 到 `/index.html` | `hosting.rewrites` 到 `/index.html` | `public/404.html` + hash 回跳 |
| 构建输出目录 | `dist` | `public: "dist"` | `dist` → 推到 `gh-pages` 分支 |
| base path | 配 `VITE_BASE_PATH` 环境变量 | 通常不用（根域名） | **必须** `VITE_BASE_PATH=/仓库名/` |
| 环境变量注入 | Project → Settings → Environment Variables | `firebase functions:config`（前端用 env 变量） | Repo → Settings → Secrets and variables → Actions |
| 自定义域名 | Project → Settings → Domains | Hosting → Add custom domain | Repo → Settings → Pages → Custom domain |

---

## 5. 常见报错速查

### ❌ `404: NOT_FOUND` / `Code: NOT_FOUND`
→ **先查最近一次部署的 Build Log 最后 50 行**，90% 情况是构建就失败了，根本没生成 `index.html`。

### ❌ `404 The requested resource was not found on this server.`
→ SPA rewrite 没生效：
- Vercel：`vercel.json` 没推 / 没读到，重新 deploy（清 cache）
- Firebase：`firebase.json` 的 `rewrites` 被删了，重新 deploy --only hosting
- Pages：`public/404.html` 不在 `dist/` 里，或访问路径没通过 hash 正确回跳

### ❌ `Failed to resolve module specifier "react"` / `Loading module ... was blocked`
→ 构建产物的 base path 不对（资源路径 `/assets/xxx.js` 被当成绝对路径 404）。对于 Pages：`VITE_BASE_PATH=/仓库名/` 重建。

### ❌ 打开站点后右下角弹「Firebase 未配置」
→ 不是 404，是前端跑起来了但 env 变量没注进去。
- Vercel：去 Settings → Environment Variables 加 6 个 `VITE_FIREBASE_*` → Save → 回到 Deployments，点最新那条右侧 ⋮ → **Redeploy**
- GitHub Pages Actions：仓库 Settings → Secrets → Variables，添加 Repository Secrets → Secrets（**不是 Variables**，是 Secrets），变量名和 `.env.example` 一致
- Firebase Hosting：构建前确保 `.env` 文件在本地且有真实值，再 `npm run build`

---

## 6. 环境变量清单（三个平台都通用）

| 变量名 | 来源 | 必填 |
|--------|------|------|
| `VITE_FIREBASE_API_KEY` | Firebase Console → 项目设置 → Web API Key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | 项目设置 → 你的应用 → Auth Domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | 项目设置 → Project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | 项目设置 → Storage Bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 项目设置 → Sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | 项目设置 → App ID | ✅ |
| `VITE_BASE_PATH` | 只有部署在子路径（Pages、Vercel 自定义目录）才需要，例如 `/OBELISK/` | ⬜ |
