import { Outlet, Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function SteleLayout() {
  const { t } = useI18n()
  const { user } = useAuth()
  const location = useLocation()

  const subNav = [
    { to: '/stele', label: t('stele.all'), icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { to: '/stele/following', label: t('stele.following'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { to: '/stele/trending', label: t('stele.trending'), icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { to: '/stele/groups', label: t('stele.groups'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ]

  const isActive = (to) => {
    if (to === '/stele') return location.pathname === '/stele' || location.pathname === '/stele/'
    return location.pathname.startsWith(to)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <aside className="md:w-64 shrink-0">
          <div className="glass-card rounded-2xl p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-obelisk-line">{t('stele.title')}</h2>
              {user && (
                <Link to="/stele/new" className="w-8 h-8 rounded-lg bg-obelisk-line text-white flex items-center justify-center hover:bg-black transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </Link>
              )}
            </div>
            <nav className="space-y-1">
              {subNav.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(item.to)
                      ? 'bg-obelisk-line text-white'
                      : 'text-obelisk-textMuted hover:bg-black/5 hover:text-obelisk-line'
                  }`}
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-obelisk-border">
              <h3 className="text-xs font-semibold text-obelisk-textMuted uppercase tracking-wider mb-3">{t('stele.tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {['Frida', 'APK', 'CVE', 'Pwn', 'Web3', 'OSINT'].map(tag => (
                  <Link key={tag} to={`/stele/tags/${tag}`} className="text-xs px-2 py-1 rounded-full bg-obelisk-surfaceDark text-obelisk-textMuted hover:bg-obelisk-line hover:text-white transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
