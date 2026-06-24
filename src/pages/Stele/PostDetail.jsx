import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { db } from '../../firebase.js'
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'

export default function PostDetail() {
  const { id } = useParams()
  const { t } = useI18n()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')

  useEffect(() => {
    loadPost()
  }, [id])

  async function loadPost() {
    setLoading(true)
    try {
      const snap = await getDoc(doc(db, 'posts', id))
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function submitReply() {
    if (!reply.trim() || !user) return
    const ref = doc(db, 'posts', id)
    await updateDoc(ref, {
      comments: arrayUnion({
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        content: reply.trim(),
        createdAt: serverTimestamp()
      })
    })
    setReply('')
    loadPost()
  }

  if (loading) return <div className="max-w-3xl mx-auto p-8 text-center text-obelisk-textMuted">{t('settings.loading')}</div>
  if (!post) return <div className="max-w-3xl mx-auto p-8 text-center text-obelisk-textMuted">{t('settings.empty')}</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/stele" className="text-sm text-obelisk-textMuted hover:text-obelisk-line mb-4 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        {t('settings.back')}
      </Link>

      <article className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={post.authorPhoto || '/default-avatar.png'} alt="" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-obelisk-line">{post.authorName}</div>
            <div className="text-xs text-obelisk-textMuted">{post.createdAt?.toDate?.().toLocaleString?.() || ''}</div>
          </div>
        </div>

        <p className="text-obelisk-text leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

        {post.images?.length > 0 && (
          <div className={`grid gap-3 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {post.images.map((img, idx) => (
              <img key={idx} src={img} alt="" className="w-full rounded-xl object-cover max-h-96" />
            ))}
          </div>
        )}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <Link key={tag} to={`/stele/tags/${tag}`} className="text-sm text-obelisk-accent bg-emerald-50 px-3 py-1 rounded-full">#{tag}</Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-obelisk-border text-sm text-obelisk-textMuted">
          <span>{post.likes || 0} {t('stele.like')}</span>
          <span>{(post.comments || []).length} {t('stele.comment')}</span>
          <span>{post.views || 0} {t('stele.views')}</span>
        </div>
      </article>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-obelisk-line mb-4">{t('stele.replies')} ({(post.comments || []).length})</h3>

        {user && (
          <div className="flex gap-3 mb-6">
            <img src={user.photoURL || '/default-avatar.png'} alt="" className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1">
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder={t('stele.writeReply')}
                className="w-full px-4 py-3 rounded-xl bg-obelisk-surfaceDark border border-obelisk-border text-sm resize-none focus:outline-none focus:border-obelisk-line"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button onClick={submitReply} className="btn-primary text-sm py-2 px-4">{t('stele.comment')}</button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(post.comments || []).length === 0 && (
            <p className="text-sm text-obelisk-textMuted text-center py-4">{t('settings.empty')}</p>
          )}
          {(post.comments || []).map((c, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors">
              <img src={c.authorPhoto || '/default-avatar.png'} alt="" className="w-8 h-8 rounded-full shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.authorName}</span>
                  <span className="text-xs text-obelisk-textMuted">{c.createdAt?.toDate?.().toLocaleDateString?.() || ''}</span>
                </div>
                <p className="text-sm text-obelisk-text mt-1">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
