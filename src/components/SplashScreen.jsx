import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setVisible(false)
            onComplete?.()
          }, 400)
          return 100
        }
        return p + 2
      })
    }, 30)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ec 50%, #f0f0f4 100%)' }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="structure-line structure-line-v" style={{ left: '20%' }} />
            <div className="structure-line structure-line-v" style={{ left: '50%' }} />
            <div className="structure-line structure-line-v" style={{ left: '80%' }} />
            <div className="structure-line structure-line-h" style={{ top: '30%' }} />
            <div className="structure-line structure-line-h" style={{ top: '70%' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-obelisk-line mb-8">
              OBELISK
            </h1>

            <div className="w-48 h-[2px] bg-obelisk-line mx-auto mb-6" />

            <div className="w-48 h-1 bg-obelisk-border rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-obelisk-line"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-4 text-xs text-obelisk-textMuted tracking-widest uppercase">
              {progress}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
