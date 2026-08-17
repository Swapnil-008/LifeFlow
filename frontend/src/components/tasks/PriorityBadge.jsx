const STYLES = {
  high: 'bg-coral-50 text-coral-600 dark:bg-coral-500/15 dark:text-coral-300',
  medium: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  low: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
};

function PriorityBadge({ priority }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STYLES[priority] || STYLES.medium}`}>
      {priority}
    </span>
  );
}

export default PriorityBadge;
