import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { db } from '../../firebase.js'
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

export default function FollowingFeed() {
  const { t } = useI18n()
  const { user, profile } = useAuth()
  const [creators, setCreators] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFollowing()
  }, [profile])

  async function loadFollowing() {
    if (!profile?.following?.length) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const snap = await getDocs(query(
        collection(db, 'posts'),
        where('authorId', 'in', profile.following.slice(0, 10)),
        orderBy('createdAt', 'desc'),
        limit(20)
      ))
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function toggleFollow(targetUid) {
    if (!user) return
    const meRef = doc(db, 'users', user.uid)
    const themRef = doc(db, 'users', targetUid)
    const already = profile?.following?.includes(targetUid)
    await updateDoc(meRef, { following: already ? arrayRemove(targetUid) : arrayUnion(targetUid) })
    await updateDoc(themRef, { followers: already ? arrayRemove(user.uid) : arrayUnion(user.uid) })
    window.location.reload()
  }

  const demoCreators = [
    { uid: 'demo1', name: '0xACE', bio: 'Binary exploitation & kernel pwn', followers: 3420 },
    { uid: 'demo2', name: 'ReverserX', bio: 'Mobile RE / Frida scripting', followers: 2180 },
    { uid: 'demo3', name: 'Web3Hunter', bio: 'Smart contract audit & DeFi', followers: 1560 },
    { uid: 'demo4', name: 'ForensicsGuru', bio: 'DFIR & memory forensics', followers: 980 },
  ]

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <p className="text-obelisk-textMuted mb-4">{t('stele.noFollowing')}</p>
        <p className="text-sm text-obelisk-textLight mb-6">{t('stele.noFollowingDesc')}</p>
        <button onClick={() => {}} className="btn-primary">{t('auth.login')}</button>
      </div>
    )
  }

  if (!profile?.following?.length) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-obelisk-textMuted mb-2">{t('stele.noFollowing')}</p>
          <p className="text-sm text-obelisk-textLight mb-6">{t('stele.noFollowingDesc')}</p>
          <p className="text-sm font-medium text-obelisk-line mb-4">{t('stele.discoverUsers')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoCreators.map(c => (
            <div key={c.uid} className="glass-card rounded-2xl p-5 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-obelisk-line to-gray-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-obelisk-line">{c.name}</h3>
                  <button className="text-xs px-3 py-1.5 rounded-full bg-obelisk-line text-white hover:bg-black transition-colors">{t('stele.follow')}</button>
                </div>
                <p className="text-sm text-obelisk-textMuted mt-1">{c.bio}</p>
                <p className="text-xs text-obelisk-textLight mt-2">{c.followers} {t('stele.followers')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-obelisk-line mb-4">{t('stele.following')}</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {profile.following.map(uid => (
            <div key={uid} className="shrink-0 w-20 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-obelisk-line to-gray-600 flex items-center justify-center text-white font-bold mb-2">
                {uid.slice(0,2).toUpperCase()}
              </div>
              <div className="text-xs font-medium truncate">{uid.slice(0,8)}</div>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className="glass-card rounded-2xl p-8 text-center text-obelisk-textMuted">{t('settings.loading')}</div>}

      {!loading && posts.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center text-obelisk-textMuted">{t('stele.noPosts')}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(post => (
          <Link key={post.id} to={`/stele/post/${post.id}`} className="glass-card rounded-2xl p-5 hover:bg-white/80 transition-colors block">
            <div className="flex items-center gap-3 mb-3">
              <img src={post.authorPhoto || '/default-avatar.png'} alt="" className="w-8 h-8 rounded-full" />
              <div className="text-sm font-medium">{post.authorName}</div>
            </div>
            <p className="text-sm text-obelisk-text line-clamp-3 mb-3">{post.content}</p>
            {post.images?.length > 0 && (
              <img src={post.images[0]} alt="" className="w-full h-40 object-cover rounded-xl mb-3" />
            )}
            <div className="flex items-center gap-4 text-xs text-obelisk-textMuted">
              <span>{post.likes || 0} {t('stele.like')}</span>
              <span>{post.comments?.length || 0} {t('stele.comment')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
