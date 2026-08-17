import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Sun, Moon, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');

const TITLES = {
  '/': 'Dashboard',
  '/tasks': 'Tasks',
  '/habits': 'Habits',
  '/expenses': 'Expenses',
  '/summary': 'Daily Summary',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
};

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const title = TITLES[location.pathname] || 'DailyLife';

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-50 h-16 border-b border-paper-border bg-paper-card/95 backdrop-blur-md">
      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 rounded-xl px-2.5 py-2 -ml-2.5 hover:bg-paper transition-colors group" title="Go to dashboard" aria-label="Go to dashboard">
          <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 flex items-center justify-center">
            <LayoutDashboard size={17} strokeWidth={1.9} />
          </span>
          <span className="hidden sm:block text-sm font-semibold text-ink group-hover:text-brand-600 transition-colors">{title}</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-xl text-ink-soft hover:bg-paper hover:text-ink flex items-center justify-center transition-colors" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          </button>

          <Link to="/profile" className="flex items-center gap-2.5 ml-1 px-2 py-1.5 rounded-xl hover:bg-paper transition-colors group min-w-0" title="Go to profile">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 border border-paper-border" />
            ) : (
              <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 flex items-center justify-center text-xs font-semibold shrink-0">{initials(user?.name) || '?'}</span>
            )}
            <span className="hidden sm:block min-w-0 max-w-[180px]">
              <span className="block text-sm font-semibold leading-tight truncate group-hover:text-brand-600 transition-colors">{user?.name || 'User'}</span>
              <span className="block text-xs text-ink-muted leading-tight truncate mt-0.5">{user?.email || ''}</span>
            </span>
            <ChevronRight className="hidden lg:block text-ink-muted group-hover:text-brand-600" size={15} />
          </Link>

          <button onClick={logout} className="w-10 h-10 rounded-xl text-ink-soft hover:bg-coral-50 hover:text-coral-600 dark:hover:bg-coral-500/10 flex items-center justify-center transition-colors" title="Log out" aria-label="Log out">
            <LogOut size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
