import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

function HabitConsistencyChart({ data = [] }) {
  const hasData = data.some((d) => d.possible > 0);

  if (!hasData) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-ink-muted text-center px-6">
        Create a daily habit and check it off to build your consistency trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
        <defs>
          <linearGradient id="habitFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F6F5C" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#1F6F5C" stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tick={{ fontSize: 11, fill: '#8A8A84' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-paper-card border border-paper-border rounded-xl shadow-card px-3.5 py-3 text-xs">
                <p className="font-semibold text-ink mb-1">{formatDate(label)}</p>
                <p className="text-brand-600">{payload[0].value}% consistency</p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="#1F6F5C"
          strokeWidth={2.5}
          fill="url(#habitFill)"
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default HabitConsistencyChart;
