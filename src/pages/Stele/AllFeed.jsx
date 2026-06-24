import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { db } from '../../firebase.js'
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'

export default function AllFeed() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20)))
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(items)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function toggleLike(postId, likedBy = []) {
    if (!user) return
    const ref = doc(db, 'posts', postId)
    const already = likedBy.includes(user.uid)
    await updateDoc(ref, {
      likedBy: already ? arrayRemove(user.uid) : arrayUnion(user.uid),
      likes: already ? (likedBy.length - 1) : (likedBy.length + 1)
    })
    loadPosts()
  }

  async function toggleCollect(postId, collectedBy = []) {
    if (!user) return
    const ref = doc(db, 'posts', postId)
    const already = collectedBy.includes(user.uid)
    await updateDoc(ref, {
      collectedBy: already ? arrayRemove(user.uid) : arrayUnion(user.uid)
    })
    loadPosts()
  }

  return (
    <div className="space-y-4">
      {/* Composer */}
      {user && (
        <Link to="/stele/new" className="block">
          <div className="glass-card rounded-2xl p-4 hover:bg-white/80 transition-colors cursor-text">
            <div className="flex items-center gap-3">
              <img src={user.photoURL || '/default-avatar.png'} alt="" className="w-10 h-10 rounded-full" />
              <div className="flex-1 bg-obelisk-surfaceDark rounded-xl px-4 py-2.5 text-sm text-obelisk-textMuted">
                {t('stele.placeholder')}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 ml-13 pl-13">
              <div className="flex items-center gap-1.5 text-xs text-obelisk-textMuted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {t('stele.placeholderImage')}
              </div>
            </div>
          </div>
        </Link>
      )}

      {loading && (
        <div className="glass-card rounded-2xl p-8 text-center text-obelisk-textMuted text-sm">{t('settings.loading')}</div>
      )}

      {!loading && posts.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-obelisk-textMuted">{t('stele.noPosts')}</p>
        </div>
      )}

      {posts.map(post => (
        <article key={post.id} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <img src={post.authorPhoto || '/default-avatar.png'} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-sm font-semibold text-obelisk-line">{post.authorName}</div>
              <div className="text-xs text-obelisk-textMuted">{post.createdAt?.toDate?.().toLocaleDateString?.() || ''}</div>
            </div>
            {post.privacy && post.privacy !== 'public' && (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-obelisk-surfaceDark text-obelisk-textMuted border border-obelisk-border">
                {t(`stele.${post.privacy}`)}
              </span>
            )}
          </div>

          <Link to={`/stele/post/${post.id}`}>
            <p className="text-sm text-obelisk-text leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
          </Link>

          {post.images?.length > 0 && (
            <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt="" className="w-full rounded-xl object-cover max-h-80" />
              ))}
            </div>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map(tag => (
                <Link key={tag} to={`/stele/tags/${tag}`} className="text-xs text-obelisk-accent bg-emerald-50 px-2 py-0.5 rounded-full">#{tag}</Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 pt-3 border-t border-obelisk-border">
            <button onClick={() => toggleLike(post.id, post.likedBy || [])} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${(post.likedBy || []).includes(user?.uid) ? 'text-red-500 bg-red-50' : 'text-obelisk-textMuted hover:bg-black/5'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {post.likes || 0}
            </button>
            <button onClick={() => toggleCollect(post.id, post.collectedBy || [])} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${(post.collectedBy || []).includes(user?.uid) ? 'text-amber-500 bg-amber-50' : 'text-obelisk-textMuted hover:bg-black/5'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              {t('stele.collect')}
            </button>
            <Link to={`/stele/post/${post.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-obelisk-textMuted hover:bg-black/5 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {post.comments?.length || 0}
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
