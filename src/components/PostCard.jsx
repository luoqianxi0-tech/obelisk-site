import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react'
import { usePosts } from '../hooks/usePosts.jsx'

export default function PostCard({ post }) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { likePost } = usePosts()
  const author = post.author || {}
  const images = post.images || []
  const tags = post.tags || []
  const created = post.createdAt && post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt || Date.now())

  return (
    <div className="glass p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <img src={author.photoURL || ''} alt="" className="w-10 h-10 object-cover struct-line" onError={e => { e.target.style.display='none' }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{author.displayName || 'Anonymous'}</p>
          <p className="text-[10px] text-obelisk-muted uppercase tracking-wider">
            {created.toLocaleDateString()}
          </p>
        </div>
        {post.circleName && (
          <span className="text-[10px] px-2 py-0.5 bg-black/5 struct-line font-medium">{post.circleName}</span>
        )}
      </div>
      <Link to={'/monument/post/' + post.id}>
        <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
      </Link>
      {images.length > 0 && (
        <div className={`grid gap-2 mb-3 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {images.map((img, i) => (
            <div key={i} className="aspect-square struct-line overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-black/5 struct-line">#{tag}</span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 pt-3 struct-line-t">
        <button onClick={() => likePost(post.id)} className="flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line">
          <Heart size={14} /> {post.likes || 0}
        </button>
        <Link to={'/monument/post/' + post.id} className="flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line">
          <MessageCircle size={14} /> {(post.comments || []).length}
        </Link>
        <button className="flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line">
          <Bookmark size={14} /> {post.bookmarks || 0}
        </button>
        <button className="flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line">
          <Share2 size={14} />
        </button>
      </div>
    </div>
  )
}
