import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogIn, LogOut, Shield, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, isAdmin, login, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/beike', label: t('nav.beike') },
    { path: '/circle', label: t('nav.circle') },
    { path: '/arsenal', label: t('nav.arsenal') },
    { path: '/design', label: t('nav.design') },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <span className="text-xs font-mono font-bold">O</span>
            </div>
            <span className="text-lg font-light tracking-[0.2em] hidden sm:block">OBELISK</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm transition-colors relative ${
                  isActive(link.path) ? 'text-black font-medium' : 'text-black/40 hover:text-black'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-4 right-4 h-[1px] bg-black" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className={`px-4 py-2 text-sm flex items-center gap-1 transition-colors ${isActive('/admin') ? 'text-black font-medium' : 'text-black/40 hover:text-black'}`}>
                <Shield className="w-3 h-3" /> {t('nav.admin')}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 text-xs border border-black/10 hover:bg-black/5 transition-colors"
            >
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 transition-colors rounded">
                  <img src={user.photoURL || 'https://via.placeholder.com/32'} alt="" className="w-7 h-7 rounded-full border border-black/10" />
                  <span className="text-sm hidden lg:block max-w-[100px] truncate">{user.displayName}</span>
                  {isAdmin && <span className="text-[10px] bg-black text-white px-1.5 py-0.5 tracking-wider">ADMIN</span>}
                </Link>
                <button onClick={logout} className="p-2 hover:bg-black/5 transition-colors rounded" title={t('auth.logout')}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/80 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:block">{t('auth.login')}</span>
              </button>
            )}

            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-black/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm ${isActive(link.path) ? 'bg-black/5 font-medium' : ''}`}>
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm">
                  <Shield className="w-4 h-4" /> {t('nav.admin')}
                </Link>
              )}
              <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm">
                <Settings className="w-4 h-4" /> {t('nav.settings')}
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm">
                {t('profile.settings')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
