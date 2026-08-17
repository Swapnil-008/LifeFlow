import { useEffect, useState, useCallback } from 'react';
import { Activity, Flame, CalendarDays } from 'lucide-react';
import activityService from '../../services/activityService';

const LEVEL_CLASSES = ['bg-paper-border', 'bg-brand-100', 'bg-brand-300', 'bg-brand-500', 'bg-brand-700'];
const levelFor = (count) => count <= 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function ActivityHeatmap({ weeks = 18, title = 'Activity overview' }) {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const days = weeks * 7;

  const fetchHeatmap = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await activityService.heatmap(days);
      setCells(data.heatmap);
    } catch { setError('Could not load activity heatmap.'); }
    finally { setLoading(false); }
  }, [days]);

  useEffect(() => { fetchHeatmap(); }, [fetchHeatmap]);

  if (loading) return <div className="card p-8 text-center text-ink-muted text-sm">Loading activity…</div>;
  if (error) return <div className="card p-8 text-center text-coral-600 text-sm">{error}</div>;
  if (cells.length === 0) return null;

  const firstDay = new Date(`${cells[0].date}T00:00:00.000Z`).getUTCDay();
  const padded = [...Array(firstDay).fill(null), ...cells];
  const totalCols = Math.ceil(padded.length / 7);
  const gridWeeks = Array.from({ length: totalCols }, (_, col) => padded.slice(col * 7, col * 7 + 7));
  let lastMonth = null;
  const monthLabels = gridWeeks.map((week) => {
    const firstReal = week.find(Boolean);
    if (!firstReal) return '';
    const month = new Date(`${firstReal.date}T00:00:00.000Z`).getUTCMonth();
    if (month === lastMonth) return '';
    lastMonth = month;
    return MONTH_LABELS[month];
  });

  const totalActivities = cells.reduce((sum, cell) => sum + cell.count, 0);
  const activeDays = cells.filter((cell) => cell.count > 0).length;
  const bestDay = cells.reduce((best, cell) => (cell.count > (best?.count || 0) ? cell : best), null);
  const average = activeDays ? (totalActivities / activeDays).toFixed(1) : '0';

  return (
    <div className="card overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-paper-border">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300 flex items-center justify-center shrink-0"><Activity size={19} strokeWidth={1.9} /></div>
            <div><h2 className="text-base font-semibold text-ink">{title}</h2><p className="text-xs text-ink-muted mt-1">Your consistency across the last {weeks} weeks.</p></div>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-muted"><CalendarDays size={14} /><span>{activeDays} active days</span></div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="rounded-xl bg-paper px-3 py-2.5"><p className="text-[10px] uppercase tracking-wide text-ink-muted">Activities</p><p className="stat-number text-lg mt-1">{totalActivities}</p></div>
          <div className="rounded-xl bg-paper px-3 py-2.5"><p className="text-[10px] uppercase tracking-wide text-ink-muted">Active days</p><p className="stat-number text-lg mt-1">{activeDays}</p></div>
          <div className="rounded-xl bg-paper px-3 py-2.5"><p className="text-[10px] uppercase tracking-wide text-ink-muted">Best day</p><p className="stat-number text-lg mt-1">{bestDay?.count || 0}</p></div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3"><span className="text-xs text-ink-muted">Daily activity intensity</span><span className="text-xs font-medium text-ink-soft">{average} avg. on active days</span></div>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-2 min-w-full">
            <div className="flex gap-1.5">{monthLabels.map((label, i) => <div key={i} className="w-3 text-[9px] text-ink-muted leading-none">{label}</div>)}</div>
            <div className="flex gap-1.5">{gridWeeks.map((week, wi) => <div key={wi} className="flex flex-col gap-1.5">{week.map((cell, di) => <div key={di} className={`w-3 h-3 rounded-[3px] transition-transform hover:scale-125 ${cell ? LEVEL_CLASSES[levelFor(cell.count)] : 'bg-transparent'}`} title={cell ? `${cell.date}: ${cell.count} activit${cell.count === 1 ? 'y' : 'ies'}` : undefined} />)}</div>)}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-paper-border">
          <div className="flex items-center gap-2 text-xs text-ink-muted"><Flame size={13} className="text-amber-500" /><span>{bestDay ? `${bestDay.date} was your most active day` : 'Keep building your streak'}</span></div>
          <div className="flex items-center gap-1.5"><span className="text-[10px] text-ink-muted">Less</span>{LEVEL_CLASSES.map((cls, i) => <div key={i} className={`w-3 h-3 rounded-[3px] ${cls}`} />)}<span className="text-[10px] text-ink-muted">More</span></div>
        </div>
      </div>
    </div>
  );
}
export default ActivityHeatmap;
