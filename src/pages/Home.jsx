import { Link } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useEffect, useState } from 'react'
import { db } from '../firebase.js'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

export default function Home() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [recentPosts, setRecentPosts] = useState([])
  const [stats, setStats] = useState({ users: 0, posts: 0, resources: 0, projects: 0 })

  useEffect(() => {
    async function load() {
      try {
        const postsSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5)))
        setRecentPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {}
    }
    load()
  }, [])

  const groups = [
    { id: '1', name: 'Reverse Engineering', members: 1284, color: 'from-orange-400 to-red-500' },
    { id: '2', name: 'CTF / Pwn', members: 956, color: 'from-blue-400 to-indigo-500' },
    { id: '3', name: 'Mobile Security', members: 742, color: 'from-emerald-400 to-teal-500' },
    { id: '4', name: 'Web3 Security', members: 621, color: 'from-purple-400 to-pink-500' },
  ]

  const resources = [
    { name: 'Ghidra', category: 'Reverse', url: 'https://ghidra-sre.org' },
    { name: 'IDA Pro', category: 'Reverse', url: 'https://hex-rays.com' },
    { name: 'Burp Suite', category: 'Web', url: 'https://portswigger.net/burp' },
    { name: 'Frida', category: 'Mobile', url: 'https://frida.re' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-obelisk-line mb-4">{t('home.welcome')}</h1>
        <p className="text-obelisk-textMuted text-lg max-w-2xl mx-auto">{t('home.explore')}</p>
        <div className="flex justify-center gap-3 mt-6">
          <Link to="/stele" className="btn-primary">{t('stele.newPost')}</Link>
          <Link to="/aggregate" className="btn-secondary">{t('nav.aggregate')}</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: t('home.totalUsers'), value: stats.users || '2.4k+' },
          { label: t('home.totalPosts'), value: stats.posts || '1.8k+' },
          { label: t('home.totalResources'), value: stats.resources || '340+' },
          { label: t('home.totalProjects'), value: stats.projects || '86' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-obelisk-line">{s.value}</div>
            <div className="text-xs text-obelisk-textMuted mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="section-title mb-4">{t('home.recentPosts')}</h2>
            {recentPosts.length === 0 ? (
              <div className="text-obelisk-textMuted text-sm py-8 text-center">{t('stele.noPosts')}</div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map(post => (
                  <Link key={post.id} to={`/stele/post/${post.id}`} className="block p-4 rounded-xl hover:bg-black/5 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={post.authorPhoto || '/default-avatar.png'} alt="" className="w-6 h-6 rounded-full" />
                      <span className="text-sm font-medium">{post.authorName}</span>
                      <span className="text-xs text-obelisk-textMuted">{post.createdAt?.toDate?.().toLocaleDateString?.() || ''}</span>
                    </div>
                    <p className="text-sm text-obelisk-text line-clamp-2">{post.content}</p>
                    {post.images?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {post.images.slice(0,3).map((img, idx) => (
                          <img key={idx} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="section-title mb-4">{t('home.featuredResources')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {resources.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-obelisk-border hover:border-obelisk-line hover:bg-white/80 transition-all">
                  <div className="text-sm font-medium text-obelisk-line">{r.name}</div>
                  <div className="text-xs text-obelisk-textMuted">{r.category}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="section-title mb-4">{t('home.activeGroups')}</h2>
            <div className="space-y-3">
              {groups.map(g => (
                <Link key={g.id} to={`/stele/groups/${g.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white font-bold text-xs`}>
                    {g.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{g.name}</div>
                    <div className="text-xs text-obelisk-textMuted">{g.members} {t('stele.members')}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="section-title mb-4">{t('home.hotTopics')}</h2>
            <div className="flex flex-wrap gap-2">
              {['#Frida', '#SSL-Pinning', '#CVE-2024', '#APK-Reversing', '#Web3-Audit', '#ZeroTrust'].map(tag => (
                <Link key={tag} to={`/stele/tags/${tag.replace('#', '')}`} className="tag hover:bg-obelisk-line hover:text-white transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
