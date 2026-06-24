import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useJournal } from '../hooks/useJournal.jsx'
import JournalCard from '../components/JournalCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function JournalCategory() {
  const { category } = useParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { entries, loading, addEntry } = useJournal(category || 'range', user && user.uid ? user.uid : 'guest')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', difficulty: 'Medium', status: 'inProgress' })

  const submit = async () => {
    if (!form.title || !form.content || !user) return
    await addEntry({ ...form, category: category || 'range', userId: user.uid })
    setForm({ title: '', content: '', difficulty: 'Medium', status: 'inProgress' })
    setShowForm(false)
  }

  return (
    <div>
      {user && (
        <div className="mb-4">
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="btn-secondary text-xs flex items-center gap-1">
              <Plus size={12} /> {t('journal.newEntry')}
            </button>
          ) : (
            <div className="glass-strong p-4 space-y-3">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder={t('journal.titleField')} className="input-struct text-sm" />
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder={t('journal.content')} rows={4} className="input-struct text-sm resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="input-struct text-sm">
                  <option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option>
                </select>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-struct text-sm">
                  <option value="inProgress">{t('journal.inProgress')}</option><option value="completed">{t('journal.completed')}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={submit} className="btn-primary text-xs">{t('common.save')}</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">{t('common.close')}</button>
              </div>
            </div>
          )}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-sm text-obelisk-muted">{t('common.loading')}</div>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map(e => <JournalCard key={e.id} entry={e} />)}
        </div>
      ) : (
        <EmptyState title={t('journal.empty')} desc={t('journal.empty')} />
      )}
    </div>
  )
}
