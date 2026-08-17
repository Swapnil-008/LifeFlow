import { useState } from 'react';
import Modal from '../ui/Modal';

function HabitForm({ initialHabit, onSubmit, onClose }) {
  const [name, setName] = useState(initialHabit?.name || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save habit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={initialHabit ? 'Edit habit' : 'Add habit'} onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="habit-name" className="sr-only">
            Habit name
          </label>
          <input
            id="habit-name"
            name="name"
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Exercise, Read, Meditation…"
            className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
          />
        </div>
        <p className="text-xs text-ink-muted">Habits are tracked daily.</p>

        {error && (
          <p role="alert" className="text-coral-600 text-sm bg-coral-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          {submitting ? 'Saving…' : initialHabit ? 'Save changes' : 'Add habit'}
        </button>
      </form>
    </Modal>
  );
}

export default HabitForm;
