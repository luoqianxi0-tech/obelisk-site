import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { PenSquare, LayoutGrid, Users, Heart, User } from 'lucide-react'

export default function Monument() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()
  const isNew = location.pathname === '/monument/new'
  const isPost = location.pathname.startsWith('/monument/post/')
  const isCircle = location.pathname.startsWith('/monument/circle/')

  const tabs = [
    { to: '/monument/plaza', label: t('nav.plaza'), icon: LayoutGrid },
    { to: '/monument/circles', label: t('nav.circles'), icon: Users },
    { to: '/monument/following', label: t('nav.following'), icon: Heart },
    { to: '/monument/mine', label: t('nav.mine'), icon: User },
  ]

  if (isNew || isPost || isCircle) {
    return <Outlet />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('nav.monument')}</h1>
          <p className="text-sm text-obelisk-muted">{t('home.subtitle')}</p>
        </div>
        {user && (
          <Link to="/monument/new" className="btn-primary flex items-center gap-2">
            <PenSquare size={14} /> {t('monument.newPost')}
          </Link>
        )}
      </div>
      <div className="flex gap-1 mb-6 overflow-x-auto scroll-hide pb-1">
        {tabs.map(tab => {
          const active = location.pathname === tab.to
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap struct-line ${
                active ? 'bg-obelisk-line text-white' : 'hover:bg-white/70'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </Link>
          )
        })}
      </div>
      <Outlet />
    </div>
  )
}
