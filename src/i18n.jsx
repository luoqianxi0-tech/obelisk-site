import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  zh: {
    siteName: '方尖碑',
    nav: {
      home: '主页', stele: '碑刻', aggregate: '聚合', index: '索引',
      design: '设计', labs: '靶场', projects: '项目', writeups: '笔记',
      profile: '个人', admin: '管理', settings: '设置', newPost: '发帖'
    },
    auth: { login: '登录', logout: '退出', guest: '访客', adminBadge: 'ADMIN', rootAccess: 'ROOT ACCESS GRANTED' },
    home: {
      welcome: '欢迎来到方尖碑', explore: '探索', stats: '社区统计',
      recentPosts: '最新碑刻', featuredResources: '精选资源',
      hotTopics: '热门话题', activeGroups: '活跃圈子',
      totalUsers: '用户', totalPosts: '碑刻', totalResources: '资源', totalProjects: '项目'
    },
    stele: {
      title: '碑刻',
      all: '全部动态', following: '我的关注', trending: '热门趋势',
      groups: '圈子', tags: '话题', newPost: '发布碑刻',
      placeholder: '分享你的想法、代码或发现...',
      placeholderImage: '拖拽图片到此处，或点击上传',
      addTag: '添加标签', tagHint: '按回车添加标签',
      comment: '评论', like: '赞', collect: '收藏', share: '分享',
      follow: '关注', followingBtn: '已关注', followers: '粉丝', members: '成员',
      noPosts: '这里还没有内容', noFollowing: '你还没有关注任何人',
      noFollowingDesc: '关注感兴趣的创作者，在这里查看他们的动态',
      discoverUsers: '发现创作者', hotThisWeek: '本周热门',
      topLiked: '最多点赞', mostDiscussed: '最多讨论',
      joinGroup: '加入圈子', leaveGroup: '退出圈子', groupDesc: '圈子介绍',
      groupActivity: '活跃度', groupRules: '圈子规则', relatedGroups: '相关圈子',
      postDetail: '帖子详情', replies: '回复', writeReply: '写下你的回复...',
      author: '作者', publishedAt: '发布于', views: '浏览',
      privacy: '可见范围', public: '公开', followersOnly: '仅粉丝', private: '私密'
    },
    aggregate: {
      title: '聚合入口', search: '搜索资源', category: '分类',
      add: '添加资源', import: '批量导入', all: '全部',
      dev: '开发工具', design: '设计资源', docs: '技术文档',
      media: '媒体素材', ai: 'AI 工具', infra: '基础设施', learn: '学习资源',
      security: '安全工具', osint: 'OSINT', crypto: '密码学',
      popular: '热门', newest: '最新', bookmarked: '已收藏'
    },
    index: {
      title: '索引', tools: '工具', docs: '文档', systems: '系统',
      search: '搜索工具、文档或系统...', all: '全部',
      reverse: '逆向', pwn: 'Pwn', web: 'Web', crypto: 'Crypto',
      forensics: '取证', misc: '杂项', mobile: '移动安全'
    },
    design: { title: '设计', resources: '资源库', articles: '文章', works: '作品', search: '搜索...' },
    labs: {
      title: '靶场记录', subtitle: 'CTF 竞赛与渗透测试实战记录',
      difficulty: '难度', type: '类型', status: '状态',
      solved: '已攻克', unsolved: '未攻克', inProgress: '进行中',
      easy: '入门', medium: '中等', hard: '困难', insane: '地狱',
      web: 'Web', pwn: 'Pwn', reverse: 'Reverse', crypto: 'Crypto',
      forensics: 'Forensics', misc: 'Misc', blockchain: 'Blockchain',
      points: '积分', rating: '评分', writeup: '解题报告',
      target: '目标', noLabs: '暂无靶场记录', addLab: '记录靶场'
    },
    projects: {
      title: '完整项目', subtitle: '从构思到交付的体系化工程产出',
      techStack: '技术栈', status: '状态', demo: '演示', source: '源码',
      completed: '已完成', inProgress: '进行中', planned: '规划中',
      noProjects: '暂无项目', addProject: '新建项目',
      description: '项目描述', features: '功能特性', milestones: '里程碑'
    },
    writeups: {
      title: '漏洞复现笔记', subtitle: 'CVE 分析与漏洞研究体系化笔记',
      cve: 'CVE编号', severity: '严重程度', cvss: 'CVSS',
      poc: 'POC', patch: '补丁', references: '参考链接',
      critical: '严重', high: '高危', medium: '中危', low: '低危',
      noWriteups: '暂无笔记', addWriteup: '新建笔记',
      reproduction: '复现步骤', impact: '影响范围', mitigation: '缓解措施'
    },
    profile: {
      title: '个人主页', agent: 'Agent 状态', connect: '连接 Agent',
      disconnect: '断开', cpu: 'CPU', traffic: '流量', memory: '内存',
      editProfile: '编辑资料', bio: '个人简介', location: '位置',
      website: '网站', recentPosts: '最近帖子', activity: '活动概览',
      posts: '帖子', collections: '收藏', arsenal: '军火库',
      following: '关注', followers: '粉丝', groups: '圈子'
    },
    admin: {
      title: '管理面板', addResource: '添加资源', upload: '上传文件',
      batch: '批量导入', users: '用户管理', stats: '数据统计',
      resources: '资源管理', posts: '碑刻管理', labs: '靶场管理'
    },
    settings: {
      title: '设置', language: '语言', theme: '主题',
      notifications: '通知', privacy: '隐私', public: '公开',
      followersOnly: '仅粉丝', private: '私密', save: '保存',
      cancel: '取消', delete: '删除', edit: '编辑', confirm: '确认',
      loading: '加载中...', empty: '暂无内容', error: '出错了',
      retry: '重试', more: '更多', back: '返回'
    }
  },
  en: {
    siteName: 'OBELISK',
    nav: {
      home: 'Home', stele: 'Stele', aggregate: 'Aggregate', index: 'Index',
      design: 'Design', labs: 'Labs', projects: 'Projects', writeups: 'Writeups',
      profile: 'Profile', admin: 'Admin', settings: 'Settings', newPost: 'Post'
    },
    auth: { login: 'Login', logout: 'Logout', guest: 'Guest', adminBadge: 'ADMIN', rootAccess: 'ROOT ACCESS GRANTED' },
    home: {
      welcome: 'Welcome to OBELISK', explore: 'Explore', stats: 'Community Stats',
      recentPosts: 'Latest Posts', featuredResources: 'Featured Resources',
      hotTopics: 'Hot Topics', activeGroups: 'Active Groups',
      totalUsers: 'Users', totalPosts: 'Posts', totalResources: 'Resources', totalProjects: 'Projects'
    },
    stele: {
      title: 'Stele',
      all: 'All Feed', following: 'Following', trending: 'Trending',
      groups: 'Groups', tags: 'Tags', newPost: 'New Post',
      placeholder: 'Share your thoughts, code or discoveries...',
      placeholderImage: 'Drop images here or click to upload',
      addTag: 'Add Tags', tagHint: 'Press Enter to add tag',
      comment: 'Comment', like: 'Like', collect: 'Collect', share: 'Share',
      follow: 'Follow', followingBtn: 'Following', followers: 'Followers', members: 'Members',
      noPosts: 'No content yet', noFollowing: 'You are not following anyone',
      noFollowingDesc: 'Follow creators to see their updates here',
      discoverUsers: 'Discover Creators', hotThisWeek: 'Hot This Week',
      topLiked: 'Most Liked', mostDiscussed: 'Most Discussed',
      joinGroup: 'Join Group', leaveGroup: 'Leave Group', groupDesc: 'About',
      groupActivity: 'Activity', groupRules: 'Rules', relatedGroups: 'Related Groups',
      postDetail: 'Post Detail', replies: 'Replies', writeReply: 'Write a reply...',
      author: 'Author', publishedAt: 'Published', views: 'Views',
      privacy: 'Visibility', public: 'Public', followersOnly: 'Followers Only', private: 'Private'
    },
    aggregate: {
      title: 'Aggregate', search: 'Search resources', category: 'Category',
      add: 'Add Resource', import: 'Batch Import', all: 'All',
      dev: 'Dev Tools', design: 'Design Resources', docs: 'Documentation',
      media: 'Media', ai: 'AI Tools', infra: 'Infrastructure', learn: 'Learning',
      security: 'Security', osint: 'OSINT', crypto: 'Crypto',
      popular: 'Popular', newest: 'Newest', bookmarked: 'Bookmarked'
    },
    index: {
      title: 'Index', tools: 'Tools', docs: 'Docs', systems: 'Systems',
      search: 'Search tools, docs or systems...', all: 'All',
      reverse: 'Reverse', pwn: 'Pwn', web: 'Web', crypto: 'Crypto',
      forensics: 'Forensics', misc: 'Misc', mobile: 'Mobile'
    },
    design: { title: 'Design', resources: 'Resources', articles: 'Articles', works: 'Works', search: 'Search...' },
    labs: {
      title: 'Labs', subtitle: 'CTF competitions & penetration testing records',
      difficulty: 'Difficulty', type: 'Type', status: 'Status',
      solved: 'Solved', unsolved: 'Unsolved', inProgress: 'In Progress',
      easy: 'Easy', medium: 'Medium', hard: 'Hard', insane: 'Insane',
      web: 'Web', pwn: 'Pwn', reverse: 'Reverse', crypto: 'Crypto',
      forensics: 'Forensics', misc: 'Misc', blockchain: 'Blockchain',
      points: 'Points', rating: 'Rating', writeup: 'Writeup',
      target: 'Target', noLabs: 'No labs yet', addLab: 'Add Lab'
    },
    projects: {
      title: 'Projects', subtitle: 'End-to-end engineering deliverables',
      techStack: 'Tech Stack', status: 'Status', demo: 'Demo', source: 'Source',
      completed: 'Completed', inProgress: 'In Progress', planned: 'Planned',
      noProjects: 'No projects yet', addProject: 'New Project',
      description: 'Description', features: 'Features', milestones: 'Milestones'
    },
    writeups: {
      title: 'Writeups', subtitle: 'Systematic CVE analysis & vulnerability research',
      cve: 'CVE', severity: 'Severity', cvss: 'CVSS',
      poc: 'POC', patch: 'Patch', references: 'References',
      critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
      noWriteups: 'No writeups yet', addWriteup: 'New Writeup',
      reproduction: 'Reproduction Steps', impact: 'Impact', mitigation: 'Mitigation'
    },
    profile: {
      title: 'Profile', agent: 'Agent Status', connect: 'Connect Agent',
      disconnect: 'Disconnect', cpu: 'CPU', traffic: 'Traffic', memory: 'Memory',
      editProfile: 'Edit Profile', bio: 'Bio', location: 'Location',
      website: 'Website', recentPosts: 'Recent Posts', activity: 'Activity',
      posts: 'Posts', collections: 'Collections', arsenal: 'Arsenal',
      following: 'Following', followers: 'Followers', groups: 'Groups'
    },
    admin: {
      title: 'Admin Panel', addResource: 'Add Resource', upload: 'Upload',
      batch: 'Batch Import', users: 'Users', stats: 'Stats',
      resources: 'Resources', posts: 'Posts', labs: 'Labs'
    },
    settings: {
      title: 'Settings', language: 'Language', theme: 'Theme',
      notifications: 'Notifications', privacy: 'Privacy', public: 'Public',
      followersOnly: 'Followers Only', private: 'Private', save: 'Save',
      cancel: 'Cancel', delete: 'Delete', edit: 'Edit', confirm: 'Confirm',
      loading: 'Loading...', empty: 'No content yet', error: 'Error',
      retry: 'Retry', more: 'More', back: 'Back'
    }
  }
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('obelisk-lang') || 'zh')

  const t = useCallback((key) => {
    const keys = key.split('.')
    let val = translations[lang]
    for (const k of keys) {
      val = val?.[k]
      if (val === undefined) break
    }
    return val !== undefined ? val : key
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
