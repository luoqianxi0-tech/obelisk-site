import { useParams, Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Send } from 'lucide-react'
import { useState } from 'react'

export default function PostDetail() {
  const { postId } = useParams()
  const { posts, likePost, addComment } = usePosts()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [commentText, setCommentText] = useState('')
  const post = posts.find(p => p.id === postId)

  if (!post) return <div className="max-w-3xl mx-auto px-4 py-6 text-center">{t('common.loading')}</div>

  const author = post.author || {}
  const images = post.images || []
  const tags = post.tags || []
  const comments = post.comments || []
  const created = post.createdAt && post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt || Date.now())

  const submitComment = async () => {
    if (!commentText.trim() || !user) return
    await addComment(postId, {
      content: commentText.trim(),
      author: { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }
    })
    setCommentText('')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/monument/plaza" className="inline-flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line mb-4">
        <ArrowLeft size={14} /> {t('common.back')}
      </Link>
      <div className="glass-strong p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={author.photoURL || ''} alt="" className="w-10 h-10 object-cover struct-line" onError={e => { e.target.style.display='none' }} />
          <div>
            <p className="font-bold text-sm">{author.displayName || 'Anonymous'}</p>
            <p className="text-[10px] text-obelisk-muted">{created.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-base leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>
        {images.length > 0 && (
          <div className={`grid gap-2 mb-4 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {images.map((img, i) => (
              <div key={i} className="aspect-square struct-line overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/5 struct-line">#{tag}</span>)}
          </div>
        )}
        <div className="flex items-center gap-6 pt-4 struct-line-t">
          <button onClick={() => likePost(postId)} className="flex items-center gap-1.5 text-sm text-obelisk-muted hover:text-obelisk-line">
            <Heart size={16} /> {post.likes || 0}
          </button>
          <span className="flex items-center gap-1.5 text-sm text-obelisk-muted">
            <MessageCircle size={16} /> {comments.length}
          </span>
          <button className="flex items-center gap-1.5 text-sm text-obelisk-muted hover:text-obelisk-line">
            <Bookmark size={16} /> {post.bookmarks || 0}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-obelisk-muted hover:text-obelisk-line">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="glass p-4 mb-4">
        <h3 className="font-bold text-sm tracking-tight mb-3">{t('monument.comment')} ({comments.length})</h3>
        {comments.length > 0 ? (
          <div className="space-y-3 mb-4">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3 p-3 bg-white/40 struct-line">
                <img src={c.author && c.author.photoURL ? c.author.photoURL : ''} alt="" className="w-8 h-8 object-cover struct-line shrink-0" onError={e => { e.target.style.display='none' }} />
                <div className="flex-1">
                  <p className="text-xs font-bold">{c.author && c.author.displayName ? c.author.displayName : 'Anonymous'}</p>
                  <p className="text-sm mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-obelisk-muted mb-4">No comments yet</p>
        )}
        {user && (
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitComment() }}
              placeholder={t('monument.writeComment')}
              className="input-struct text-sm flex-1"
            />
            <button onClick={submitComment} className="btn-primary px-3"><Send size={14} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
