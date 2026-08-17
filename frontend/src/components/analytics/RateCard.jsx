function RateCard({ label, rate, detail, accent = 'brand' }) {
  const accentClasses = {
    brand: 'text-brand-600',
    amber: 'text-amber-600',
    coral: 'text-coral-600',
  };

  return (
    <div className="card p-4">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`stat-number text-3xl mt-1 ${accentClasses[accent]}`}>{rate}%</p>
      {detail && <p className="text-xs text-ink-muted mt-1">{detail}</p>}
    </div>
  );
}

export default RateCard;
