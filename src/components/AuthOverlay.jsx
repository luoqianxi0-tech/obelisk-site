import { motion } from 'framer-motion'
import { useObeliskStore } from '../store.js'

export default function AuthOverlay() {
  const { isAuthReady } = useObeliskStore()

  return (
    <motion.div
      className="fixed inset-0 bg-black z-[99999] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={isAuthReady ? { opacity: 0, pointerEvents: 'none' } : { opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="text-center">
        <div className="w-9 h-9 border border-white/10 border-t-[rgba(100,255,150,0.6)] rounded-full animate-spin mx-auto mb-4" />
        <div className="text-[0.65rem] tracking-[0.3em] text-white/30 uppercase">Authenticating</div>
      </div>
    </motion.div>
  )
}
