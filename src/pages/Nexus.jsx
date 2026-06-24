import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useResources } from '../hooks/useResources.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { Plus, FileJson } from 'lucide-react'

export default function Nexus() {
  const { isAdmin } = useAuth()
  const { t } = useTranslation()
  const { addResource } = useResources('tools')
  const [tab, setTab] = useState('resources')
  const [form, setForm] = useState({ name: '', url: '', category: 'tools', description: '' })
  const [jsonText, setJsonText] = useState('')
  const [msg, setMsg] = useState('')

  if (!isAdmin) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <GlassCard><p className="text-sm text-obelisk-muted">Access Denied</p></GlassCard>
      </div>
    )
  }

  const submitSingle = async () => {
    if (!form.name || !form.url) return
    await addResource(form)
    setMsg('Resource added')
    setForm({ name: '', url: '', category: 'tools', description: '' })
    setTimeout(() => setMsg(''), 3000)
  }

  const submitBulk = async () => {
    try {
      const arr = JSON.parse(jsonText)
      for (const item of arr) {
        await addResource({ ...item, category: item.category || 'tools' })
      }
      setMsg(arr.length + ' resources imported')
      setJsonText('')
      setTimeout(() => setMsg(''), 3000)
    } catch (e) {
      setMsg('Invalid JSON')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">{t('nexus.title')}</h1>
        <p className="text-sm text-obelisk-muted">{t('nexus.desc')}</p>
      </div>

      <div className="flex gap-1 mb-4">
        {['resources', 'users', 'system'].map(k => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-medium struct-line ${tab === k ? 'bg-obelisk-line text-white' : 'hover:bg-white/70'}`}>
            {t('nexus.' + k + 'Mgmt')}
          </button>
        ))}
      </div>

      {msg && <div className="p-3 bg-obelisk-accent/10 struct-line text-xs font-bold text-obelisk-accent">{msg}</div>}

      {tab === 'resources' && (
        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-bold text-sm tracking-tight mb-4 flex items-center gap-2"><Plus size={14} /> {t('nexus.importResource')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('vault.name')} className="input-struct text-sm" />
              <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder={t('vault.url')} className="input-struct text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-struct text-sm">
                <option value="tools">{t('nav.tools')}</option>
                <option value="docs">{t('nav.docs')}</option>
                <option value="assets">{t('nav.assets')}</option>
                <option value="mirrors">{t('nav.mirrors')}</option>
              </select>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder={t('vault.description')} className="input-struct text-sm" />
            </div>
            <button onClick={submitSingle} className="btn-primary text-xs">{t('vault.submit')}</button>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-sm tracking-tight mb-4 flex items-center gap-2"><FileJson size={14} /> {t('nexus.bulkImport')}</h3>
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder={`[{
  "name":"...",
  "url":"...",
  "category":"...",
  "description":"..."
}]`}
              rows={6}
              className="input-struct text-sm font-mono resize-none mb-3"
            />
            <button onClick={submitBulk} className="btn-primary text-xs">{t('nexus.bulkImport')}</button>
          </GlassCard>
        </div>
      )}

      {tab === 'users' && (
        <GlassCard><p className="text-sm text-obelisk-muted">User management coming soon</p></GlassCard>
      )}

      {tab === 'system' && (
        <GlassCard>
          <div className="space-y-2 text-sm">
            <p><span className="text-obelisk-muted">Platform:</span> OBELISK v10</p>
            <p><span className="text-obelisk-muted">Frontend:</span> React 18 + Vite + Tailwind</p>
            <p><span className="text-obelisk-muted">Backend:</span> Firebase Auth + Firestore</p>
            <p><span className="text-obelisk-muted">Agent:</span> Python WebSocket</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
