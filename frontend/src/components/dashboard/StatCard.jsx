function StatCard({ label, value, icon: Icon, accent = 'brand' }) {
  const accentClasses = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
    coral: 'bg-coral-50 text-coral-600 dark:bg-coral-500/15 dark:text-coral-300',
  };

  return (
    <div className="card p-5 sm:p-6 flex items-center gap-4 min-h-[116px]">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
        <Icon size={19} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="stat-number text-2xl sm:text-[1.7rem] text-ink leading-none">{value}</p>
        <p className="text-xs sm:text-sm text-ink-muted mt-1.5 truncate">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
