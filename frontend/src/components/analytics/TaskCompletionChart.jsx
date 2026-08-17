import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

function TaskCompletionChart({ data = [] }) {
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-ink-muted text-center px-6">
        Add tasks with due dates to see your completion pattern here.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#E4E4E0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: '#8A8A84' }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#8A8A84' }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0].payload;
            return (
              <div className="bg-paper-card border border-paper-border rounded-xl shadow-card px-3.5 py-3 text-xs">
                <p className="font-semibold text-ink mb-1">{formatDate(label)}</p>
                <p className="text-brand-600">{point.completed} completed</p>
                <p className="text-ink-muted">{point.total} planned</p>
              </div>
            );
          }}
        />
        <Bar dataKey="completed" name="Completed" fill="#1F6F5C" radius={[5, 5, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TaskCompletionChart;
