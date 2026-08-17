import { useEffect, useState, useCallback } from 'react';
import { History } from 'lucide-react';
import activityService from '../../services/activityService';
import ActivityItem from './ActivityItem';

// Reusable recent-activity feed. Used on the Dashboard (compact, limit=6)
// and on the Profile page (fuller, limit=30) — same component, different
// `limit`/`title` props, matching how HabitCard is reused across pages.
function ActivityTimeline({ limit = 10, title = 'Recent Activity', emptyText = 'No activity yet.' }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await activityService.list({ limit });
      setActivities(data.activities);
    } catch {
      setError('Could not load activity.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <History size={16} strokeWidth={1.8} className="text-ink-muted" />
        <h2 className="text-sm font-medium text-ink">{title}</h2>
      </div>

      {loading ? (
        <p className="text-xs text-ink-muted py-4 text-center">Loading…</p>
      ) : error ? (
        <p className="text-xs text-coral-600 py-4 text-center">{error}</p>
      ) : activities.length === 0 ? (
        <p className="text-xs text-ink-muted py-4 text-center">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;
