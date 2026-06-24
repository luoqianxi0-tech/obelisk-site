import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n.jsx'
import { db } from '../../firebase.js'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

export default function TrendingFeed() {
  const { t } = useI18n()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrending()
  }, [])

  async function loadTrending() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'posts'), orderBy('likes', 'desc'), limit(20)))
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(items)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const maxLikes = Math.max(...posts.map(p => p.likes || 0), 1)

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
          <h2 className="font-bold text-lg text-obelisk-line">{t('stele.trending')}</h2>
        </div>
        <p className="text-sm text-obelisk-textMuted">{t('stele.hotThisWeek')}</p>
      </div>

      {loading && <div className="glass-card rounded-2xl p-8 text-center text-obelisk-textMuted">{t('settings.loading')}</div>}

      {!loading && posts.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center text-obelisk-textMuted">{t('stele.noPosts')}</div>
      )}

      {posts.map((post, idx) => (
        <div key={post.id} className="glass-card rounded-2xl p-5 flex gap-4 items-start">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
            {idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <img src={post.authorPhoto || '/default-avatar.png'} alt="" className="w-6 h-6 rounded-full" />
              <span className="text-sm font-medium">{post.authorName}</span>
              <span className="text-xs text-obelisk-textMuted">{post.createdAt?.toDate?.().toLocaleDateString?.() || ''}</span>
            </div>
            <Link to={`/stele/post/${post.id}`} className="block">
              <p className="text-sm text-obelisk-text line-clamp-2 mb-2">{post.content}</p>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-obelisk-surfaceDark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                    style={{ width: `${((post.likes || 0) / maxLikes) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-orange-500">{post.likes || 0} {t('stele.like')}</span>
            </div>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map(tag => (
                  <Link key={tag} to={`/stele/tags/${tag}`} className="text-xs text-obelisk-accent bg-emerald-50 px-2 py-0.5 rounded-full">#{tag}</Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
