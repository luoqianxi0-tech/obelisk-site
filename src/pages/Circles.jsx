import { useCircles } from '../hooks/useCircles.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import CircleCard from '../components/CircleCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function Circles() {
  const { circles, loading } = useCircles()
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const filtered = circles.filter(c => (c.name || '').toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obelisk-muted" />
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder={t('common.search')} className="input-struct pl-9 text-sm" />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-sm text-obelisk-muted">{t('common.loading')}</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(c => <CircleCard key={c.id} circle={c} />)}
        </div>
      ) : (
        <EmptyState title={t('monument.emptyCircles')} desc={t('monument.emptyPlazaDesc')} />
      )}
    </div>
  )
}
