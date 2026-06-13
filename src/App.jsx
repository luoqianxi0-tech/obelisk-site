import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth.js'
import { useObeliskStore } from './store.js'
import { connectAgent } from './agent.js'
import Splash from './components/Splash.jsx'
import AuthOverlay from './components/AuthOverlay.jsx'
import Navbar from './components/Navbar.jsx'
import ParticleCanvas from './components/ParticleCanvas.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Reverse from './pages/Reverse.jsx'
import DarkNav from './pages/DarkNav.jsx'
import Inspo from './pages/Inspo.jsx'
import Motion from './pages/Motion.jsx'
import Login from './pages/Login.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
}

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="h-full overflow-y-auto">
      {children}
    </motion.div>
  )
}

export default function App() {
  const { isAuthReady } = useAuth()
  const { showSplash } = useObeliskStore()

  useEffect(() => {
    connectAgent()
    return () => { /* disconnect on unmount if needed */ }
  }, [])

  const location = useLocation()

  return (
    <div className="relative h-screen w-screen bg-black text-obelisk-fg overflow-hidden">
      <ParticleCanvas />
      <Splash />
      {!showSplash && <AuthOverlay />}
      {!showSplash && isAuthReady && (
        <>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
              <Route path="/reverse" element={<AnimatedPage><Reverse /></AnimatedPage>} />
              <Route path="/darknav" element={<AnimatedPage><DarkNav /></AnimatedPage>} />
              <Route path="/inspo" element={<AnimatedPage><Inspo /></AnimatedPage>} />
              <Route path="/motion" element={<AnimatedPage><Motion /></AnimatedPage>} />
              <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
