import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, Flame, Wallet, Smile, Activity, TrendingUp } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import RateCard from '../components/analytics/RateCard';
import MoodTrendChart from '../components/analytics/MoodTrendChart';
import TaskCompletionChart from '../components/analytics/TaskCompletionChart';
import HabitConsistencyChart from '../components/analytics/HabitConsistencyChart';
import ExpenseTrendChart from '../components/expenses/ExpenseTrendChart';
import ExpenseCategoryChart from '../components/expenses/ExpenseCategoryChart';
import ActivityHeatmap from '../components/activity/ActivityHeatmap';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import { formatCurrency } from '../utils/format';

const PERIODS = [
  { value: 'week', label: '7 days' },
  { value: 'month', label: 'This month' },
  { value: 'year', label: 'This year' },
];

const KpiCard = ({ icon: Icon, label, value, detail, tone = 'brand' }) => {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
    coral: 'bg-coral-50 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300',
    neutral: 'bg-paper text-ink-soft',
  };

  return (
    <div className="card p-5 sm:p-6 min-h-[132px] flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon size={18} strokeWidth={1.9} />
        </span>
        <TrendingUp size={16} className="text-ink-muted/60" />
      </div>
      <div className="mt-5">
        <p className="text-xs font-medium text-ink-muted">{label}</p>
        <p className="stat-number text-2xl sm:text-3xl mt-1">{value}</p>
        {detail && <p className="text-xs text-ink-muted mt-1.5">{detail}</p>}
      </div>
    </div>
  );
};

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-xs text-ink-muted mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Analytics() {
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.overview(period);
      setData(res);
    } catch {
      setError('Could not load analytics. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return (
    <div className="page-shell animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            A clear picture of your productivity, habits, spending and mood.
          </p>
        </div>

        <div className="tab-list overflow-x-auto max-w-full" role="group" aria-label="Analytics time period">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              aria-pressed={period === p.value}
              className={`tab-button ${period === p.value ? 'tab-button-active' : 'tab-button-idle'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="section-card min-h-[360px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="card">
          <ErrorState message={error} onRetry={fetchOverview} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
            <KpiCard
              icon={CheckCircle2}
              label="Task completion"
              value={`${data.tasks.completionRate}%`}
              detail={`${data.tasks.completed} of ${data.tasks.total} planned`}
              tone="brand"
            />
            <KpiCard
              icon={Flame}
              label="Habit consistency"
              value={`${data.habits.consistencyRate}%`}
              detail={`${data.habits.activeHabits} active habit${data.habits.activeHabits === 1 ? '' : 's'}`}
              tone="amber"
            />
            <KpiCard
              icon={Wallet}
              label="Total spending"
              value={formatCurrency(data.expenses.total)}
              detail={`${data.expenses.byCategory?.length || 0} spending categories`}
              tone="coral"
            />
            <KpiCard
              icon={Smile}
              label="Average mood"
              value={data.mood.averageRating ?? '—'}
              detail={`${data.mood.entriesLogged} reflection${data.mood.entriesLogged === 1 ? '' : 's'} logged`}
              tone="neutral"
            />
          </div>

          <div className="grid xl:grid-cols-5 gap-5 lg:gap-6">
            <ChartCard
              title="Spending trend"
              subtitle="How much you spent over the selected period."
              className="xl:col-span-3"
            >
              <ExpenseTrendChart data={data.expenses.trend} />
            </ChartCard>

            <ChartCard
              title="Where your money goes"
              subtitle="Category breakdown for the same period."
              className="xl:col-span-2"
            >
              <ExpenseCategoryChart data={data.expenses.byCategory} total={data.expenses.total} />
            </ChartCard>
          </div>

          <div className="grid xl:grid-cols-2 gap-5 lg:gap-6">
            <ChartCard
              title="Task completion"
              subtitle="Completed tasks compared with planned tasks each day."
            >
              <TaskCompletionChart data={data.tasks.trend} />
            </ChartCard>

            <ChartCard
              title="Habit consistency"
              subtitle="The percentage of active daily habits completed each day."
            >
              <HabitConsistencyChart data={data.habits.trend} />
            </ChartCard>
          </div>

          <div className="grid xl:grid-cols-2 gap-5 lg:gap-6">
            <ChartCard
              title="Mood trend"
              subtitle="Your daily reflection ratings across the selected period."
            >
              <MoodTrendChart data={data.mood.trend} />
            </ChartCard>

            <ChartCard
              title="Progress snapshot"
              subtitle="A few useful signals from your activity."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <RateCard
                  label="Task completion"
                  rate={data.tasks.completionRate}
                  detail={`${data.tasks.completed} completed`}
                  accent="brand"
                />
                <RateCard
                  label="Habit consistency"
                  rate={data.habits.consistencyRate}
                  detail={`${data.habits.completions} check-ins`}
                  accent="amber"
                />
                <div className="card p-4">
                  <p className="text-xs text-ink-muted">Active days</p>
                  <p className="stat-number text-3xl mt-1 text-brand-600">
                    {data.activity?.activeDays ?? 0}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    of {data.activity?.periodDays ?? 0} days
                  </p>
                </div>
                <div className="card p-4">
                  <p className="text-xs text-ink-muted">Reflections</p>
                  <p className="stat-number text-3xl mt-1 text-ink">
                    {data.mood.entriesLogged}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">days logged</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 p-4">
                <div className="flex items-start gap-3">
                  <Activity className="text-brand-600 mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                      Keep the streak alive
                    </p>
                    <p className="text-xs text-brand-700/70 dark:text-brand-300/70 mt-1 leading-relaxed">
                      Small daily actions compound. Use the dashboard each morning and
                      your daily summary at night to keep the loop consistent.
                    </p>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          <ActivityHeatmap weeks={period === 'year' ? 53 : period === 'week' ? 8 : 18} title="Activity overview" />
        </div>
      )}
    </div>
  );
}

export default Analytics;
