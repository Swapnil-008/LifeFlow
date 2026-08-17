import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { moodEmoji } from '../../utils/mood';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-paper-card border border-paper-border rounded-lg shadow-card px-3 py-2 text-xs">
      <p className="font-medium text-ink">
        {new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      <p className="text-ink-muted">
        {d.mood && <span className="mr-1">{moodEmoji(d.mood)}</span>}
        Rating: {d.rating ?? '—'}
      </p>
    </div>
  );
}

function MoodTrendChart({ data }) {
  const points = (data || []).filter((d) => d.rating != null);

  if (points.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-ink-muted">
        No mood ratings yet in this period — save a daily reflection with a star rating.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={points} margin={{ top: 8, right: 8, left: -8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
          tick={{ fontSize: 11, fill: '#8A8A84' }}
          axisLine={{ stroke: '#E4E4E0' }}
          tickLine={false}
        />
        <YAxis domain={[1, 5]} tick={{ fontSize: 11, fill: '#8A8A84' }} axisLine={false} tickLine={false} width={24} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="rating" stroke="#C98A2C" strokeWidth={2.5} dot={{ r: 3, fill: '#C98A2C' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MoodTrendChart;
