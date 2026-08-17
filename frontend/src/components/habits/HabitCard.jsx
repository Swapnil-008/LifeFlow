import { Flame, Pencil, Trash2 } from 'lucide-react';
import WeekDots from './WeekDots';

function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink truncate">{habit.name}</p>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-600 dark:text-amber-400">
            <Flame size={13} strokeWidth={2} className="fill-amber-500 text-amber-500" />
            <span>{habit.currentStreak} day{habit.currentStreak === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggle(habit)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
              habit.completedToday
                ? 'bg-brand-500 border-brand-500'
                : 'border-paper-border hover:border-brand-500'
            }`}
            aria-label={habit.completedToday ? 'Mark as not done today' : 'Mark done today'}
          >
            {habit.completedToday && (
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onEdit(habit)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper"
            aria-label="Edit habit"
          >
            <Pencil size={14} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => onDelete(habit)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-500/15"
            aria-label="Delete habit"
          >
            <Trash2 size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <WeekDots completedDates={habit.completedDates} />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-paper-border text-xs text-ink-muted">
        <span>Best streak: <span className="text-ink font-medium">{habit.longestStreak}</span></span>
        <span>This week: <span className="text-ink font-medium">{habit.weeklyRate}%</span></span>
      </div>
    </div>
  );
}

export default HabitCard;
