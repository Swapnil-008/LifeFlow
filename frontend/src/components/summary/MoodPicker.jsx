import { MOODS } from '../../utils/mood';

function MoodPicker({ value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-1">
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          title={m.label}
          aria-label={m.label}
          aria-pressed={value === m.value}
          className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-colors ${
            value === m.value
              ? 'bg-brand-50 border-brand-500 dark:bg-brand-500/15'
              : 'border-transparent hover:bg-paper'
          }`}
        >
          <span className={`text-2xl transition-transform ${value === m.value ? 'scale-110' : 'opacity-60'}`}>
            {m.emoji}
          </span>
        </button>
      ))}
    </div>
  );
}

export default MoodPicker;
