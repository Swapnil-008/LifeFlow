import { Star } from 'lucide-react';

function RatingStars({ value, onChange, readOnly = false, size = 22 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
        >
          <Star
            size={size}
            strokeWidth={1.8}
            className={n <= (value || 0) ? 'fill-amber-500 text-amber-500' : 'fill-none text-paper-border'}
          />
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
