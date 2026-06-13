import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

export function AuthOverlay() {
  const loading = useAuthStore((s) => s.loading)

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 bg-black z-[99999] flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-9 h-9 border border-white/10 border-t-obelisk-accent rounded-full animate-[spin_1s_linear_infinite] mx-auto mb-4" />
            <div className="text-[0.65rem] tracking-[0.3em] text-white/30 uppercase">Authenticating</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
