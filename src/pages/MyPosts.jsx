import { usePosts } from '../hooks/usePosts.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import PostCard from '../components/PostCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function MyPosts() {
  const { posts } = usePosts()
  const { user } = useAuth()
  const { t } = useTranslation()
  const mine = posts.filter(p => p.author && p.author.uid === (user && user.uid))

  return (
    <div>
      {mine.length > 0 ? mine.map(p => <PostCard key={p.id} post={p} />) : (
        <EmptyState title={t('monument.emptyMine')} desc={t('monument.emptyPlazaDesc')} />
      )}
    </div>
  )
}
