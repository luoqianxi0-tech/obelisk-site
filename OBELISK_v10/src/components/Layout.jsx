import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main className="pt-16 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
