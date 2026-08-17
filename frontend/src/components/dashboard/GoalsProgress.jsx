import { useEffect, useState, useCallback } from 'react';
import { Target } from 'lucide-react';
import taskService from '../../services/taskService';

function GoalsProgress() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    try {
      const data = await taskService.list({ sort: '-createdAt' });
      const grouped = data.tasks.reduce((map, task) => {
        const category = task.category || 'Other';
        if (!map[category]) map[category] = { category, total: 0, progress: 0, completed: 0 };
        map[category].total += 1;
        map[category].progress += task.status === 'completed' ? 100 : Number(task.progress || 0);
        if (task.status === 'completed') map[category].completed += 1;
        return map;
      }, {});
      setGoals(Object.values(grouped).map((item) => ({ ...item, rate: Math.round(item.progress / item.total) })).sort((a,b) => b.rate-a.rate).slice(0,4));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5"><div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300 flex items-center justify-center"><Target size={16} /></div><div><h2 className="text-sm font-semibold">Goals progress</h2><p className="text-xs text-ink-muted mt-1">Progress across your task categories.</p></div></div>
      {loading ? <div className="h-32 flex items-center justify-center text-xs text-ink-muted">Loading…</div> : goals.length === 0 ? <div className="rounded-xl bg-paper p-5 text-center text-xs text-ink-muted">Add tasks to see progress here.</div> : <div className="space-y-4">{goals.map((goal) => <div key={goal.category}><div className="flex items-center justify-between gap-3 mb-1.5"><span className="text-xs font-medium text-ink">{goal.category}</span><span className="text-[11px] font-semibold text-ink-soft">{goal.rate}%</span></div><div className="h-2 rounded-full bg-paper-border overflow-hidden"><div className="h-full rounded-full bg-brand-500" style={{ width: `${goal.rate}%` }} /></div><p className="text-[10px] text-ink-muted mt-1">{goal.completed} of {goal.total} tasks complete</p></div>)}</div>}
    </div>
  );
}
export default GoalsProgress;
