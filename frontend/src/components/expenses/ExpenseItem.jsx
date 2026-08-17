import { Trash2, Pencil } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { formatCurrency } from '../../utils/format';

function ExpenseItem({ expense, onEdit, onDelete, hideActions = false }) {
  const dateLabel = new Date(expense.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-paper-border last:border-b-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm text-ink">{expense.description || expense.category}</p>
          <CategoryBadge category={expense.category} />
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-ink-muted">
          <span>{dateLabel}</span>
          <span>·</span>
          <span>{expense.paymentMethod}</span>
        </div>
      </div>

      <span className="stat-number text-sm text-ink shrink-0">{formatCurrency(expense.amount)}</span>

      {!hideActions && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper"
            aria-label="Edit expense"
          >
            <Pencil size={14} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-500/15"
            aria-label="Delete expense"
          >
            <Trash2 size={14} strokeWidth={1.8} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpenseItem;
