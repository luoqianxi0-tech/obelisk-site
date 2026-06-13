import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export function AdminScan() {
  const [active, setActive] = useState(false)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (isAdmin && user && !sessionStorage.getItem('obelisk_admin_alerted')) {
      sessionStorage.setItem('obelisk_admin_alerted', 'true')
      setActive(true)
      const t = setTimeout(() => setActive(false), 1600)
      return () => clearTimeout(t)
    }
  }, [isAdmin, user])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[9998] pointer-events-none"
        >
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-obelisk-accent to-transparent shadow-[0_0_20px_rgba(100,255,150,0.6)]" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
