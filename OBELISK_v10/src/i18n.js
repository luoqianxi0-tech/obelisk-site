import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  zh: {
    translation: {
      nav: {
        home: '首页',
        beike: '碑刻',
        circle: '圈子',
        arsenal: '军火库',
        design: '设计',
        admin: '管理',
        settings: '设置',
      },
      auth: {
        login: '登录',
        logout: '退出',
        loginPrompt: '请登录以继续',
        rootAccess: 'ROOT ACCESS GRANTED',
      },
      home: {
        subtitle: '一个极简的极客资源整合与社交平台',
        beike: { title: '碑刻', desc: '极客社交平台，分享见解与发现' },
        range: { title: '靶场记录', desc: 'CTF与渗透测试靶场实战记录' },
        projects: { title: '完整项目', desc: '项目复盘与技术沉淀' },
        notes: { title: '技术笔记', desc: '体系化学习产出与知识整理' },
        arsenal: { title: '军火库', desc: '精选安全工具与资源索引' },
        design: { title: '设计', desc: '设计工具与灵感资源' },
        featured: '精选资源',
      },
      beike: {
        discover: '发现',
        following: '关注',
        mine: '我的',
        topics: '话题',
        placeholder: '分享你的想法...',
        addTag: '添加标签',
        imageUrl: '图片URL',
        post: '发布',
        empty: '暂无帖子',
        emptyHint: '成为第一个发帖的人吧',
        loginToView: '登录后查看',
        followingEmpty: '关注的人暂无动态',
        mineEmpty: '你还没有发布任何帖子',
        goPost: '去发布',
        topicsEmpty: '暂无话题',
        posts: '帖子',
      },
      circle: {
        subtitle: '体系化学习产出空间',
        items: '条目',
        enter: '进入',
        range: { title: '靶场记录', desc: 'CTF竞赛与渗透测试靶场实战记录' },
        projects: { title: '完整项目', desc: '完整项目复盘与技术沉淀' },
        vuln: { title: '漏洞复现', desc: '漏洞分析与复现笔记' },
        notes: { title: '技术笔记', desc: '体系化学习笔记与知识整理' },
        filter: { all: '全部', completed: '已完成', 'in-progress': '进行中' },
      },
      arsenal: {
        subtitle: '精选工具与资源索引',
        search: '搜索工具...',
        noResults: '未找到匹配的资源',
      },
      design: {
        subtitle: '设计工具与灵感资源',
      },
      profile: {
        pleaseLogin: '请登录后查看个人主页',
        myPosts: '我的帖子',
        settings: '设置',
        agent: 'Agent 监控',
        posts: '帖子',
        tools: '工具',
        notes: '笔记',
        projects: '项目',
      },
      agent: {
        online: '在线',
        offline: '离线',
        connect: '连接',
        disconnect: '断开',
        setIp: '设置IP',
        ipPlaceholder: '输入Agent IP (默认localhost)',
        traffic: '网络流量',
      },
      admin: {
        importResources: '导入资源',
        importDesc: '批量添加新资源到军火库',
        name: '名称',
        url: '链接',
        desc: '描述',
        tags: '标签',
        addRow: '添加行',
        save: '保存',
        saved: '保存成功',
      },
      settings: {
        language: '语言',
        notifications: '通知',
        notificationsDesc: '通知设置即将上线',
        privacy: '隐私',
        privacyDesc: '隐私设置即将上线',
      },
      common: {
        loading: '加载中...',
        add: '添加',
        delete: '删除',
        confirmDelete: '确定删除？',
        visit: '访问',
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        beike: 'BeiKe',
        circle: 'Circle',
        arsenal: 'Arsenal',
        design: 'Design',
        admin: 'Admin',
        settings: 'Settings',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        loginPrompt: 'Please login to continue',
        rootAccess: 'ROOT ACCESS GRANTED',
      },
      home: {
        subtitle: 'A minimalist geek resource integration and social platform',
        beike: { title: 'BeiKe', desc: 'Geek social platform, share insights and discoveries' },
        range: { title: 'Range Records', desc: 'CTF and pentest range practice records' },
        projects: { title: 'Projects', desc: 'Project retrospectives and technical沉淀' },
        notes: { title: 'Notes', desc: 'Systematic learning output and knowledge organization' },
        arsenal: { title: 'Arsenal', desc: 'Curated security tools and resources' },
        design: { title: 'Design', desc: 'Design tools and inspiration resources' },
        featured: 'Featured Resources',
      },
      beike: {
        discover: 'Discover',
        following: 'Following',
        mine: 'Mine',
        topics: 'Topics',
        placeholder: 'Share your thoughts...',
        addTag: 'Add tag',
        imageUrl: 'Image URL',
        post: 'Post',
        empty: 'No posts yet',
        emptyHint: 'Be the first to post',
        loginToView: 'Login to view',
        followingEmpty: 'No activity from following',
        mineEmpty: 'You have not posted anything yet',
        goPost: 'Go post',
        topicsEmpty: 'No topics yet',
        posts: 'posts',
      },
      circle: {
        subtitle: 'Systematic learning output space',
        items: 'items',
        enter: 'Enter',
        range: { title: 'Range Records', desc: 'CTF and penetration test range records' },
        projects: { title: 'Projects', desc: 'Complete project retrospectives' },
        vuln: { title: 'Vuln Reproduction', desc: 'Vulnerability analysis and reproduction notes' },
        notes: { title: 'Tech Notes', desc: 'Systematic learning notes and knowledge organization' },
        filter: { all: 'All', completed: 'Completed', 'in-progress': 'In Progress' },
      },
      arsenal: {
        subtitle: 'Curated tools and resources index',
        search: 'Search tools...',
        noResults: 'No matching resources found',
      },
      design: {
        subtitle: 'Design tools and inspiration resources',
      },
      profile: {
        pleaseLogin: 'Please login to view profile',
        myPosts: 'My Posts',
        settings: 'Settings',
        agent: 'Agent Monitor',
        posts: 'Posts',
        tools: 'Tools',
        notes: 'Notes',
        projects: 'Projects',
      },
      agent: {
        online: 'Online',
        offline: 'Offline',
        connect: 'Connect',
        disconnect: 'Disconnect',
        setIp: 'Set IP',
        ipPlaceholder: 'Enter Agent IP (default localhost)',
        traffic: 'Network Traffic',
      },
      admin: {
        importResources: 'Import Resources',
        importDesc: 'Batch add new resources to Arsenal',
        name: 'Name',
        url: 'URL',
        desc: 'Description',
        tags: 'Tags',
        addRow: 'Add Row',
        save: 'Save',
        saved: 'Saved successfully',
      },
      settings: {
        language: 'Language',
        notifications: 'Notifications',
        notificationsDesc: 'Notification settings coming soon',
        privacy: 'Privacy',
        privacyDesc: 'Privacy settings coming soon',
      },
      common: {
        loading: 'Loading...',
        add: 'Add',
        delete: 'Delete',
        confirmDelete: 'Confirm delete?',
        visit: 'Visit',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: { escapeValue: false },
  });

export default i18n;
