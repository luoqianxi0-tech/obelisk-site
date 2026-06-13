import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Splash() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const hasEntered = sessionStorage.getItem('obelisk_entered') === 'true'
    if (hasEntered) {
      navigate('/', { replace: true })
      return
    }

    // 5秒安全超时
    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  const enterSite = () => {
    sessionStorage.setItem('obelisk_entered', 'true')
    navigate('/', { replace: true })
  }

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999] cursor-pointer"
      onClick={enterSite}
    >
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline 
        disablePictureInPicture 
        disableRemotePlayback
        className="w-full h-full object-contain"
        onEnded={enterSite}
        onError={enterSite}
      >
        <source src="/splash.mp4" type="video/mp4" />
      </video>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[0.65rem] tracking-[0.3em] text-white/30 uppercase pointer-events-none">
        Initializing Sequence...
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={(e) => { e.stopPropagation(); enterSite() }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 px-12 py-3.5 bg-white/[0.06] border border-white/20 text-white/70 text-[0.75rem] tracking-[0.25em] uppercase hover:bg-white/[0.12] hover:border-white/50 hover:text-white transition-all backdrop-blur-[10px]"
      >
        Enter Site
      </motion.button>
    </div>
  )
}
