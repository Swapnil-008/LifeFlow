import { WEEKDAY_LABELS, currentWeekKeys, completedKeySet } from '../../utils/habit';
import { toDateKey } from '../../utils/mood';

function WeekDots({ completedDates }) {
  const weekKeys = currentWeekKeys();
  const done = completedKeySet(completedDates);
  const todayKey = toDateKey(new Date());

  return (
    <div className="flex items-center gap-2">
      {weekKeys.map((key, i) => {
        const isDone = done.has(key);
        const isFuture = key > todayKey;
        const isToday = key === todayKey;
        return (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-ink-muted">{WEEKDAY_LABELS[i]}</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDone
                  ? 'bg-brand-500'
                  : isFuture
                    ? 'bg-paper-border/50'
                    : isToday
                      ? 'border-2 border-brand-500'
                      : 'bg-paper-border'
              }`}
              title={key}
            />
          </div>
        );
      })}
    </div>
  );
}

export default WeekDots;
