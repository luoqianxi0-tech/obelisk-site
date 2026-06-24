import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { Home, PenSquare, BookOpen, Hammer, FileText, User } from 'lucide-react'

export default function MobileNav() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/monument', icon: PenSquare, label: t('nav.monument') },
    { to: '/vault', icon: BookOpen, label: t('nav.vault') },
    { to: '/workshop', icon: Hammer, label: t('nav.workshop') },
    { to: '/journal', icon: FileText, label: t('nav.journal') },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong struct-line-t">
      <div className="flex items-center justify-around h-14">
        {tabs.map(tab => {
          const active = location.pathname === tab.to || location.pathname.startsWith(tab.to + '/')
          return (
            <Link key={tab.to} to={tab.to} className="flex flex-col items-center gap-0.5 py-1 px-3">
              <tab.icon size={18} className={active ? 'text-obelisk-line' : 'text-obelisk-muted'} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${active ? 'text-obelisk-line' : 'text-obelisk-muted'}`}>{tab.label}</span>
            </Link>
          )
        })}
        <Link to="/archive" className="flex flex-col items-center gap-0.5 py-1 px-3">
          <User size={18} className={location.pathname.startsWith('/archive') ? 'text-obelisk-line' : 'text-obelisk-muted'} strokeWidth={location.pathname.startsWith('/archive') ? 2.5 : 2} />
          <span className="text-[10px] font-medium text-obelisk-muted">{t('nav.archive')}</span>
        </Link>
      </div>
    </div>
  )
}
