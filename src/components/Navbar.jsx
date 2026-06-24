import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { t, lang, toggleLang } = useI18n()
  const { user, login, logout, isAdmin } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/stele', label: t('nav.stele') },
    { to: '/aggregate', label: t('nav.aggregate') },
    { to: '/index', label: t('nav.index') },
    { to: '/labs', label: t('nav.labs') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/writeups', label: t('nav.writeups') },
  ]

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-obelisk-glassBorder">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-obelisk-line rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-obelisk-line">{t('siteName')}</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-obelisk-line text-white'
                  : 'text-obelisk-textMuted hover:text-obelisk-line hover:bg-black/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 text-xs font-medium rounded-full border border-obelisk-border hover:bg-black/5 transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <img src={user.photoURL || '/default-avatar.png'} alt="" className="w-7 h-7 rounded-full object-cover" />
                {isAdmin && (
                  <span className="text-[10px] font-bold bg-obelisk-line text-white px-1.5 py-0.5 rounded">{t('auth.adminBadge')}</span>
                )}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-xl border border-obelisk-glassBorder py-1">
                  <div className="px-4 py-2 border-b border-obelisk-border">
                    <p className="text-sm font-medium text-obelisk-line truncate">{user.displayName}</p>
                    <p className="text-xs text-obelisk-textMuted truncate">{user.email}</p>
                    {isAdmin && <p className="text-[10px] text-emerald-600 font-bold mt-1">{t('auth.rootAccess')}</p>}
                  </div>
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-black/5">{t('nav.profile')}</Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-black/5">{t('nav.settings')}</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-black/5">{t('nav.admin')}</Link>
                  )}
                  <button onClick={() => { logout(); setProfileOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-black/5">{t('auth.logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={login} className="btn-primary text-sm py-2 px-4">{t('auth.login')}</button>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-black/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-panel border-t border-obelisk-glassBorder px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium my-1 ${
                isActive(link.to) ? 'bg-obelisk-line text-white' : 'text-obelisk-textMuted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
