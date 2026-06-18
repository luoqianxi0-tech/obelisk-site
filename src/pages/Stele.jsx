import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../firebase.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { 
  collection, addDoc, getDocs, query, orderBy, where, 
  serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, onSnapshot, deleteDoc 
} from 'firebase/firestore'
import { 
  MessageSquare, Heart, Bookmark, Share2, Send, Image, Link, X, 
  TrendingUp, Clock, Users, Hash, Search, Filter, MoreHorizontal, Trash2
} from 'lucide-react'

function PostCard({ post, onLike, onCollect, onComment, currentUser, onDelete }) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const isLiked = post.likes?.includes(currentUser?.uid)
  const isCollected = post.collects?.includes(currentUser?.uid)
  const isAuthor = currentUser?.uid === post.authorId

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
                        placeholder="写下你的评论..."
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

export default function Stele() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
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

  const groups = ['设计方法论', '独立开发者', '开源贡献者', '前端精进', '后端架构', '产品思维']
  const hotTags = ['#前端开发', '#UI设计', '#开源工具', '#独立开发', '#极客生活', '#数据结构', '#算法', '#架构设计']

  useEffect(() => {
    setLoading(true)
    let q = query(collection(db, 'stele_posts'), orderBy('createdAt', 'desc'))

    const tagFilter = searchParams.get('tag')
    const groupFilter = searchParams.get('group')

    if (tagFilter) {
      q = query(q, where('tags', 'array-contains', tagFilter))
    }
    if (groupFilter) {
      q = query(q, where('group', '==', groupFilter))
    }

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(items)
      setLoading(false)
    }, (err) => {
      console.error('Stele subscription error:', err)
      setLoading(false)
    })

    return () => unsub()
  }, [searchParams])

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
      await updateDoc(ref, {
        likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      })
    } catch (e) {
      console.error('Like error:', e)
    }
  }

  const handleCollect = async (postId, isCollected) => {
    if (!user) { alert('请先登录'); return }
    try {
      const ref = doc(db, 'stele_posts', postId)
      await updateDoc(ref, {
        collects: isCollected ? arrayRemove(user.uid) : arrayUnion(user.uid)
      })
    } catch (e) {
      console.error('Collect error:', e)
    }
  }

  const handleComment = async (postId, text) => {
    if (!user) return
    try {
      const ref = doc(db, 'stele_posts', postId)
      await updateDoc(ref, {
        comments: arrayUnion({
          authorId: user.uid,
          authorName: user.displayName || 'User',
          text,
          createdAt: new Date().toISOString()
        })
      })
    } catch (e) {
      console.error('Comment error:', e)
    }
  }

  const handleDelete = async (postId) => {
    if (!confirm('确定删除这条帖子？')) return
    try {
      await deleteDoc(doc(db, 'stele_posts', postId))
    } catch (e) {
      alert('删除失败: ' + e.message)
    }
  }

  const filteredPosts = posts.filter(p => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)))
  })

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block space-y-4">
            <GlassCard>
              <h3 className="font-bold text-sm mb-4 text-obelisk-line">导航</h3>
              <div className="space-y-1">
                {[
                  { id: 'all', label: '全部动态', icon: Clock },
                  { id: 'following', label: '我的关注', icon: Users },
                  { id: 'trending', label: '热门趋势', icon: TrendingUp },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id ? 'bg-obelisk-line text-white' : 'text-obelisk-textMuted hover:bg-obelisk-surfaceDark'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold text-sm mb-4 text-obelisk-line flex items-center gap-2">
                <Users className="w-4 h-4" /> 圈子
              </h3>
              <div className="space-y-1">
                {groups.map(g => (
                  <button
                    key={g}
                    onClick={() => setSearchParams({ group: g })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      searchParams.get('group') === g ? 'bg-obelisk-surfaceDark font-medium' : 'text-obelisk-textMuted hover:bg-obelisk-surfaceDark'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="section-title">碑刻</h1>
              {user && (
                <button 
                  onClick={() => setShowPostModal(true)}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> 发布
                </button>
              )}
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obelisk-textLight" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索帖子、话题..."
                className="input-field pl-10"
              />
            </div>

            <div className="flex lg:hidden gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {['all', 'following', 'trending'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    activeTab === tab ? 'bg-obelisk-line text-white' : 'bg-obelisk-surfaceDark text-obelisk-textMuted'
                  }`}
                >
                  {tab === 'all' ? '全部' : tab === 'following' ? '关注' : '热门'}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <GlassCard>
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
                  <p className="text-obelisk-textMuted mb-2">这里还没有内容</p>
                  <p className="text-sm text-obelisk-textLight">发布第一条帖子，开启社区讨论</p>
                  {user && (
                    <button onClick={() => setShowPostModal(true)} className="btn-primary mt-4">
                      立即发布
                    </button>
                  )}
                </div>
              </GlassCard>
            ) : (
              <div>
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={user}
                    onLike={handleLike}
                    onCollect={handleCollect}
                    onComment={handleComment}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-4">
            <GlassCard>
              <h3 className="font-bold text-sm mb-4 text-obelisk-line flex items-center gap-2">
                <Hash className="w-4 h-4" /> 热门话题
              </h3>
              <div className="flex flex-wrap gap-2">
                {hotTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchParams({ tag })}
                    className={`tag text-xs hover:bg-obelisk-line hover:text-white transition-colors ${
                      searchParams.get('tag') === tag ? 'bg-obelisk-line text-white' : ''
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold text-sm mb-4 text-obelisk-line">社区公告</h3>
              <div className="space-y-3 text-sm">
                <p className="text-obelisk-text">欢迎来到碑刻社区！这里是极客们的交流空间。</p>
                <p className="text-obelisk-textMuted">请遵守社区规范，友善交流。</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Post Modal */}
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
                <h3 className="text-lg font-bold">发布帖子</h3>
                <button onClick={() => setShowPostModal(false)} className="p-1 hover:bg-obelisk-surfaceDark rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="标题（可选）"
                  className="input-field"
                />

                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="分享你的想法..."
                  rows={5}
                  className="input-field resize-none"
                />

                <input
                  type="text"
                  value={postTags}
                  onChange={e => setPostTags(e.target.value)}
                  placeholder="标签，用空格或逗号分隔"
                  className="input-field"
                />

                <select
                  value={postGroup}
                  onChange={e => setPostGroup(e.target.value)}
                  className="input-field"
                >
                  <option value="">选择圈子（可选）</option>
                  {groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                <input
                  type="url"
                  value={postLink}
                  onChange={e => setPostLink(e.target.value)}
                  placeholder="链接（可选）"
                  className="input-field"
                />

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value="public"
                      checked={postPrivacy === 'public'}
                      onChange={e => setPostPrivacy(e.target.value)}
                      className="accent-obelisk-line"
                    />
                    公开
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value="private"
                      checked={postPrivacy === 'private'}
                      onChange={e => setPostPrivacy(e.target.value)}
                      className="accent-obelisk-line"
                    />
                    仅自己可见
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPostModal(false)} className="btn-secondary flex-1">
                    取消
                  </button>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!postContent.trim()}
                    className="btn-primary flex-1"
                  >
                    发布
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
