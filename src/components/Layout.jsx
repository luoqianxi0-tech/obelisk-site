import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-obelisk-bg">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
