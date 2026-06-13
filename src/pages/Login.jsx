import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth.js'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="glass-panel p-12 text-center max-w-[380px] w-[90%]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-[1.1rem] font-light tracking-[0.15em] mb-1 text-white/90">System Access</h3>
        <div className="text-[0.65rem] text-white/20 tracking-[0.15em] uppercase mb-6">Authentication Required</div>
        <p className="text-[0.8rem] text-white/30 mb-8 leading-relaxed">
          Authenticate with Google to unlock full access.
          <br />
          <span className="text-[0.7rem] text-white/15">Sign in to access your Prism Profile and arsenal.</span>
        </p>
        <button
          onClick={login}
          className="flex items-center justify-center gap-3 w-full py-3.5 bg-white/5 border border-white/10 text-white/70 text-[0.85rem] cursor-pointer hover:bg-white/10 hover:border-white/25 transition-all"
        >
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </button>
      </motion.div>
    </div>
  )
}
