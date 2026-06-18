import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useI18n } from '../i18n.js'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogIn, LogOut, Shield, Globe } from 'lucide-react'

export default function Navbar() {
  const { user, isAdmin, login, logout } = useAuth()
  const { t, toggleLang, lang } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogin = async () => {
    try { await login() } catch (e) { alert(t('auth.login') + '失败: ' + e.message) }
  }

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/stele', label: t('nav.stele') },
    { path: '/aggregate', label: t('nav.aggregate') },
    { path: '/index', label: t('nav.index') },
    { path: '/design', label: t('nav.design') },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-panel shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-obelisk-line rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-obelisk-line hidden sm:block">{t('siteName')}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'bg-obelisk-line text-white' : 'text-obelisk-textMuted hover:text-obelisk-line hover:bg-obelisk-surfaceDark'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg hover:bg-obelisk-surfaceDark transition-colors"
              title="Language"
            >
              <Globe className="w-4 h-4 text-obelisk-textMuted" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="p-2 rounded-lg bg-obelisk-line text-white" title="Admin">
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-obelisk-surfaceDark transition-colors">
                  <img src={user.photoURL || '/default-avatar.png'} alt="" className="w-7 h-7 rounded-full bg-obelisk-surfaceDark" />
                  <span className="text-sm font-medium hidden sm:block">{user.displayName}</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-lg hover:bg-obelisk-surfaceDark transition-colors" title={t('auth.logout')}>
                  <LogOut className="w-4 h-4 text-obelisk-textMuted" />
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">{t('auth.login')}</span>
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-obelisk-surfaceDark transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-obelisk-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === item.path ? 'bg-obelisk-line text-white' : 'text-obelisk-text'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-obelisk-text">{t('nav.profile')}</Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-obelisk-text">{t('nav.settings')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
