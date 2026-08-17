import { useEffect, useState, useCallback } from 'react';
import { CheckSquare, Wallet, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import expenseService from '../services/expenseService';
import habitService from '../services/habitService';
import TodayTasks from '../components/dashboard/TodayTasks';
import TodayExpenses from '../components/dashboard/TodayExpenses';
import TodayHabits from '../components/dashboard/TodayHabits';
import StatCard from '../components/dashboard/StatCard';
import DailySummaryCard from '../components/dashboard/DailySummaryCard';
import ActivityHeatmap from '../components/activity/ActivityHeatmap';
import ActivityTimeline from '../components/activity/ActivityTimeline';
import WeeklyOverview from '../components/dashboard/WeeklyOverview';
import GoalsProgress from '../components/dashboard/GoalsProgress';
import { formatCurrency } from '../utils/format';

function Dashboard() {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState(null);
  const [expenseTotal, setExpenseTotal] = useState(null);
  const [habitStats, setHabitStats] = useState(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Lightweight fetch just for the quick-stats row — the widgets below fetch
  // their own (richer) data independently, so this stays a simple count.
  const fetchQuickStats = useCallback(async () => {
    const [tasks, expenses, habits] = await Promise.all([
      taskService.list({ view: 'today' }),
      expenseService.list({ view: 'today' }),
      habitService.list(),
    ]);
    const done = tasks.tasks.filter((t) => t.status === 'completed').length;
    setTaskStats({ done, total: tasks.tasks.length });
    setExpenseTotal(expenses.total);
    setHabitStats({
      done: habits.habits.filter((h) => h.completedToday).length,
      total: habits.habits.length,
    });
  }, []);

  useEffect(() => {
    fetchQuickStats();
  }, [fetchQuickStats]);

  return (
    <div className="page-shell animate-fade-in">
      <div className="mb-8 lg:mb-9 rounded-3xl border border-paper-border bg-paper-card p-6 sm:p-7 lg:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 mb-2">
              Your daily workspace
            </p>
            <h1 className="font-display text-3xl md:text-4xl leading-tight">
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-ink-muted text-sm mt-2">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-sm text-ink-soft max-w-sm sm:text-right">
            Keep the important things visible: what you need to do, what you spent,
            and how the day is going.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-8">
        <StatCard
          label="Tasks today"
          value={taskStats ? `${taskStats.done} / ${taskStats.total}` : '—'}
          icon={CheckSquare}
          accent="brand"
        />
        <StatCard
          label="Habits today"
          value={habitStats ? `${habitStats.done} / ${habitStats.total}` : '—'}
          icon={Flame}
          accent="amber"
        />
        <StatCard
          label="Spent today"
          value={expenseTotal !== null ? formatCurrency(expenseTotal) : '—'}
          icon={Wallet}
          accent="coral"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-5 lg:gap-6 mb-6">
        <div className="lg:col-span-7"><TodayTasks /></div>
        <div className="lg:col-span-5 space-y-5"><WeeklyOverview /><GoalsProgress /></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 lg:gap-6 mb-6">
        <div className="lg:col-span-7"><TodayHabits /></div>
        <div className="lg:col-span-5"><TodayExpenses /></div>
      </div>

      <div className="mb-6 lg:mb-7"><DailySummaryCard /></div>

      <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
        <div className="lg:col-span-8"><ActivityHeatmap weeks={18} title="Activity overview" /></div>
        <div className="lg:col-span-4"><ActivityTimeline limit={6} /></div>
      </div>
    </div>
  );
}

export default Dashboard;
