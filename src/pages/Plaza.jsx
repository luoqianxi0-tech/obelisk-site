import { usePosts } from '../hooks/usePosts.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import PostCard from '../components/PostCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function Plaza() {
  const { posts, loading } = usePosts()
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const filtered = posts.filter(p => (p.content || '').toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-obelisk-muted" />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder={t('common.search')}
            className="input-struct pl-9 text-sm"
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-sm text-obelisk-muted">{t('common.loading')}</div>
      ) : filtered.length > 0 ? (
        filtered.map(post => <PostCard key={post.id} post={post} />)
      ) : (
        <EmptyState title={t('monument.emptyPlaza')} desc={t('monument.emptyPlazaDesc')} />
      )}
    </div>
  )
}
