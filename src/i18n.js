import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  zh: {
    siteName: '方尖碑',
    tagline: '极客资源整合与社交平台',
    nav: { home: '主页', stele: '碑刻', aggregate: '聚合入口', index: '索引', design: '设计', profile: '个人', admin: '管理', settings: '设置' },
    auth: { login: '登录', logout: '退出', guest: '访客', adminBadge: 'ADMIN' },
    home: { welcome: '欢迎来到方尖碑', explore: '探索', stats: '社区统计', recentPosts: '最新碑刻', featuredResources: '精选资源', hotTopics: '热门话题', activeGroups: '活跃圈子' },
    stele: { 
      title: '碑刻', 
      all: '全部动态', following: '我的关注', trending: '热门趋势',
      newPost: '发布', placeholder: '分享你的想法...', comment: '评论', like: '赞', collect: '收藏', follow: '关注', followingBtn: '已关注', followers: '粉丝', groups: '圈子', tags: '话题',
      noPosts: '这里还没有内容', noFollowing: '你还没有关注任何人', noFollowingDesc: '关注感兴趣的创作者，在这里查看他们的动态', discoverUsers: '发现创作者',
      hotThisWeek: '本周热门', topLiked: '最多点赞', mostDiscussed: '最多讨论',
      joinGroup: '加入圈子', leaveGroup: '退出圈子', members: '成员', groupDesc: '圈子介绍', groupActivity: '圈子活跃度'
    },
    aggregate: { title: '聚合入口', search: '搜索资源', category: '分类', add: '添加资源', import: '批量导入', all: '全部', dev: '开发工具', design: '设计资源', docs: '技术文档', media: '媒体素材', ai: 'AI 工具', infra: '基础设施', learn: '学习资源' },
    index: { title: '索引', tools: '工具', docs: '文档', systems: '系统', search: '搜索...' },
    design: { title: '设计', resources: '资源库', articles: '文章', works: '作品', search: '搜索...' },
    profile: { title: '个人主页', agent: 'Agent 状态', connect: '连接 Agent', disconnect: '断开', cpu: 'CPU', traffic: '流量', memory: '内存', editProfile: '编辑资料', bio: '个人简介', location: '位置', website: '网站', recentPosts: '最近帖子', activity: '活动概览', posts: '帖子', collections: '收藏' },
    admin: { title: '管理面板', addResource: '添加资源', upload: '上传文件', batch: '批量导入', users: '用户管理', stats: '数据统计' },
    settings: { title: '设置', language: '语言', theme: '主题', notifications: '通知', privacy: '隐私', public: '公开', followersOnly: '仅粉丝', private: '私密' },
    common: { save: '保存', cancel: '取消', delete: '删除', edit: '编辑', confirm: '确认', loading: '加载中...', empty: '暂无内容', error: '出错了', retry: '重试', more: '更多', back: '返回' }
  },
  en: {
    siteName: 'OBELISK',
    tagline: 'Geek Resource & Social Platform',
    nav: { home: 'Home', stele: 'Stele', aggregate: 'Aggregate', index: 'Index', design: 'Design', profile: 'Profile', admin: 'Admin', settings: 'Settings' },
    auth: { login: 'Login', logout: 'Logout', guest: 'Guest', adminBadge: 'ADMIN' },
    home: { welcome: 'Welcome to OBELISK', explore: 'Explore', stats: 'Community Stats', recentPosts: 'Latest Posts', featuredResources: 'Featured Resources', hotTopics: 'Hot Topics', activeGroups: 'Active Groups' },
    stele: { 
      title: 'Stele', 
      all: 'All Feed', following: 'Following', trending: 'Trending',
      newPost: 'Post', placeholder: 'Share your thoughts...', comment: 'Comment', like: 'Like', collect: 'Collect', follow: 'Follow', followingBtn: 'Following', followers: 'Followers', groups: 'Groups', tags: 'Tags',
      noPosts: 'No content yet', noFollowing: 'You are not following anyone', noFollowingDesc: 'Follow creators to see their updates here', discoverUsers: 'Discover Creators',
      hotThisWeek: 'Hot This Week', topLiked: 'Most Liked', mostDiscussed: 'Most Discussed',
      joinGroup: 'Join Group', leaveGroup: 'Leave Group', members: 'Members', groupDesc: 'About', groupActivity: 'Activity'
    },
    aggregate: { title: 'Aggregate', search: 'Search resources', category: 'Category', add: 'Add Resource', import: 'Batch Import', all: 'All', dev: 'Dev Tools', design: 'Design', docs: 'Docs', media: 'Media', ai: 'AI Tools', infra: 'Infrastructure', learn: 'Learning' },
    index: { title: 'Index', tools: 'Tools', docs: 'Docs', systems: 'Systems', search: 'Search...' },
    design: { title: 'Design', resources: 'Resources', articles: 'Articles', works: 'Works', search: 'Search...' },
    profile: { title: 'Profile', agent: 'Agent Status', connect: 'Connect Agent', disconnect: 'Disconnect', cpu: 'CPU', traffic: 'Traffic', memory: 'Memory', editProfile: 'Edit Profile', bio: 'Bio', location: 'Location', website: 'Website', recentPosts: 'Recent Posts', activity: 'Activity Overview', posts: 'Posts', collections: 'Collections' },
    admin: { title: 'Admin Panel', addResource: 'Add Resource', upload: 'Upload', batch: 'Batch Import', users: 'Users', stats: 'Stats' },
    settings: { title: 'Settings', language: 'Language', theme: 'Theme', notifications: 'Notifications', privacy: 'Privacy', public: 'Public', followersOnly: 'Followers Only', private: 'Private' },
    common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', confirm: 'Confirm', loading: 'Loading...', empty: 'No content yet', error: 'Error', retry: 'Retry', more: 'More', back: 'Back' }
  }
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('zh')

  const t = useCallback((key) => {
    const keys = key.split('.')
    let val = translations[lang]
    for (const k of keys) {
      val = val?.[k]
      if (!val) break
    }
    return val || key
  }, [lang])

  const setLang = useCallback((newLang) => {
    setLangState(newLang)
    localStorage.setItem('obelisk-lang', newLang)
  }, [])

  const toggleLang = useCallback(() => {
    const next = lang === 'zh' ? 'en' : 'zh'
    setLang(next)
    return next
  }, [lang, setLang])

  return (
    <I18nContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be inside I18nProvider')
  return ctx
}
