import { usePosts } from '../hooks/usePosts.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import PostCard from '../components/PostCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Following() {
  const { posts } = usePosts()
  const { profile } = useAuth()
  const { t } = useTranslation()
  const following = profile && profile.following ? profile.following : []
  const filtered = posts.filter(p => p.author && following.includes(p.author.uid))

  return (
    <div>
      {filtered.length > 0 ? filtered.map(p => <PostCard key={p.id} post={p} />) : (
        <EmptyState title={t('monument.emptyFollowing')} desc={t('monument.emptyFollowing')} />
      )}
    </div>
  )
}
