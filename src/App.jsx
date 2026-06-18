import { useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SplashScreen from './components/SplashScreen.jsx'
import Navbar from './components/Navbar.jsx'
import StructureLines from './components/StructureLines.jsx'
import Footer from './components/Footer.jsx'
import { useAuth } from './auth/AuthProvider.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Stele = lazy(() => import('./pages/Stele.jsx'))
const Aggregate = lazy(() => import('./pages/Aggregate.jsx'))
const Index = lazy(() => import('./pages/Index.jsx'))
const Design = lazy(() => import('./pages/Design.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-obelisk-line border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const { loading } = useAuth()

  if (!splashDone || loading) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />
  }

  return (
    <div className="min-h-screen relative">
      <StructureLines />
      <Navbar />

      <main className="relative z-10 pt-16">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/stele" element={<PageWrapper><Stele /></PageWrapper>} />
            <Route path="/aggregate" element={<PageWrapper><Aggregate /></PageWrapper>} />
            <Route path="/index" element={<PageWrapper><Index /></PageWrapper>} />
            <Route path="/design" element={<PageWrapper><Design /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
