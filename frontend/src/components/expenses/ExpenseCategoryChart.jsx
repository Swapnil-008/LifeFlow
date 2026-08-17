import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { categoryColor } from '../../utils/expenseCategories';
import { formatCurrency } from '../../utils/format';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-paper-card border border-paper-border rounded-lg shadow-card px-3 py-2 text-xs">
      <p className="font-medium text-ink">{d.category}</p>
      <p className="text-ink-muted">
        {formatCurrency(d.amount)} · {d.percentage}%
      </p>
    </div>
  );
}

function ExpenseCategoryChart({ data, total }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-ink-muted">
        No expenses in this period yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-52 h-52 sm:w-56 sm:h-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" innerRadius={62} outerRadius={92} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={categoryColor(entry.category)} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="stat-number text-xl text-ink">{formatCurrency(total)}</span>
          <span className="text-[10px] text-ink-muted uppercase tracking-wide">Total</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-1.5">
        {data.map((d) => (
          <div key={d.category} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: categoryColor(d.category) }} />
              {d.category}
            </span>
            <span className="stat-number text-ink-muted">
              {formatCurrency(d.amount)} <span className="text-ink-muted/70">({d.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseCategoryChart;
