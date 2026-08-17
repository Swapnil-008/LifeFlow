import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import habitService from '../../services/habitService';
import { toDateKey } from '../../utils/mood';

function TodayHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    try {
      const data = await habitService.list();
      setHabits(data.habits);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleToggle = async (habit) => {
    const todayKey = toDateKey(new Date());
    setHabits((prev) => prev.map((h) => (h._id === habit._id ? { ...h, completedToday: !h.completedToday } : h)));
    try {
      const data = await habitService.toggleComplete(habit._id, todayKey);
      setHabits((prev) => prev.map((h) => (h._id === habit._id ? data.habit : h)));
    } catch {
      fetchHabits();
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-paper-border">
        <h2 className="font-medium text-sm">Today's Habits</h2>
        <Link to="/habits" className="text-xs text-brand-600 font-medium hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="p-6 text-center text-ink-muted text-sm">Loading…</div>
      ) : habits.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-ink-soft text-sm">No habits yet.</p>
          <p className="text-ink-muted text-xs mt-1">Add something you want to do every day.</p>
          <Link to="/habits" className="inline-block mt-3 text-xs font-medium text-brand-600 hover:underline">
            + Add Habit
          </Link>
        </div>
      ) : (
        habits.slice(0, 6).map((habit) => (
          <div
            key={habit._id}
            className="flex items-center gap-3 px-5 py-3.5 border-b border-paper-border last:border-b-0"
          >
            <button
              onClick={() => handleToggle(habit)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                habit.completedToday ? 'bg-brand-500 border-brand-500' : 'border-paper-border hover:border-brand-500'
              }`}
              aria-label={habit.completedToday ? 'Mark as not done' : 'Mark as done'}
            >
              {habit.completedToday && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <p className={`flex-1 text-sm min-w-0 truncate ${habit.completedToday ? 'text-ink-muted line-through' : 'text-ink'}`}>
              {habit.name}
            </p>
            {habit.currentStreak > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-amber-600 shrink-0">
                <Flame size={12} strokeWidth={2} className="fill-amber-500 text-amber-500" />
                {habit.currentStreak}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TodayHabits;
