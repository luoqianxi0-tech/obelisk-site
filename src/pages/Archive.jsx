import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useAgent } from '../hooks/useAgent.jsx'
import { db } from '../firebase.js'
import { doc, updateDoc } from 'firebase/firestore'
import GlassCard from '../components/GlassCard.jsx'
import StatChart from '../components/StatChart.jsx'
import { Edit3, Save, Cpu, MemoryStick, Activity, Shield, Wrench } from 'lucide-react'

export default function Archive() {
  const { user, profile, updateProfileLocal } = useAuth()
  const { t } = useTranslation()
  const { status, data, history, connect, disconnect } = useAgent()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ displayName: '', bio: '' })

  useEffect(() => {
    if (profile) setForm({ displayName: profile.displayName || '', bio: profile.bio || '' })
  }, [profile])

  const save = async () => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    await updateDoc(ref, { displayName: form.displayName, bio: form.bio })
    updateProfileLocal({ displayName: form.displayName, bio: form.bio })
    setEditing(false)
  }

  const arsenal = profile && profile.arsenal ? profile.arsenal : []

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard strong className="md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <img src={user && user.photoURL ? user.photoURL : ''} alt="" className="w-20 h-20 object-cover struct-line mb-3" onError={e => { e.target.style.display='none' }} />
            {editing ? (
              <div className="w-full space-y-2">
                <input value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} className="input-struct text-sm text-center" />
                <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={2} className="input-struct text-sm text-center resize-none" />
                <button onClick={save} className="btn-primary w-full text-xs flex items-center justify-center gap-1"><Save size={12} /> {t('common.save')}</button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black tracking-tight">{profile && profile.displayName ? profile.displayName : (user && user.displayName ? user.displayName : 'Anonymous')}</h2>
                <p className="text-xs text-obelisk-muted mt-1">{profile && profile.bio ? profile.bio : t('archive.bio')}</p>
                <button onClick={() => setEditing(true)} className="mt-3 btn-secondary text-xs flex items-center gap-1">
                  <Edit3 size={12} /> {t('archive.editProfile')}
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-6 text-center struct-line-t pt-4">
            <div><p className="text-lg font-bold">{profile && profile.postsCount ? profile.postsCount : 0}</p><p className="text-[10px] text-obelisk-muted">{t('archive.postCount')}</p></div>
            <div><p className="text-lg font-bold">{arsenal.length}</p><p className="text-[10px] text-obelisk-muted">{t('archive.toolCount')}</p></div>
            <div><p className="text-lg font-bold">{profile && profile.following ? profile.following.length : 0}</p><p className="text-[10px] text-obelisk-muted">{t('nav.following')}</p></div>
          </div>
        </GlassCard>

        <div className="md:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-2"><Activity size={14} /> {t('archive.stats')}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 struct-line font-mono uppercase ${status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {status === 'online' ? 'AGENT ONLINE' : 'AGENT OFFLINE'}
                </span>
                {status === 'offline' || status === 'error' ? (
                  <button onClick={() => connect()} className="btn-primary text-[10px] py-1 px-2">{t('agent.connect')}</button>
                ) : (
                  <button onClick={disconnect} className="btn-secondary text-[10px] py-1 px-2">{t('agent.disconnect')}</button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 struct-line text-center">
                <Cpu size={16} className="mx-auto mb-1 text-obelisk-muted" />
                <p className="text-lg font-bold font-mono">{data.cpu.toFixed(1)}%</p>
                <p className="text-[10px] text-obelisk-muted">{t('archive.cpu')}</p>
              </div>
              <div className="p-3 struct-line text-center">
                <MemoryStick size={16} className="mx-auto mb-1 text-obelisk-muted" />
                <p className="text-lg font-bold font-mono">{data.memory.toFixed(1)}%</p>
                <p className="text-[10px] text-obelisk-muted">{t('archive.memory')}</p>
              </div>
              <div className="p-3 struct-line text-center">
                <Activity size={16} className="mx-auto mb-1 text-obelisk-muted" />
                <p className="text-lg font-bold font-mono">{data.connections}</p>
                <p className="text-[10px] text-obelisk-muted">{t('agent.connections')}</p>
              </div>
              <div className="p-3 struct-line text-center">
                <Shield size={16} className="mx-auto mb-1 text-obelisk-muted" />
                <p className="text-lg font-bold font-mono">{data.processes}</p>
                <p className="text-[10px] text-obelisk-muted">{t('agent.processes')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold tracking-wider uppercase text-obelisk-muted mb-1">CPU</p>
                <StatChart data={history} dataKey="cpu" color="#111" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider uppercase text-obelisk-muted mb-1">Memory</p>
                <StatChart data={history} dataKey="mem" color="#c9a227" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <h3 className="font-bold text-sm tracking-tight flex items-center gap-2 mb-4"><Wrench size={14} /> {t('archive.arsenal')}</h3>
        {arsenal.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {arsenal.map((tool, i) => (
              <a key={i} href={tool.url || '#'} target="_blank" rel="noreferrer" className="p-3 struct-line text-center hover:bg-white/70 transition-colors">
                <p className="text-xs font-bold truncate">{tool.name}</p>
                <p className="text-[10px] text-obelisk-muted mt-0.5">{tool.category}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-obelisk-muted text-center py-8">Arsenal is empty</p>
        )}
      </GlassCard>
    </div>
  )
}
