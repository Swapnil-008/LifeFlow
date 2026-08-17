import { Link, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Wallet,
  NotebookPen,
  BarChart3,
  User,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/expenses', label: 'Expenses', icon: Wallet },
  { to: '/summary', label: 'Daily Summary', icon: NotebookPen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function Sidebar() {
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-paper-border bg-paper-card">
      <Link
        to="/"
        className="flex items-center gap-3 px-6 h-[4.5rem] border-b border-paper-border shrink-0 hover:bg-paper transition-colors"
      >
        <span className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-display text-lg shadow-sm">
          D
        </span>
        <span>
          <span className="block font-display text-xl leading-none">DailyLife</span>
          <span className="block text-[10px] text-ink-muted uppercase tracking-[0.16em] mt-1">
            Personal workspace
          </span>
        </span>
      </Link>

      <div className="px-5 pt-5 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        Workspace
      </div>

      <nav className="flex-1 overflow-y-auto px-3.5 pb-6 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-ink-soft hover:bg-paper hover:text-ink'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-paper-border shrink-0">
        <p className="text-[11px] text-ink-muted leading-relaxed">
          Track your work, habits, spending and how your day went.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
