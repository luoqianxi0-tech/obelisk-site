import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { useAgent } from '../hooks/useAgent.jsx'
import { Menu, X, Globe, Zap, Shield } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAdmin, openLogin, logout } = useAuth()
  const { t, lang, switchLang } = useTranslation()
  const { status } = useAgent()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/monument', label: t('nav.monument') },
    { to: '/vault', label: t('nav.vault') },
    { to: '/workshop', label: t('nav.workshop') },
    { to: '/journal', label: t('nav.journal') },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong h-16 struct-line-b">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tighter">OBELISK</span>
          {isAdmin && <Shield size={14} className="text-obelisk-accent" />}
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 text-sm font-medium tracking-wide transition-colors ${
                isActive(l.to) ? 'bg-obelisk-line text-white' : 'hover:bg-black/5'
              }`}
              style={{ border: '2px solid transparent', borderColor: isActive(l.to) ? '#111' : 'transparent' }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/agent" className="hidden md:flex items-center gap-1.5 px-2 py-1 text-xs font-mono struct-line">
            <Zap size={12} className={status === 'online' ? 'text-green-600' : 'text-gray-400'} />
            <span className="uppercase">{status === 'online' ? 'ON' : 'OFF'}</span>
          </Link>
          <button
            onClick={() => switchLang(lang === 'zh' ? 'en' : 'zh')}
            className="p-2 hover:bg-black/5 struct-line"
          >
            <Globe size={16} />
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/archive" className="flex items-center gap-2 px-3 py-1.5 struct-line hover:bg-black/5">
                <img src={user.photoURL || ''} alt="" className="w-6 h-6 object-cover" onError={e => { e.target.style.display='none' }} />
                <span className="text-xs font-medium hidden lg:inline">{user.displayName}</span>
                {isAdmin && <span className="text-[10px] bg-obelisk-accent text-obelisk-line px-1 font-bold">{t('auth.adminBadge')}</span>}
              </Link>
              <button onClick={logout} className="text-xs px-2 py-1.5 struct-line hover:bg-black/5 hidden md:block">
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <button onClick={openLogin} className="btn-primary text-xs py-1.5 px-3">
              {t('nav.login')}
            </button>
          )}
          <button className="md:hidden p-2 struct-line" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong struct-line-t p-4 space-y-2">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium struct-line">
              {l.label}
            </Link>
          ))}
          <Link to="/archive" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium struct-line">
            {t('nav.archive')}
          </Link>
          {isAdmin && (
            <Link to="/nexus" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium struct-line">
              {t('nav.nexus')}
            </Link>
          )}
          {user && (
            <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium struct-line">
              {t('nav.logout')}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
