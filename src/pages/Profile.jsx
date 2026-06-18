import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useI18n } from '../i18n.js'
import { useAgent } from '../hooks/useAgent.js'
import GlassCard from '../components/GlassCard.jsx'
import { doc, updateDoc, onSnapshot, collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { User, Settings, Link2, MapPin, Calendar, MessageSquare, Heart, Bookmark, Activity, Cpu, Wifi, HardDrive, Edit2, Check, X, Shield } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { t } = useI18n()
  const { status, data, connectAgent, disconnectAgent, updateEndpoint, host, port } = useAgent()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editBio, setEditBio] = useState('')
  const [editHandle, setEditHandle] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editWebsite, setEditWebsite] = useState('')
  const [agentHost, setAgentHost] = useState(host)
  const [agentPort, setAgentPort] = useState(port)
  const [myPosts, setMyPosts] = useState([])
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        setProfile(d)
        setEditBio(d.bio || '')
        setEditHandle(d.handle || '')
        setEditLocation(d.location || '')
        setEditWebsite(d.website || '')
        setFollowersCount(d.followers?.length || 0)
        setFollowingCount(d.following?.length || 0)
      }
      setLoading(false)
    }, () => setLoading(false))
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'stele_posts'), orderBy('createdAt', 'desc'), limit(10))
        const snap = await getDocs(q)
        setMyPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.authorId === user.uid))
      } catch (e) { console.error(e) }
    }
    fetchPosts()
    return () => unsub()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    try { await updateDoc(doc(db, 'users', user.uid), { bio: editBio, handle: editHandle, location: editLocation, website: editWebsite }); setEditing(false) }
    catch (e) { alert(t('common.error') + ': ' + e.message) }
  }

  const handleConnect = () => { updateEndpoint(agentHost, agentPort); connectAgent() }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard>
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto mb-4 text-obelisk-border" />
          <p className="text-obelisk-textMuted mb-4">{t('auth.guest')}</p>
        </div>
      </GlassCard>
    </div>
  )

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin" /></div>

  const agentData = data || {}
  const cpuUsage = agentData.system?.cpu_percent || 0
  const memUsage = agentData.system?.memory?.percent || 0
  const trafficIn = agentData.traffic?.total_in || 0

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <GlassCard className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img src={user.photoURL || '/default-avatar.png'} alt="" className="w-24 h-24 rounded-2xl object-cover bg-obelisk-surfaceDark" />
              {user.uid === 'nCZLU2r9YfXVTrQ79EJqWJxPPT03' && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-obelisk-line text-white text-xs font-bold rounded-lg flex items-center gap-1"><Shield className="w-3 h-3" /> {t('auth.adminBadge')}</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-obelisk-line">{user.displayName || 'User'}</h1>
                <button onClick={() => setEditing(!editing)} className="p-1.5 rounded-lg hover:bg-obelisk-surfaceDark transition-colors">
                  {editing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4 text-obelisk-textMuted" />}
                </button>
              </div>
              {editing ? (
                <div className="space-y-3 max-w-md">
                  <input type="text" value={editHandle} onChange={e => setEditHandle(e.target.value)} placeholder="@username" className="input-field text-sm" />
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder={t('profile.bio')} rows={2} className="input-field text-sm resize-none" />
                  <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder={t('profile.location')} className="input-field text-sm" />
                  <input type="url" value={editWebsite} onChange={e => setEditWebsite(e.target.value)} placeholder={t('profile.website')} className="input-field text-sm" />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="btn-primary text-sm py-2 px-4"><Check className="w-4 h-4 inline mr-1" /> {t('common.save')}</button>
                    <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-4">{t('common.cancel')}</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-obelisk-textMuted mb-2">@{profile?.handle || 'user'}</p>
                  <p className="text-sm text-obelisk-text mb-3">{profile?.bio || t('common.empty')}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-obelisk-textLight">
                    {profile?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>}
                    {profile?.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-obelisk-line"><Link2 className="w-3 h-3" /> {profile.website}</a>}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {profile?.createdAt?.toDate?.() ? new Date(profile.createdAt.toDate()).toLocaleDateString() : '?'}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-6 text-center">
              <div><p className="text-xl font-bold text-obelisk-line">{myPosts.length}</p><p className="text-xs text-obelisk-textMuted">{t('profile.posts')}</p></div>
              <div><p className="text-xl font-bold text-obelisk-line">{followersCount}</p><p className="text-xs text-obelisk-textMuted">{t('stele.followers')}</p></div>
              <div><p className="text-xl font-bold text-obelisk-line">{followingCount}</p><p className="text-xs text-obelisk-textMuted">{t('stele.following')}</p></div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <GlassCard>
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> {t('profile.agent')}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-amber-500' : 'bg-red-400'}`} />
                <span className="text-sm text-obelisk-textMuted">{status === 'connected' ? 'Online' : status === 'connecting' ? 'Connecting...' : 'Offline'}</span>
              </div>
              <div className="space-y-3 mb-4">
                <div><label className="text-xs text-obelisk-textLight mb-1 block">Host</label><input type="text" value={agentHost} onChange={e => setAgentHost(e.target.value)} className="input-field text-sm py-2" /></div>
                <div><label className="text-xs text-obelisk-textLight mb-1 block">Port</label><input type="number" value={agentPort} onChange={e => setAgentPort(Number(e.target.value))} className="input-field text-sm py-2" /></div>
              </div>
              <div className="flex gap-2">
                {status !== 'connected' ? (
                  <button onClick={handleConnect} className="btn-primary text-sm flex-1 py-2">{t('profile.connect')}</button>
                ) : (
                  <button onClick={() => disconnectAgent()} className="btn-secondary text-sm flex-1 py-2">{t('profile.disconnect')}</button>
                )}
              </div>
              {status === 'connected' && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-obelisk-surfaceDark/50"><div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-obelisk-textMuted" /><span className="text-sm">{t('profile.cpu')}</span></div><span className="text-sm font-bold">{cpuUsage.toFixed(1)}%</span></div>
                  <div className="w-full h-1.5 bg-obelisk-border rounded-full overflow-hidden"><div className="h-full bg-obelisk-line rounded-full transition-all" style={{ width: `${Math.min(cpuUsage, 100)}%` }} /></div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-obelisk-surfaceDark/50"><div className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-obelisk-textMuted" /><span className="text-sm">{t('profile.memory')}</span></div><span className="text-sm font-bold">{memUsage.toFixed(1)}%</span></div>
                  <div className="w-full h-1.5 bg-obelisk-border rounded-full overflow-hidden"><div className="h-full bg-obelisk-line rounded-full transition-all" style={{ width: `${Math.min(memUsage, 100)}%` }} /></div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-obelisk-surfaceDark/50"><div className="flex items-center gap-2"><Wifi className="w-4 h-4 text-obelisk-textMuted" /><span className="text-sm">{t('profile.traffic')}</span></div><span className="text-sm font-bold">{(trafficIn / 1024 / 1024).toFixed(2)} MB</span></div>
                </div>
              )}
            </GlassCard>
            <GlassCard>
              <h3 className="font-bold text-sm mb-4">{t('nav.settings')}</h3>
              <div className="space-y-2">
                <Link to="/stele" className="flex items-center gap-2 p-2 rounded-lg hover:bg-obelisk-surfaceDark transition-colors text-sm"><MessageSquare className="w-4 h-4" /> {t('profile.recentPosts')}</Link>
                <Link to="/aggregate" className="flex items-center gap-2 p-2 rounded-lg hover:bg-obelisk-surfaceDark transition-colors text-sm"><Bookmark className="w-4 h-4" /> {t('profile.collections')}</Link>
                <Link to="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-obelisk-surfaceDark transition-colors text-sm"><Settings className="w-4 h-4" /> {t('nav.settings')}</Link>
              </div>
            </GlassCard>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <GlassCard>
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {t('profile.recentPosts')}</h3>
              {myPosts.length === 0 ? (
                <p className="text-sm text-obelisk-textMuted text-center py-8">{t('common.empty')}</p>
              ) : (
                <div className="space-y-3">
                  {myPosts.map(post => (
                    <Link to="/stele" key={post.id} className="block p-3 rounded-xl hover:bg-obelisk-surfaceDark/50 transition-colors">
                      <p className="font-medium text-sm text-obelisk-line">{post.title}</p>
                      <p className="text-xs text-obelisk-textMuted mt-1 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-obelisk-textLight">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes?.length || 0}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments?.length || 0}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>
            <GlassCard>
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> {t('profile.activity')}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-obelisk-surfaceDark/30"><p className="text-2xl font-bold text-obelisk-line">{myPosts.length}</p><p className="text-xs text-obelisk-textMuted mt-1">{t('profile.posts')}</p></div>
                <div className="text-center p-4 rounded-xl bg-obelisk-surfaceDark/30"><p className="text-2xl font-bold text-obelisk-line">{profile?.collects?.length || 0}</p><p className="text-xs text-obelisk-textMuted mt-1">{t('profile.collections')}</p></div>
                <div className="text-center p-4 rounded-xl bg-obelisk-surfaceDark/30"><p className="text-2xl font-bold text-obelisk-line">{followersCount}</p><p className="text-xs text-obelisk-textMuted mt-1">{t('stele.followers')}</p></div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
