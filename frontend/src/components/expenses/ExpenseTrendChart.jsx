import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/format';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-paper-card border border-paper-border rounded-lg shadow-card px-3 py-2 text-xs">
      <p className="font-medium text-ink">
        {new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      <p className="text-ink-muted">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

function ExpenseTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-ink-muted">
        No spending trend yet — add an expense to see it here.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
          tick={{ fontSize: 11, fill: '#8A8A84' }}
          axisLine={{ stroke: '#E4E4E0' }}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11, fill: '#8A8A84' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#EAF4F1' }} />
        <Bar dataKey="amount" fill="#1F6F5C" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ExpenseTrendChart;
