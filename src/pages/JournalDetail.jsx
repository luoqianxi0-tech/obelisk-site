import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useJournal } from '../hooks/useJournal.jsx'
import { ArrowLeft, Clock, CheckCircle, Circle, Trash2 } from 'lucide-react'

export default function JournalDetail() {
  const { category, id } = useParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { entries, deleteEntry } = useJournal(category || 'range', user && user.uid ? user.uid : 'guest')
  const entry = entries.find(e => e.id === id)

  if (!entry) return <div className="max-w-3xl mx-auto px-4 py-6 text-center">{t('common.loading')}</div>
  const created = entry.createdAt && entry.createdAt.toDate ? entry.createdAt.toDate() : new Date(entry.createdAt || Date.now())

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to={'/journal/' + category} className="inline-flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line mb-4">
        <ArrowLeft size={14} /> {t('common.back')}
      </Link>
      <div className="glass-strong p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">{entry.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-obelisk-muted">
              <span className="flex items-center gap-1"><Clock size={10} /> {created.toLocaleDateString()}</span>
              <span className="px-1.5 py-0.5 bg-black/5 struct-line">{entry.difficulty}</span>
              <span className="flex items-center gap-1">
                {entry.status === 'completed' ? <CheckCircle size={10} /> : <Circle size={10} />}
                {entry.status === 'completed' ? t('journal.completed') : t('journal.inProgress')}
              </span>
            </div>
          </div>
          {user && user.uid === entry.userId && (
            <button onClick={() => deleteEntry(entry.id)} className="p-2 text-red-600 hover:bg-red-50 struct-line">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="struct-line-t pt-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
        </div>
      </div>
    </div>
  )
}
