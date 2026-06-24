import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import MobileNav from './MobileNav.jsx'
import LoginModal from '../auth/LoginModal.jsx'

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
      <MobileNav />
      <LoginModal />
    </div>
  )
}
