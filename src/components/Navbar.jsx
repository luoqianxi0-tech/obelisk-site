import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, LogOut, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useObeliskStore } from '../store.js'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { lang, setLang } = useObeliskStore()
  const loc = useLocation()

  const toggleLang = () => setLang(lang === 'en' ? 'zh' : 'en')

  return (
    <nav className="relative z-10 flex justify-between items-center px-10 py-5 backdrop-blur-md">
      <Link to="/" className="text-[0.9rem] tracking-[0.3em] font-light text-white/70 hover:text-white transition-colors">
        OBELISK
      </Link>
      <div className="flex items-center gap-3">
        <button onClick={toggleLang} className="w-8 h-8 border border-white/10 bg-transparent text-white/40 flex items-center justify-center cursor-pointer hover:border-white/30 hover:text-white transition-all">
          <Globe size={16} />
        </button>
        {!user ? (
          <Link to="/login" state={{ from: loc.pathname }} className="glass-btn">
            {lang === 'en' ? 'Sign In' : '登录'}
          </Link>
        ) : (
          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <span className="px-2 py-[3px] bg-[rgba(100,255,150,0.1)] border border-[rgba(100,255,150,0.6)] text-[rgba(100,255,150,0.8)] text-[0.55rem] tracking-[0.1em] uppercase font-mono">
                ★ ADMIN
              </span>
            )}
            <Link to="/profile">
              <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full border border-white/20 object-cover cursor-pointer hover:scale-110 transition-transform" />
            </Link>
            <button onClick={logout} className="w-8 h-8 border border-white/10 bg-transparent text-white/40 flex items-center justify-center cursor-pointer hover:border-white/30 hover:text-white transition-all">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
