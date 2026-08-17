import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import taskService from '../../services/taskService';

const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const startOfDay = (date) => { const d = new Date(date); d.setHours(0,0,0,0); return d; };

function WeeklyOverview() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeek = useCallback(async () => {
    try {
      const data = await taskService.list({ sort: 'dueDate' });
      const today = startOfDay(new Date());
      const result = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today); date.setDate(today.getDate() - (6 - index));
        const key = date.toISOString().slice(0,10);
        const tasks = data.tasks.filter((task) => task.dueDate && new Date(task.dueDate).toISOString().slice(0,10) === key);
        const completed = tasks.filter((task) => task.status === 'completed').length;
        return { key, label: DAY_LABELS[date.getDay()], total: tasks.length, completed, rate: tasks.length ? Math.round(completed / tasks.length * 100) : 0 };
      });
      setDays(result);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWeek(); }, [fetchWeek]);
  const weekTotal = days.reduce((sum, day) => sum + day.total, 0);
  const weekCompleted = days.reduce((sum, day) => sum + day.completed, 0);
  const best = days.reduce((bestDay, day) => day.rate > (bestDay?.rate ?? -1) ? day : bestDay, null);

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div><div className="flex items-center gap-2"><BarChart3 size={16} className="text-brand-600" /><h2 className="text-sm font-semibold">Weekly overview</h2></div><p className="text-xs text-ink-muted mt-1">Tasks completed over the last 7 days.</p></div>
        <Link to="/analytics" className="text-xs font-medium text-brand-600 hover:underline">Analytics</Link>
      </div>
      {loading ? <div className="h-32 flex items-center justify-center text-xs text-ink-muted">Loading…</div> : <>
        <div className="flex items-end justify-between gap-2 h-32">
          {days.map((day) => {
            const height = day.total ? Math.max(10, day.rate) : 6;
            return <div key={day.key} className="flex-1 h-full flex flex-col items-center justify-end gap-2"><div className="w-full max-w-7 h-24 rounded-lg bg-paper flex items-end overflow-hidden"><div className={`w-full rounded-lg ${day.total ? 'bg-brand-500' : 'bg-paper-border'}`} style={{ height: `${height}%` }} title={`${day.completed}/${day.total} completed`} /></div><span className="text-[10px] text-ink-muted">{day.label}</span></div>;
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-paper-border flex items-center justify-between gap-4"><div><p className="text-xs text-ink-muted">This week</p><p className="stat-number text-lg mt-0.5">{weekCompleted} / {weekTotal} completed</p></div><div className="text-right"><p className="text-xs text-ink-muted">Best day</p><p className="text-sm font-semibold mt-0.5">{best?.label || '—'}{best && best.total ? ` · ${best.rate}%` : ''}</p></div></div>
      </>}
    </div>
  );
}
export default WeeklyOverview;
