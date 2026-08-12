import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { ObeliskIcon } from './ObeliskIcon';
import { Menu, X, Shield, User, Settings, LogOut, LogIn } from 'lucide-react';

export const Navbar = () => {
  const { user, isAdmin, login, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/beike', label: t('nav.beike') },
    { path: '/circle', label: t('nav.circle') },
    { path: '/arsenal', label: t('nav.arsenal') },
    { path: '/design', label: t('nav.design') },
    { path: '/storage', label: t('nav.storage') },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <ObeliskIcon className="w-7 h-7" />
            <span className="text-lg font-medium tracking-wide">OBELISK</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-2 text-sm transition-colors ${isActive(link.path) ? 'text-black font-medium' : 'text-black/40 hover:text-black'}`}>
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className={`px-3 py-2 text-sm flex items-center gap-1 ${isActive('/admin') ? 'text-black font-medium' : 'text-black/40 hover:text-black'}`}>
                <Shield className="w-3.5 h-3.5" />{t('nav.admin')}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
                  <img src={user.photoURL || 'https://via.placeholder.com/32'} alt="" className="w-7 h-7 rounded-full border border-black/10" />
                  <span className="max-w-[100px] truncate">{user.displayName}</span>
                  {isAdmin && <span className="text-[10px] bg-black text-white px-1.5 py-0.5">{t('auth.adminBadge')}</span>}
                </Link>
                <button onClick={logout} className="p-2 hover:bg-black/5 rounded-full transition"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={login} className="btn-primary flex items-center gap-2"><LogIn className="w-4 h-4" />{t('auth.login')}</button>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-black/5 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 text-sm ${isActive(link.path) ? 'bg-black/5 font-medium' : ''}`}>{link.label}</Link>
          ))}
          {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm"><Shield className="w-4 h-4" />{t('nav.admin')}</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm"><User className="w-4 h-4" />{t('nav.profile')}</Link>
              <Link to="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm"><Settings className="w-4 h-4" />{t('nav.settings')}</Link>
              <button onClick={() => { setMobileOpen(false); logout(); }} className="flex items-center gap-2 px-3 py-2 text-sm w-full"><LogOut className="w-4 h-4" />{t('auth.logout')}</button>
            </>
          ) : (
            <button onClick={() => { setMobileOpen(false); login(); }} className="flex items-center gap-2 px-3 py-2 text-sm w-full"><LogIn className="w-4 h-4" />{t('auth.login')}</button>
          )}
        </div>
      )}
    </nav>
  );
};