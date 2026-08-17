import { CheckSquare, Flame, Wallet, NotebookPen } from 'lucide-react';

// Maps an Activity.type to how it's rendered — icon, accent color (matches
// the same accent tokens used by StatCard/HabitCard elsewhere), and a
// short fallback label if a title is ever missing.
export const ACTIVITY_META = {
  task_completed: { icon: CheckSquare, accent: 'brand', label: 'Task completed' },
  habit_completed: { icon: Flame, accent: 'amber', label: 'Habit completed' },
  expense_created: { icon: Wallet, accent: 'coral', label: 'Expense logged' },
  summary_created: { icon: NotebookPen, accent: 'brand', label: 'Daily reflection' },
};

export const activityMeta = (type) => ACTIVITY_META[type] || { icon: CheckSquare, accent: 'brand', label: 'Activity' };

// Short relative time ("2m ago", "5h ago", "3d ago") without pulling in a
// full date-fns formatter — activity timestamps are always recent/local.
export const relativeTime = (dateInput) => {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
