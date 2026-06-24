import { useParams, Link } from 'react-router-dom'
import { useCircles } from '../hooks/useCircles.jsx'
import { usePosts } from '../hooks/usePosts.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import PostCard from '../components/PostCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { ArrowLeft, Users, FileText, Plus } from 'lucide-react'

export default function CircleDetail() {
  const { circleId } = useParams()
  const { circles, joinCircle, leaveCircle } = useCircles()
  const { posts } = usePosts()
  const { user } = useAuth()
  const { t } = useTranslation()
  const circle = circles.find(c => c.id === circleId)
  const circlePosts = posts.filter(p => p.circleId === circleId)
  const isMember = circle && circle.members && circle.members.includes(user && user.uid)

  if (!circle) return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-center">
      <p className="text-obelisk-muted">{t('common.loading')}</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link to="/monument/circles" className="inline-flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line mb-4">
        <ArrowLeft size={14} /> {t('common.back')}
      </Link>

      <div className="glass-strong p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 struct-line flex items-center justify-center text-2xl shrink-0">
              {circle.icon || '◆'}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{circle.name}</h1>
              <p className="text-sm text-obelisk-muted mt-1 max-w-lg">{circle.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-obelisk-muted">
                <span className="flex items-center gap-1"><Users size={12} /> {circle.memberCount || 0} {t('monument.members')}</span>
                <span className="flex items-center gap-1"><FileText size={12} /> {circle.postCount || 0} {t('monument.posts')}</span>
              </div>
            </div>
          </div>
          {user && (
            <button
              onClick={() => isMember ? leaveCircle(circleId, user.uid) : joinCircle(circleId, user.uid)}
              className={isMember ? 'btn-secondary text-xs' : 'btn-primary text-xs'}
            >
              {isMember ? t('monument.leave') : t('monument.join')}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold tracking-tight">{t('monument.posts')}</h2>
        {user && (
          <Link to={'/monument/new?circle=' + circleId} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
            <Plus size={12} /> {t('monument.newPost')}
          </Link>
        )}
      </div>
      {circlePosts.length > 0 ? circlePosts.map(p => <PostCard key={p.id} post={p} />) : (
        <EmptyState title={t('monument.emptyPlaza')} desc={t('monument.emptyPlazaDesc')} />
      )}
    </div>
  )
}
