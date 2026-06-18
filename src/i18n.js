const translations = {
  zh: {
    siteName: '方尖碑',
    tagline: '极客资源整合与社交平台',
    nav: { home: '主页', stele: '碑刻', aggregate: '聚合入口', index: '索引', design: '设计', profile: '个人', admin: '管理', settings: '设置' },
    auth: { login: '登录', logout: '退出', guest: '访客', adminBadge: '管理员' },
    home: { welcome: '欢迎来到方尖碑', explore: '探索' },
    stele: { title: '碑刻', newPost: '发布', placeholder: '分享你的想法...', comment: '评论', like: '赞', collect: '收藏', follow: '关注', following: '已关注', followers: '粉丝', groups: '圈子', tags: '话题' },
    aggregate: { title: '聚合入口', search: '搜索资源', category: '分类', add: '添加资源', import: '批量导入' },
    index: { title: '索引', tools: '工具', docs: '文档', systems: '系统' },
    design: { title: '设计', resources: '资源库', articles: '文章', works: '作品' },
    profile: { title: '个人主页', agent: 'Agent 状态', connect: '连接 Agent', disconnect: '断开', cpu: 'CPU', traffic: '流量', memory: '内存' },
    admin: { title: '管理面板', addResource: '添加资源', upload: '上传文件', batch: '批量导入', users: '用户管理', stats: '数据统计' },
    settings: { title: '设置', language: '语言', theme: '主题', notifications: '通知', privacy: '隐私' },
    common: { save: '保存', cancel: '取消', delete: '删除', edit: '编辑', confirm: '确认', loading: '加载中...', empty: '暂无内容', error: '出错了', retry: '重试' }
  },
  en: {
    siteName: 'OBELISK',
    tagline: 'Geek Resource & Social Platform',
    nav: { home: 'Home', stele: 'Stele', aggregate: 'Aggregate', index: 'Index', design: 'Design', profile: 'Profile', admin: 'Admin', settings: 'Settings' },
    auth: { login: 'Login', logout: 'Logout', guest: 'Guest', adminBadge: 'ADMIN' },
    home: { welcome: 'Welcome to OBELISK', explore: 'Explore' },
    stele: { title: 'Stele', newPost: 'Post', placeholder: 'Share your thoughts...', comment: 'Comment', like: 'Like', collect: 'Collect', follow: 'Follow', following: 'Following', followers: 'Followers', groups: 'Groups', tags: 'Tags' },
    aggregate: { title: 'Aggregate', search: 'Search resources', category: 'Category', add: 'Add Resource', import: 'Batch Import' },
    index: { title: 'Index', tools: 'Tools', docs: 'Docs', systems: 'Systems' },
    design: { title: 'Design', resources: 'Resources', articles: 'Articles', works: 'Works' },
    profile: { title: 'Profile', agent: 'Agent Status', connect: 'Connect Agent', disconnect: 'Disconnect', cpu: 'CPU', traffic: 'Traffic', memory: 'Memory' },
    admin: { title: 'Admin Panel', addResource: 'Add Resource', upload: 'Upload', batch: 'Batch Import', users: 'Users', stats: 'Stats' },
    settings: { title: 'Settings', language: 'Language', theme: 'Theme', notifications: 'Notifications', privacy: 'Privacy' },
    common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', confirm: 'Confirm', loading: 'Loading...', empty: 'No content yet', error: 'Error', retry: 'Retry' }
  }
}

let currentLang = 'zh'

export const setLang = (lang) => { currentLang = lang }
export const getLang = () => currentLang
export const t = (key) => {
  const keys = key.split('.')
  let val = translations[currentLang]
  for (const k of keys) {
    val = val?.[k]
    if (!val) break
  }
  return val || key
}
export const toggleLang = () => {
  currentLang = currentLang === 'zh' ? 'en' : 'zh'
  return currentLang
}
