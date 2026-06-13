import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Globe, LogOut, User } from 'lucide-react'

export function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin, logout } = useAuthStore()

  const isHome = location.pathname === '/'

  return (
    <div className="relative z-10 flex justify-between items-center px-6 py-5 md:px-10 backdrop-blur-[10px]">
      <button 
        onClick={() => navigate('/')}
        className="text-[0.9rem] tracking-[0.3em] font-light text-white/70 hover:text-white transition-colors"
      >
        {isHome ? 'OBELISK' : '← OBELISK'}
      </button>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="hidden md:inline-block px-2 py-1 bg-obelisk-accent/10 border border-obelisk-accent text-obelisk-accent text-[0.55rem] tracking-[0.1em] uppercase font-mono animate-pulse">
                ★ ADMIN
              </span>
            )}
            <img 
              src={user.photoURL || ''} 
              alt="avatar" 
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full border border-white/20 cursor-pointer hover:scale-110 transition-transform object-cover"
            />
            <button 
              onClick={() => logout()}
              className="w-8 h-8 border border-white/10 bg-transparent text-white/40 hover:text-white hover:border-white/30 transition-all flex items-center justify-center"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => useAuthStore.getState().login()}
            className="px-5 py-2 bg-transparent border border-white/15 text-white/50 text-[0.75rem] tracking-[0.15em] hover:border-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}
