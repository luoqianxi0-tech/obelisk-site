import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('video')
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onCanPlay = () => { v.play().catch(() => setVideoFailed(true)) }
    const onError = () => setVideoFailed(true)
    v.addEventListener('canplaythrough', onCanPlay)
    v.addEventListener('error', onError)
    timerRef.current = setTimeout(() => setVideoFailed(true), 8000)
    return () => {
      v.removeEventListener('canplaythrough', onCanPlay)
      v.removeEventListener('error', onError)
      clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (videoFailed) {
      const t = setTimeout(() => setPhase('done'), 2000)
      return () => clearTimeout(t)
    }
  }, [videoFailed])

  const handleEnter = () => setPhase('done')

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: '#111' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {!videoFailed && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              src="/splash.mp4"
              muted
              loop
              playsInline
              preload="auto"
            />
          )}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.h1
              className="text-6xl md:text-8xl font-black tracking-tighter text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              OBELISK
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <button
                onClick={handleEnter}
                className="px-8 py-3 bg-white text-black font-bold text-sm tracking-widest struct-line hover:bg-obelisk-accent transition-colors"
              >
                ENTER
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
