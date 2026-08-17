import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Flame, Wallet, User } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'Today', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/expenses', label: 'Money', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 h-[4.25rem] bg-paper-card/95 backdrop-blur-md border-t border-paper-border flex items-center justify-around z-50 px-2">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors ${
              isActive ? 'text-brand-600 bg-brand-50 dark:bg-brand-500/10' : 'text-ink-muted'
            }`
          }
        >
          <Icon size={19} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileNav;
