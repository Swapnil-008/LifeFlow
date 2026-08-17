import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

function AppLayout() {
  return (
    <div className="min-h-screen bg-paper">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Sidebar />

      <div className="md:pl-64">
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-screen pt-16 pb-20 md:pb-0"
        >
          <div className="min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default AppLayout;
