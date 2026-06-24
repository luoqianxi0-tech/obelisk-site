import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useAgent } from '../hooks/useAgent.js'
import { db } from '../firebase.js'
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore'

export default function Profile() {
  const { t } = useI18n()
  const { user, profile, isAdmin } = useAuth()
  const { status, connectAgent, disconnectAgent, data } = useAgent()
  const [posts, setPosts] = useState([])
  const [collections, setCollections] = useState([])
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '')
      setLocation(profile.location || '')
      setWebsite(profile.website || '')
    }
  }, [profile])

  useEffect(() => {
    if (!user) return
    async function load() {
      const postsSnap = await getDocs(query(collection(db, 'posts'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'), limit(10)))
      setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    load()
  }, [user])

  async function saveProfile() {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), { bio, location, website })
    setEditing(false)
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-obelisk-textMuted mb-4">{t('auth.login')} {t('profile.title')}</p>
        <button className="btn-primary">{t('auth.login')}</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-6">
          <img src={user.photoURL || '/default-avatar.png'} alt="" className="w-20 h-20 rounded-2xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-obelisk-line">{user.displayName}</h1>
              {isAdmin && <span className="text-xs font-bold bg-obelisk-line text-white px-2 py-1 rounded">{t('auth.adminBadge')}</span>}
            </div>
            <p className="text-sm text-obelisk-textMuted mb-3">{user.email}</p>

            {editing ? (
              <div className="space-y-3">
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t('profile.bio')} className="w-full px-3 py-2 rounded-xl bg-obelisk-surfaceDark border border-obelisk-border text-sm" rows={2} />
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder={t('profile.location')} className="w-full px-3 py-2 rounded-xl bg-obelisk-surfaceDark border border-obelisk-border text-sm" />
                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder={t('profile.website')} className="w-full px-3 py-2 rounded-xl bg-obelisk-surfaceDark border border-obelisk-border text-sm" />
                <div className="flex gap-2">
                  <button onClick={saveProfile} className="btn-primary text-sm py-2 px-4">{t('settings.save')}</button>
                  <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-4">{t('settings.cancel')}</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-obelisk-text mb-2">{profile?.bio || t('settings.empty')}</p>
                <div className="flex items-center gap-4 text-xs text-obelisk-textMuted">
                  {profile?.location && <span>📍 {profile.location}</span>}
                  {profile?.website && <a href={profile.website} target="_blank" rel="noreferrer" className="hover:underline">🔗 {profile.website}</a>}
                </div>
                <button onClick={() => setEditing(true)} className="mt-3 text-xs text-obelisk-line hover:underline">{t('profile.editProfile')}</button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-obelisk-border">
          {[
            { label: t('profile.posts'), value: posts.length },
            { label: t('profile.followers'), value: profile?.followers?.length || 0 },
            { label: t('profile.following'), value: profile?.following?.length || 0 },
            { label: t('profile.groups'), value: profile?.groups?.length || 0 },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold text-obelisk-line">{s.value}</div>
              <div className="text-xs text-obelisk-textMuted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-obelisk-line">{t('profile.agent')}</h2>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500' : status === 'connecting' ? 'bg-amber-500' : 'bg-gray-400'}`} />
            <span className="text-xs text-obelisk-textMuted capitalize">{status}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {status === 'connected' ? (
            <button onClick={disconnectAgent} className="btn-secondary text-sm py-2 px-4">{t('profile.disconnect')}</button>
          ) : (
            <button onClick={connectAgent} className="btn-primary text-sm py-2 px-4">{t('profile.connect')}</button>
          )}
        </div>
        {data && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 rounded-xl bg-obelisk-surfaceDark text-center">
              <div className="text-xs text-obelisk-textMuted">{t('profile.cpu')}</div>
              <div className="text-lg font-bold text-obelisk-line">{data.cpu || 0}%</div>
            </div>
            <div className="p-3 rounded-xl bg-obelisk-surfaceDark text-center">
              <div className="text-xs text-obelisk-textMuted">{t('profile.memory')}</div>
              <div className="text-lg font-bold text-obelisk-line">{data.memory || 0}%</div>
            </div>
            <div className="p-3 rounded-xl bg-obelisk-surfaceDark text-center">
              <div className="text-xs text-obelisk-textMuted">{t('profile.traffic')}</div>
              <div className="text-lg font-bold text-obelisk-line">{data.traffic || 0} MB</div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-obelisk-line mb-4">{t('profile.recentPosts')}</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-obelisk-textMuted text-center py-8">{t('settings.empty')}</p>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <Link key={post.id} to={`/stele/post/${post.id}`} className="block p-3 rounded-xl hover:bg-black/5 transition-colors">
                <p className="text-sm text-obelisk-text line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-obelisk-textMuted">
                  <span>{post.likes || 0} {t('stele.like')}</span>
                  <span>{(post.comments || []).length} {t('stele.comment')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
