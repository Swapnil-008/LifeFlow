import { formatCurrency } from '../../utils/format';

function DailyStatsRow({ stats }) {
  if (!stats) return null;

  const items = [
    { label: 'Tasks completed', value: `${stats.tasksCompleted} / ${stats.tasksTotal}` },
    { label: 'Habits completed', value: `${stats.habitsCompleted} / ${stats.habitsTotal}` },
    { label: 'Money spent', value: formatCurrency(stats.moneySpent) },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-paper rounded-xl px-3 py-2.5 text-center">
          <p className="stat-number text-lg text-ink leading-none">{item.value}</p>
          <p className="text-[11px] text-ink-muted mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default DailyStatsRow;
