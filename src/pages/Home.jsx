import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { t } from '../i18n.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { 
  MessageSquare, Globe, Wrench, Palette, ArrowRight, 
  TrendingUp, Users, Zap, BookOpen, Layers, Star, Clock 
} from 'lucide-react'
import { db } from '../firebase.js'
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore'

function StatItem({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl bg-obelisk-surfaceDark flex items-center justify-center">
        <Icon className="w-5 h-5 text-obelisk-line" />
      </div>
      <div>
        <p className="text-lg font-bold text-obelisk-line">{value}</p>
        <p className="text-xs text-obelisk-textMuted">{label}</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ posts: 0, users: 0, resources: 0, designs: 0 })
  const [recentPosts, setRecentPosts] = useState([])
  const [featuredResources, setFeaturedResources] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const postsSnap = await getDocs(query(collection(db, 'stele_posts'), limit(100)))
        const usersSnap = await getDocs(query(collection(db, 'users'), limit(100)))
        const resourcesSnap = await getDocs(query(collection(db, 'resources'), limit(100)))
        const designsSnap = await getDocs(query(collection(db, 'design_items'), limit(100)))

        setStats({
          posts: postsSnap.size,
          users: usersSnap.size,
          resources: resourcesSnap.size,
          designs: designsSnap.size
        })
      } catch (e) {
        console.error('Stats fetch error:', e)
      }
    }
    fetchStats()

    const q = query(collection(db, 'stele_posts'), orderBy('createdAt', 'desc'), limit(5))
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setRecentPosts(items)
    })

    const fetchResources = async () => {
      try {
        const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(6))
        const snap = await getDocs(q)
        setFeaturedResources(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error('Resources fetch error:', e)
      }
    }
    fetchResources()

    return () => unsub()
  }, [])

  const sections = [
    { 
      title: '碑刻', 
      subtitle: '极客社交平台', 
      icon: MessageSquare, 
      path: '/stele',
      color: 'bg-obelisk-line',
      desc: '发帖、评论、关注、私信、圈子、话题标签'
    },
    { 
      title: '聚合入口', 
      subtitle: '资源导航', 
      icon: Globe, 
      path: '/aggregate',
      color: 'bg-obelisk-textMuted',
      desc: '分类索引、搜索、收藏、批量导入'
    },
    { 
      title: '索引', 
      subtitle: '工具与文档', 
      icon: Wrench, 
      path: '/index',
      color: 'bg-obelisk-textLight',
      desc: '工具箱、技术文档、系统资源'
    },
    { 
      title: '设计', 
      subtitle: '创意空间', 
      icon: Palette, 
      path: '/design',
      color: 'bg-obelisk-border',
      desc: '设计资源库、文章教程、作品展示'
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative px-4 sm:px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-obelisk-line mb-6">
              OBELISK
            </h1>
            <div className="w-24 h-[2px] bg-obelisk-line mx-auto mb-6" />
            <p className="text-lg md:text-xl text-obelisk-textMuted max-w-2xl mx-auto leading-relaxed">
              {t('tagline')}
            </p>

            {!user && (
              <div className="mt-8 flex justify-center gap-4">
                <Link to="/stele" className="btn-primary">
                  开始探索 <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
                <Link to="/aggregate" className="btn-secondary">
                  浏览资源
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-2xl p-6 mb-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatItem icon={MessageSquare} label="碑刻帖子" value={stats.posts} delay={0} />
              <StatItem icon={Users} label="社区用户" value={stats.users} delay={0.1} />
              <StatItem icon={Layers} label="聚合资源" value={stats.resources} delay={0.2} />
              <StatItem icon={Palette} label="设计作品" value={stats.designs} delay={0.3} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {sections.map((section, i) => (
              <GlassCard key={section.path} delay={i * 0.1}>
                <Link to={section.path} className="block group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-obelisk-textLight group-hover:text-obelisk-line transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-obelisk-line mb-1">{section.title}</h3>
                  <p className="text-sm text-obelisk-textMuted mb-2">{section.subtitle}</p>
                  <p className="text-sm text-obelisk-textLight">{section.desc}</p>
                </Link>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            <div className="lg:col-span-2">
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-obelisk-line flex items-center gap-2">
                    <Clock className="w-5 h-5" /> 最新碑刻
                  </h3>
                  <Link to="/stele" className="text-sm text-obelisk-textMuted hover:text-obelisk-line transition-colors">
                    查看全部
                  </Link>
                </div>

                {recentPosts.length === 0 ? (
                  <div className="text-center py-12 text-obelisk-textLight">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>暂无帖子，来发布第一条吧</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPosts.map(post => (
                      <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-obelisk-surfaceDark/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-obelisk-surfaceDark flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold">{post.authorName?.[0] || 'U'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-obelisk-line truncate">{post.title || '无标题'}</p>
                          <p className="text-xs text-obelisk-textMuted mt-1 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-obelisk-textLight">
                            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {post.likes?.length || 0}</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            <div>
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-obelisk-line flex items-center gap-2">
                    <Zap className="w-5 h-5" /> 精选资源
                  </h3>
                  <Link to="/aggregate" className="text-sm text-obelisk-textMuted hover:text-obelisk-line transition-colors">
                    更多
                  </Link>
                </div>

                {featuredResources.length === 0 ? (
                  <div className="text-center py-12 text-obelisk-textLight">
                    <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>暂无资源</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {featuredResources.map(res => (
                      <a 
                        key={res.id} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl hover:bg-obelisk-surfaceDark/50 transition-colors"
                      >
                        <p className="text-sm font-medium text-obelisk-line">{res.title}</p>
                        <p className="text-xs text-obelisk-textMuted mt-1">{res.category}</p>
                      </a>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <GlassCard>
              <h3 className="text-lg font-bold text-obelisk-line mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> 热门话题
              </h3>
              <div className="flex flex-wrap gap-2">
                {['#前端开发', '#UI设计', '#开源工具', '#独立开发', '#极客生活', '#数据结构', '#算法', '#架构设计'].map(tag => (
                  <Link 
                    key={tag} 
                    to={`/stele?tag=${encodeURIComponent(tag)}`}
                    className="tag hover:bg-obelisk-line hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-obelisk-line mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> 活跃圈子
              </h3>
              <div className="space-y-3">
                {['设计方法论', '独立开发者', '开源贡献者', '前端精进'].map(group => (
                  <Link 
                    key={group} 
                    to={`/stele?group=${encodeURIComponent(group)}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-obelisk-surfaceDark/50 transition-colors"
                  >
                    <span className="text-sm font-medium">{group}</span>
                    <ArrowRight className="w-4 h-4 text-obelisk-textLight" />
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  )
}
