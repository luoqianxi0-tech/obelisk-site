import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useObeliskStore } from '../store.js'

export default function Splash() {
  const { showSplash, setShowSplash } = useObeliskStore()
  const [showBtn, setShowBtn] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowBtn(true), 5000)
    const t2 = setTimeout(() => setShowSplash(false), 8000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [setShowSplash])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 1 } }}
          onClick={() => setShowSplash(false)}
        >
          <video autoPlay muted playsInline disablePictureInPicture disableRemotePlayback className="w-full h-full object-contain">
            <source src="/splash.mp4" type="video/mp4" />
          </video>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[0.65rem] tracking-[0.3em] text-white/15 uppercase pointer-events-none">
            Initializing Sequence...
          </div>
          <motion.button
            className="absolute bottom-16 left-1/2 -translate-x-1/2 px-12 py-3.5 bg-white/6 border border-white/20 text-white/70 text-[0.75rem] tracking-[0.25em] uppercase cursor-pointer backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={showBtn ? { opacity: 1, y: 0, pointerEvents: 'auto' } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
            onClick={(e) => { e.stopPropagation(); setShowSplash(false) }}
          >
            Enter Site
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
