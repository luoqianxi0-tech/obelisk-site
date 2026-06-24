import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { Target, FolderGit2, Bug, NotebookPen } from 'lucide-react'

export default function Journal() {
  const { t } = useTranslation()
  const location = useLocation()
  const cats = [
    { to: '/journal/range', label: t('nav.range'), icon: Target },
    { to: '/journal/project', label: t('nav.project'), icon: FolderGit2 },
    { to: '/journal/vuln', label: t('nav.vuln'), icon: Bug },
    { to: '/journal/notes', label: t('nav.notes'), icon: NotebookPen },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">{t('journal.title')}</h1>
        <p className="text-sm text-obelisk-muted">{t('journal.desc')}</p>
      </div>
      <div className="flex gap-1 mb-6 overflow-x-auto scroll-hide pb-1">
        {cats.map(c => {
          const active = location.pathname === c.to
          return (
            <Link key={c.to} to={c.to} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap struct-line ${active ? 'bg-obelisk-line text-white' : 'hover:bg-white/70'}`}>
              <c.icon size={14} /> {c.label}
            </Link>
          )
        })}
      </div>
      <Outlet />
    </div>
  )
}
