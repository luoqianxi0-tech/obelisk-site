import { useParams } from 'react-router-dom'
import { useResources } from '../hooks/useResources.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import ResourceCard from '../components/ResourceCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function VaultCategory() {
  const { category } = useParams()
  const { resources, loading, addResource } = useResources(category || 'tools')
  const { isAdmin } = useAuth()
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', url: '', description: '' })

  const submit = async () => {
    if (!form.name || !form.url) return
    await addResource({ ...form, category: category || 'tools' })
    setForm({ name: '', url: '', description: '' })
    setShowForm(false)
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-4">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="btn-secondary text-xs flex items-center gap-1">
              <Plus size={12} /> {t('vault.addResource')}
            </button>
          ) : (
            <div className="glass-strong p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('vault.name')} className="input-struct text-sm" />
                <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder={t('vault.url')} className="input-struct text-sm" />
              </div>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder={t('vault.description')} rows={2} className="input-struct text-sm resize-none" />
              <div className="flex gap-2">
                <button onClick={submit} className="btn-primary text-xs">{t('vault.submit')}</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">{t('common.close')}</button>
              </div>
            </div>
          )}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-sm text-obelisk-muted">{t('common.loading')}</div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>
      ) : (
        <EmptyState title={t('vault.empty')} desc={t('vault.empty')} />
      )}
    </div>
  )
}
