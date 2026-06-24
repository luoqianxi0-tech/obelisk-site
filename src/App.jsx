import { useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import SplashScreen from './components/SplashScreen.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Monument = lazy(() => import('./pages/Monument.jsx'))
const Plaza = lazy(() => import('./pages/Plaza.jsx'))
const Circles = lazy(() => import('./pages/Circles.jsx'))
const CircleDetail = lazy(() => import('./pages/CircleDetail.jsx'))
const Following = lazy(() => import('./pages/Following.jsx'))
const MyPosts = lazy(() => import('./pages/MyPosts.jsx'))
const PostDetail = lazy(() => import('./pages/PostDetail.jsx'))
const NewPost = lazy(() => import('./pages/NewPost.jsx'))
const Vault = lazy(() => import('./pages/Vault.jsx'))
const VaultCategory = lazy(() => import('./pages/VaultCategory.jsx'))
const Workshop = lazy(() => import('./pages/Workshop.jsx'))
const WorkshopCategory = lazy(() => import('./pages/WorkshopCategory.jsx'))
const Journal = lazy(() => import('./pages/Journal.jsx'))
const JournalCategory = lazy(() => import('./pages/JournalCategory.jsx'))
const JournalDetail = lazy(() => import('./pages/JournalDetail.jsx'))
const Archive = lazy(() => import('./pages/Archive.jsx'))
const Nexus = lazy(() => import('./pages/Nexus.jsx'))
const AgentPanel = lazy(() => import('./pages/AgentPanel.jsx'))

function Loading() {
  return <div className="flex items-center justify-center h-64 text-sm text-obelisk-muted">Loading...</div>
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('obelisk-splash-done'))

  const handleSplashDone = () => {
    sessionStorage.setItem('obelisk-splash-done', '1')
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashDone} />}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/agent" element={<AgentPanel />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/nexus" element={<Nexus />} />

            <Route path="/monument" element={<Monument />}>
              <Route index element={<Plaza />} />
              <Route path="plaza" element={<Plaza />} />
              <Route path="circles" element={<Circles />} />
              <Route path="circle/:circleId" element={<CircleDetail />} />
              <Route path="following" element={<Following />} />
              <Route path="mine" element={<MyPosts />} />
            </Route>
            <Route path="/monument/post/:postId" element={<PostDetail />} />
            <Route path="/monument/new" element={<NewPost />} />

            <Route path="/vault" element={<Vault />}>
              <Route index element={<VaultCategory />} />
              <Route path=":category" element={<VaultCategory />} />
            </Route>

            <Route path="/workshop" element={<Workshop />}>
              <Route index element={<WorkshopCategory />} />
              <Route path=":category" element={<WorkshopCategory />} />
            </Route>

            <Route path="/journal" element={<Journal />}>
              <Route index element={<JournalCategory />} />
              <Route path=":category" element={<JournalCategory />} />
            </Route>
            <Route path="/journal/:category/:id" element={<JournalDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
