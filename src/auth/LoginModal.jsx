import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield } from 'lucide-react'
import { useAuth } from './AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'

export default function LoginModal() {
  const { loginOpen, closeLogin, login, loginLoading, loginError, isAdmin } = useAuth()
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeLogin} />
          <motion.div
            className="relative glass-strong w-full max-w-md p-8"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          >
            <button onClick={closeLogin} className="absolute top-4 right-4 p-1 hover:bg-black/5">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">{t('auth.loginTitle')}</h2>
              <p className="text-sm text-obelisk-muted mt-1">{t('auth.loginDesc')}</p>
            </div>
            {isAdmin && (
              <div className="mb-4 p-3 bg-obelisk-accent/10 struct-line flex items-center gap-2">
                <Shield size={16} className="text-obelisk-accent" />
                <span className="text-xs font-bold tracking-widest text-obelisk-accent">{t('auth.rootAccess')}</span>
              </div>
            )}
            <button
              onClick={login}
              disabled={loginLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginLoading ? t('auth.loggingIn') : t('auth.loginBtn')}
            </button>
            {loginError && <p className="text-red-600 text-xs mt-3">{loginError}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
