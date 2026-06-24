import { Routes, Route, Navigate } from 'react-router-dom'
import { I18nProvider } from './i18n.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import SteleLayout from './pages/Stele/SteleLayout.jsx'
import AllFeed from './pages/Stele/AllFeed.jsx'
import FollowingFeed from './pages/Stele/FollowingFeed.jsx'
import TrendingFeed from './pages/Stele/TrendingFeed.jsx'
import GroupsList from './pages/Stele/GroupsList.jsx'
import GroupDetail from './pages/Stele/GroupDetail.jsx'
import PostDetail from './pages/Stele/PostDetail.jsx'
import NewPost from './pages/Stele/NewPost.jsx'
import Aggregate from './pages/Aggregate.jsx'
import IndexPage from './pages/IndexPage.jsx'
import Design from './pages/Design.jsx'
import Labs from './pages/Labs.jsx'
import Projects from './pages/Projects.jsx'
import Writeups from './pages/Writeups.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import Settings from './pages/Settings.jsx'
import { useAuth } from './hooks/useAuth.jsx'

function AdminGuard({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <I18nProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stele" element={<SteleLayout />}>
            <Route index element={<AllFeed />} />
            <Route path="following" element={<FollowingFeed />} />
            <Route path="trending" element={<TrendingFeed />} />
            <Route path="groups" element={<GroupsList />} />
            <Route path="groups/:id" element={<GroupDetail />} />
            <Route path="tags/:tag" element={<AllFeed />} />
          </Route>
          <Route path="/stele/post/:id" element={<PostDetail />} />
          <Route path="/stele/new" element={<NewPost />} />
          <Route path="/aggregate" element={<Aggregate />} />
          <Route path="/index" element={<IndexPage />} />
          <Route path="/design" element={<Design />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/writeups" element={<Writeups />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </I18nProvider>
  )
}
