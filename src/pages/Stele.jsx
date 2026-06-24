import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../firebase.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useI18n } from '../i18n.js'
import GlassCard from '../components/GlassCard.jsx'
import { 
  collection, addDoc, getDocs, query, orderBy, where, 
  serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, onSnapshot, deleteDoc 
} from 'firebase/firestore'
import { 
  MessageSquare, Heart, Bookmark, Share2, Send, X, 
  TrendingUp, Clock, Users, Hash, Search, Trash2, 
  UserPlus, UserCheck, Flame, Award, MessageCircle, ArrowLeft
} from 'lucide-react'

// ========== 圈子配置 ==========
const GROUPS_CONFIG = {
  '设计方法论': { 
    color: 'bg-purple-500', 
    desc: '探讨设计思维、方法论与最佳实践',
    icon: '✦',
    members: 128
  },
  '独立开发者': { 
    color: 'bg-emerald-500', 
    desc: '独立产品、副业变现、一人公司',
    icon: '◈',
    members: 256
  },
  '开源贡献者': { 
    color: 'bg-blue-500', 
    desc: '开源项目、PR  review、社区协作',
    icon: '✹',
    members: 89
  },
  '前端精进': { 
    color: 'bg-amber-500', 
    desc: 'React、Vue、性能优化、工程化',
    icon: '✻',
    members: 342
  },
  '后端架构': { 
    color: 'bg-red-500', 
    desc: '微服务、数据库、高并发、分布式',
    icon: '✺',
    members: 198
  },
  '产品思维': { 
    color: 'bg-cyan-500', 
    desc: '需求分析、用户研究、增长策略',
    icon: '✸',
    members: 167
  },
}

const HOT_TAGS = ['#前端开发', '#UI设计', '#开源工具', '#独立开发', '#极客生活', '#数据结构', '#算法', '#架构设计', '#AI应用', '#DevOps']

// ========== PostCard 组件 ==========
function PostCard({ post, onLike, onCollect, onComment, currentUser, onDelete }) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const isLiked = post.likes?.includes(currentUser?.uid)
  const isCollected = post.collects?.includes(currentUser?.uid)
  const isAuthor = currentUser?.uid === post.authorId
  const { t } = useI18n()

  const handleSubmitComment = () => {
    if (!commentText.trim() || !currentUser) return
    onComment(post.id, commentText)
    setCommentText('')
  }

  return (
    <GlassCard className="mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-obelisk-line flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{post.authorName?.[0] || 'U'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-obelisk-line">{post.authorName || '匿名'}</p>
              <p className="text-xs text-obelisk-textLight">
                {post.createdAt?.toDate?.() ? new Date(post.createdAt.toDate()).toLocaleString() : '刚刚'}
              </p>
            </div>
            {isAuthor && (
              <button onClick={() => onDelete(post.id)} className="p-1 hover:bg-red-50 rounded transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>

          <h4 className="font-bold text-base mt-2 text-obelisk-line">{post.title}</h4>
          <p className="text-sm text-obelisk-text mt-2 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          {post.imageUrl && (
            <img src={post.imageUrl} alt="" className="mt-3 rounded-xl max-h-64 object-cover w-full" />
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.map(tag => (
                <span key={tag} className="tag text-xs">{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-obelisk-border">
            <button 
              onClick={() => onLike(post.id, isLiked)}
              className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-obelisk-textMuted hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes?.length || 0}</span>
            </button>

            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-sm text-obelisk-textMuted hover:text-obelisk-line transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments?.length || 0}</span>
            </button>

            <button 
              onClick={() => onCollect(post.id, isCollected)}
              className={`flex items-center gap-1 text-sm transition-colors ${isCollected ? 'text-amber-500' : 'text-obelisk-textMuted hover:text-amber-500'}`}
            >
              <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-current' : ''}`} />
              <span>{post.collects?.length || 0}</span>
            </button>

            <button className="flex items-center gap-1 text-sm text-obelisk-textMuted hover:text-obelisk-line transition-colors ml-auto">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-3 border-t border-obelisk-border">
                  {post.comments?.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-obelisk-surfaceDark flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">{c.authorName?.[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{c.authorName}</p>
                        <p className="text-sm text-obelisk-text">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  {currentUser && (
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmitComment()}
                        placeholder={t('stele.comment') + '...'}
                        className="flex-1 input-field text-sm py-2"
                      />
                      <button 
                        onClick={handleSubmitComment}
                        className="p-2 bg-obelisk-line text-white rounded-lg hover:bg-black transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  )
}

// ========== 全部动态视图 ==========
function AllFeed({ posts, loading, user, onLike, onCollect, onComment, onDelete, searchQuery, setSearchQuery }) {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const groupFilter = searchParams.get('group')

  const filtered = posts.filter(p => {
    if (groupFilter && p.group !== groupFilter) return false
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q))
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 左侧导航 */}
      <div className="hidden lg:block space-y-4">
        <GlassCard>
          <h3 className="font-bold text-sm mb-4 text-obelisk-line">{t('stele.groups')}</h3>
          <div className="space-y-1">
            {Object.entries(GROUPS_CONFIG).map(([name, config]) => (
              <a
                key={name}
                href={`/stele?group=${encodeURIComponent(name)}`}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  groupFilter === name ? 'bg-obelisk-line text-white' : 'text-obelisk-textMuted hover:bg-obelisk-surfaceDark'
                }`}
              >
                <span className="text-xs">{config.icon}</span>
                {name}
              </a>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 中间帖子 */}
      <div className="lg:col-span-2">
        {groupFilter && (
          <div className="mb-4 p-4 rounded-xl bg-obelisk-surfaceDark/30 border border-obelisk-border">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3 h-3 rounded-full ${GROUPS_CONFIG[groupFilter]?.color || 'bg-obelisk-line'}`} />
              <h3 className="font-bold text-obelisk-line">{groupFilter}</h3>
            </div>
            <p className="text-sm text-obelisk-textMuted">{GROUPS_CONFIG[groupFilter]?.desc}</p>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obelisk-textLight" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('stele.placeholder')}
            className="input-field pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
              <p className="text-obelisk-textMuted mb-2">{t('stele.noPosts')}</p>
              <p className="text-sm text-obelisk-textLight">{groupFilter ? '这个圈子还没有帖子' : '发布第一条帖子，开启社区讨论'}</p>
            </div>
          </GlassCard>
        ) : (
          <div>
            {filtered.map(post => (
              <PostCard key={post.id} post={post} currentUser={user} onLike={onLike} onCollect={onCollect} onComment={onComment} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>

      {/* 右侧热门 */}
      <div className="hidden lg:block space-y-4">
        <GlassCard>
          <h3 className="font-bold text-sm mb-4 text-obelisk-line flex items-center gap-2">
            <Hash className="w-4 h-4" /> {t('stele.tags')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {HOT_TAGS.map(tag => (
              <span key={tag} className="tag text-xs hover:bg-obelisk-line hover:text-white transition-colors cursor-pointer">{tag}</span>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold text-sm mb-4 text-obelisk-line">{t('home.activeGroups')}</h3>
          <div className="space-y-3">
            {Object.entries(GROUPS_CONFIG).map(([name, config]) => (
              <a key={name} href={`/stele?group=${encodeURIComponent(name)}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-obelisk-surfaceDark/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${config.color}`} />
                  <span className="text-sm">{name}</span>
                </div>
                <span className="text-xs text-obelisk-textLight">{config.members}</span>
              </a>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// ========== 我的关注视图 ==========
function FollowingFeed({ posts, loading, user, onLike, onCollect, onComment, onDelete }) {
  const { t } = useI18n()
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
        setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.uid !== user?.uid).slice(0, 8))
      } catch (e) { console.error(e) }
    }
    fetchUsers()
  }, [user])

  const followingIds = user ? (posts.find(p => p.authorId === user.uid)?.authorId ? [] : []) : []
  // 简化：显示所有帖子中作者不是当前用户的作为"推荐"
  const recommendedPosts = posts.filter(p => p.authorId !== user?.uid).slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <GlassCard className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-obelisk-surfaceDark flex items-center justify-center">
              <Users className="w-5 h-5 text-obelisk-line" />
            </div>
            <div>
              <h3 className="font-bold text-obelisk-line">{t('stele.following')}</h3>
              <p className="text-sm text-obelisk-textMuted">{t('stele.noFollowingDesc')}</p>
            </div>
          </div>
        </GlassCard>

        {recommendedPosts.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
              <p className="text-obelisk-textMuted mb-2">{t('stele.noFollowing')}</p>
              <p className="text-sm text-obelisk-textLight">{t('stele.noFollowingDesc')}</p>
            </div>
          </GlassCard>
        ) : (
          <div>
            {recommendedPosts.map(post => (
              <PostCard key={post.id} post={post} currentUser={user} onLike={onLike} onCollect={onCollect} onComment={onComment} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <GlassCard>
          <h3 className="font-bold text-sm mb-4 text-obelisk-line flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> {t('stele.discoverUsers')}
          </h3>
          <div className="space-y-3">
            {allUsers.map(u => (
              <div key={u.uid} className="flex items-center gap-3 p-2 rounded-lg hover:bg-obelisk-surfaceDark/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-obelisk-line flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{u.displayName?.[0] || 'U'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.displayName || 'User'}</p>
                  <p className="text-xs text-obelisk-textMuted">@{u.handle || 'user'}</p>
                </div>
                <button className="px-3 py-1 text-xs bg-obelisk-line text-white rounded-lg hover:bg-black transition-colors">
                  {t('stele.follow')}
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// ========== 热门趋势视图 ==========
function TrendingFeed({ posts, loading, user, onLike, onCollect, onComment, onDelete }) {
  const { t } = useI18n()

  const hotPosts = [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 10)
  const discussedPosts = [...posts].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)).slice(0, 5)

  // 统计话题热度
  const tagCounts = {}
  posts.forEach(p => {
    p.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  return (
    <div className="space-y-6">
      {/* 趋势头部 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-obelisk-line">{posts.length}</p>
              <p className="text-xs text-obelisk-textMuted">{t('stele.hotThisWeek')}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-obelisk-line">{hotPosts[0]?.likes?.length || 0}</p>
              <p className="text-xs text-obelisk-textMuted">{t('stele.topLiked')}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-obelisk-line">{discussedPosts[0]?.comments?.length || 0}</p>
              <p className="text-xs text-obelisk-textMuted">{t('stele.mostDiscussed')}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 热门话题排行 */}
      <GlassCard>
        <h3 className="font-bold text-lg mb-4 text-obelisk-line flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> {t('home.hotTopics')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topTags.map(([tag, count], i) => (
            <div key={tag} className="flex items-center gap-3 p-3 rounded-xl bg-obelisk-surfaceDark/30">
              <span className="text-lg font-bold text-obelisk-textLight">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{tag}</p>
                <p className="text-xs text-obelisk-textMuted">{count} 帖子</p>
              </div>
            </div>
          ))}
          {topTags.length === 0 && <p className="text-sm text-obelisk-textMuted col-span-4 text-center py-4">暂无话题数据</p>}
        </div>
      </GlassCard>

      {/* 热门帖子 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold text-sm mb-4 text-obelisk-line flex items-center gap-2">
            <Heart className="w-4 h-4" /> {t('stele.topLiked')}
          </h3>
          {hotPosts.length === 0 ? (
            <GlassCard><p className="text-center py-8 text-obelisk-textMuted">{t('common.empty')}</p></GlassCard>
          ) : (
            hotPosts.map(post => (
              <PostCard key={post.id} post={post} currentUser={user} onLike={onLike} onCollect={onCollect} onComment={onComment} onDelete={onDelete} />
            ))
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm mb-4 text-obelisk-line flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> {t('stele.mostDiscussed')}
          </h3>
          {discussedPosts.length === 0 ? (
            <GlassCard><p className="text-center py-8 text-obelisk-textMuted">{t('common.empty')}</p></GlassCard>
          ) : (
            discussedPosts.map(post => (
              <PostCard key={post.id} post={post} currentUser={user} onLike={onLike} onCollect={onCollect} onComment={onComment} onDelete={onDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ========== 圈子独立页面 ==========
function GroupPage({ groupName, posts, user, onLike, onCollect, onComment, onDelete, onBack }) {
  const { t } = useI18n()
  const config = GROUPS_CONFIG[groupName] || { color: 'bg-obelisk-line', desc: '', icon: '◉', members: 0 }
  const groupPosts = posts.filter(p => p.group === groupName)
  const [joined, setJoined] = useState(false)

  return (
    <div className="space-y-6">
      {/* 圈子横幅 */}
      <div className={`relative overflow-hidden rounded-2xl p-8 ${config.color} text-white`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> {t('common.back')}
          </button>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">{config.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{groupName}</h1>
              <p className="text-sm opacity-80 mt-1">{config.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <span className="text-sm"><Users className="w-4 h-4 inline mr-1" /> {config.members} {t('stele.members')}</span>
            <span className="text-sm"><MessageSquare className="w-4 h-4 inline mr-1" /> {groupPosts.length} 帖子</span>
            <button 
              onClick={() => setJoined(!joined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                joined ? 'bg-white/20 text-white' : 'bg-white text-obelisk-line'
              }`}
            >
              {joined ? t('stele.leaveGroup') : t('stele.joinGroup')}
            </button>
          </div>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="max-w-3xl">
        <h3 className="font-bold text-sm mb-4 text-obelisk-line">{t('stele.title')}</h3>
        {groupPosts.length === 0 ? (
          <GlassCard>
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-obelisk-border" />
              <p className="text-obelisk-textMuted">这个圈子还没有帖子</p>
            </div>
          </GlassCard>
        ) : (
          groupPosts.map(post => (
            <PostCard key={post.id} post={post} currentUser={user} onLike={onLike} onCollect={onCollect} onComment={onComment} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}

// ========== 主组件 ==========
export default function Stele() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPostModal, setShowPostModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postTags, setPostTags] = useState('')
  const [postGroup, setPostGroup] = useState('')
  const [postLink, setPostLink] = useState('')
  const [postPrivacy, setPostPrivacy] = useState('public')

  const groupFilter = searchParams.get('group')

  useEffect(() => {
    setLoading(true)
    let q = query(collection(db, 'stele_posts'), orderBy('createdAt', 'desc'))

    const tagFilter = searchParams.get('tag')
    if (tagFilter) q = query(q, where('tags', 'array-contains', tagFilter))
    if (groupFilter) q = query(q, where('group', '==', groupFilter))

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(items)
      setLoading(false)
    }, (err) => {
      console.error('Stele subscription error:', err)
      setLoading(false)
    })

    return () => unsub()
  }, [searchParams, groupFilter])

  const handleCreatePost = async () => {
    if (!user || !postContent.trim()) return
    try {
      const tags = postTags.split(/[,\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`)
      await addDoc(collection(db, 'stele_posts'), {
        authorId: user.uid,
        authorName: user.displayName || 'User',
        authorPhoto: user.photoURL || '',
        title: postTitle || '无标题',
        content: postContent,
        tags,
        group: postGroup || '',
        link: postLink || '',
        privacy: postPrivacy,
        likes: [],
        collects: [],
        comments: [],
        createdAt: serverTimestamp()
      })
      setPostTitle('')
      setPostContent('')
      setPostTags('')
      setPostGroup('')
      setPostLink('')
      setShowPostModal(false)
    } catch (e) {
      alert('发布失败: ' + e.message)
    }
  }

  const handleLike = async (postId, isLiked) => {
    if (!user) { alert('请先登录'); return }
    try {
      const ref = doc(db, 'stele_posts', postId)
      await updateDoc(ref, { likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) })
    } catch (e) { console.error('Like error:', e) }
  }

  const handleCollect = async (postId, isCollected) => {
    if (!user) { alert('请先登录'); return }
    try {
      const ref = doc(db, 'stele_posts', postId)
      await updateDoc(ref, { collects: isCollected ? arrayRemove(user.uid) : arrayUnion(user.uid) })
    } catch (e) { console.error('Collect error:', e) }
  }

  const handleComment = async (postId, text) => {
    if (!user) return
    try {
      const ref = doc(db, 'stele_posts', postId)
      await updateDoc(ref, {
        comments: arrayUnion({ authorId: user.uid, authorName: user.displayName || 'User', text, createdAt: new Date().toISOString() })
      })
    } catch (e) { console.error('Comment error:', e) }
  }

  const handleDelete = async (postId) => {
    if (!confirm('确定删除这条帖子？')) return
    try { await deleteDoc(doc(db, 'stele_posts', postId)) } catch (e) { alert('删除失败: ' + e.message) }
  }

  // 如果是圈子页面，显示独立页面
  if (groupFilter && activeTab === 'all') {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <GroupPage 
            groupName={groupFilter} 
            posts={posts} 
            user={user} 
            onLike={handleLike} 
            onCollect={handleCollect} 
            onComment={handleComment} 
            onDelete={handleDelete}
            onBack={() => { setSearchParams({}); setActiveTab('all') }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 头部标签 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="section-title">{t('stele.title')}</h1>
          {user && (
            <button onClick={() => setShowPostModal(true)} className="btn-primary text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> {t('stele.newPost')}
            </button>
          )}
        </div>

        {/* 视图切换 */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: t('stele.all'), icon: Clock },
            { id: 'following', label: t('stele.following'), icon: Users },
            { id: 'trending', label: t('stele.trending'), icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-obelisk-line text-white shadow-lg' 
                  : 'bg-white text-obelisk-textMuted hover:bg-obelisk-surfaceDark border border-obelisk-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 视图内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'all' && (
              <AllFeed 
                posts={posts} loading={loading} user={user} 
                onLike={handleLike} onCollect={handleCollect} onComment={handleComment} onDelete={handleDelete}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              />
            )}
            {activeTab === 'following' && (
              <FollowingFeed 
                posts={posts} loading={loading} user={user} 
                onLike={handleLike} onCollect={handleCollect} onComment={handleComment} onDelete={handleDelete}
              />
            )}
            {activeTab === 'trending' && (
              <TrendingFeed 
                posts={posts} loading={loading} user={user} 
                onLike={handleLike} onCollect={handleCollect} onComment={handleComment} onDelete={handleDelete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 发布弹窗 */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-panel rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">{t('stele.newPost')}</h3>
                <button onClick={() => setShowPostModal(false)} className="p-1 hover:bg-obelisk-surfaceDark rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} placeholder="标题（可选）" className="input-field" />
                <textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder={t('stele.placeholder')} rows={5} className="input-field resize-none" />
                <input type="text" value={postTags} onChange={e => setPostTags(e.target.value)} placeholder="标签，用空格或逗号分隔" className="input-field" />
                <select value={postGroup} onChange={e => setPostGroup(e.target.value)} className="input-field">
                  <option value="">{t('stele.groups')}（可选）</option>
                  {Object.keys(GROUPS_CONFIG).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <input type="url" value={postLink} onChange={e => setPostLink(e.target.value)} placeholder="链接（可选）" className="input-field" />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" value="public" checked={postPrivacy === 'public'} onChange={e => setPostPrivacy(e.target.value)} className="accent-obelisk-line" />
                    {t('settings.public')}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" value="private" checked={postPrivacy === 'private'} onChange={e => setPostPrivacy(e.target.value)} className="accent-obelisk-line" />
                    {t('settings.private')}
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPostModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                  <button onClick={handleCreatePost} disabled={!postContent.trim()} className="btn-primary flex-1">{t('stele.newPost')}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
