import { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, Flame } from 'lucide-react';
import habitService from '../services/habitService';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Spinner from '../components/ui/Spinner';
import { toDateKey } from '../utils/mood';
import { useToast } from '../context/ToastContext';

function Habits() {
  const { show } = useToast();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const hasLoadedOnce = useRef(false);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitService.list();
      setHabits(data.habits);
    } catch {
      setError('Could not load habits. Check that the backend is running.');
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleToggle = async (habit) => {
    const todayKey = toDateKey(new Date());
    const willComplete = !habit.completedToday;
    // Optimistic update so the checkbox feels instant.
    setHabits((prev) => prev.map((h) => (h._id === habit._id ? { ...h, completedToday: willComplete } : h)));
    try {
      const data = await habitService.toggleComplete(habit._id, todayKey);
      setHabits((prev) => prev.map((h) => (h._id === habit._id ? data.habit : h)));
      if (willComplete) show(`"${habit.name}" checked off for today`);
    } catch {
      fetchHabits(); // roll back to server truth on failure
      show('Could not update that habit', { type: 'error' });
    }
  };

  const handleDelete = async (habit) => {
    if (!window.confirm(`Delete "${habit.name}"?`)) return;
    setHabits((prev) => prev.filter((h) => h._id !== habit._id));
    try {
      await habitService.remove(habit._id);
      show('Habit deleted');
    } catch {
      fetchHabits();
      show('Could not delete that habit', { type: 'error' });
    }
  };

  const handleFormSubmit = async (payload) => {
    if (editingHabit) {
      await habitService.update(editingHabit._id, payload);
      show('Habit updated');
    } else {
      await habitService.create(payload);
      show('Habit added');
    }
    await fetchHabits();
  };

  const openCreate = () => {
    setEditingHabit(null);
    setFormOpen(true);
  };
  const openEdit = (habit) => {
    setEditingHabit(habit);
    setFormOpen(true);
  };

  const showSpinner = loading && !hasLoadedOnce.current;

  return (
    <div className="page-shell animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Habits</h1><p className="page-subtitle">Build consistency one small action at a time.</p></div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 min-h-10 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 sm:px-5 py-2.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2} />
          Add Habit
        </button>
      </div>

      {showSpinner ? (
        <div className="card p-10 flex items-center justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <div className="card">
          <ErrorState message={error} onRetry={fetchHabits} />
        </div>
      ) : habits.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Flame}
            title="No habits yet."
            description="Add something you want to do every day — exercise, reading, meditation."
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {habits.map((habit) => (
            <HabitCard key={habit._id} habit={habit} onToggle={handleToggle} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {formOpen && (
        <HabitForm initialHabit={editingHabit} onSubmit={handleFormSubmit} onClose={() => setFormOpen(false)} />
      )}
    </div>
  );
}

export default Habits;
