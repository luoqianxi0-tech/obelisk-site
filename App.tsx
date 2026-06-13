import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ParticleBackground } from './components/ParticleBackground'
import { AuthOverlay } from './components/AuthOverlay'
import { AdminScan } from './components/AdminScan'
import { NavBar } from './components/NavBar'
import { Terminal } from './components/Terminal'
import { Splash } from './pages/Splash'
import { Home } from './pages/Home'
import { Reverse } from './pages/Reverse'
import { DarkNav } from './pages/DarkNav'
import { Inspo } from './pages/Inspo'
import { Motion } from './pages/Motion'
import { Profile } from './pages/Profile'

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 }
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="h-full w-full overflow-y-auto overflow-x-hidden"
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const isSplash = location.pathname === '/splash'

  return (
    <div className="h-screen w-screen bg-black text-obelisk-fg font-sans overflow-hidden relative">
      <ParticleBackground />
      <AuthOverlay />
      <AdminScan />

      {!isSplash && <NavBar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/splash" element={<Splash />} />
          <Route path="/" element={
            <AnimatedPage><Home /></AnimatedPage>
          } />
          <Route path="/reverse" element={
            <AnimatedPage><Reverse /></AnimatedPage>
          } />
          <Route path="/darknav" element={
            <AnimatedPage><DarkNav /></AnimatedPage>
          } />
          <Route path="/inspo" element={
            <AnimatedPage><Inspo /></AnimatedPage>
          } />
          <Route path="/motion" element={
            <AnimatedPage><Motion /></AnimatedPage>
          } />
          <Route path="/profile" element={
            <AnimatedPage><Profile /></AnimatedPage>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {!isSplash && location.pathname !== '/' && <Terminal />}
    </div>
  )
}
