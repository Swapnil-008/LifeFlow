import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import summaryService from '../../services/summaryService';
import RatingStars from '../summary/RatingStars';
import { toDateKey, moodEmoji } from '../../utils/mood';

function DailySummaryCard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchToday = useCallback(async () => {
    try {
      const data = await summaryService.getByDate(toDateKey(new Date()));
      setSummary(data.summary);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  if (loading) return null;

  return (
    <Link
      to="/summary"
      className="card p-4 flex items-center justify-between gap-3 hover:shadow-card-hover transition-shadow"
    >
      {summary ? (
        <>
          <div className="flex items-center gap-2.5">
            {summary.mood && <span className="text-2xl">{moodEmoji(summary.mood)}</span>}
            <div>
              <p className="text-sm text-ink">Today's reflection saved</p>
              <p className="text-xs text-ink-muted">Tap to edit</p>
            </div>
          </div>
          {summary.rating && <RatingStars value={summary.rating} readOnly size={14} />}
        </>
      ) : (
        <>
          <div>
            <p className="text-sm text-ink">How was your day?</p>
            <p className="text-xs text-ink-muted">Write your daily reflection</p>
          </div>
          <span className="text-xs font-medium text-brand-600 shrink-0">+ Daily Summary</span>
        </>
      )}
    </Link>
  );
}

export default DailySummaryCard;
