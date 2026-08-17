import { useState } from 'react';
import Modal from '../ui/Modal';

const CATEGORIES = ['Work', 'Study', 'Personal', 'Health', 'Errands', 'Other'];
const PRIORITIES = ['low', 'medium', 'high'];

const emptyForm = {
  title: '',
  description: '',
  category: 'Other',
  priority: 'medium',
  dueDate: '',
  startTime: '',
  endTime: '',
};

function TaskForm({ initialTask, onSubmit, onClose }) {
  const [form, setForm] = useState(
    initialTask
      ? {
          title: initialTask.title || '',
          description: initialTask.description || '',
          category: initialTask.category || 'Other',
          priority: initialTask.priority || 'medium',
          dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : '',
          startTime: initialTask.startTime || '',
          endTime: initialTask.endTime || '',
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate || null,
        startTime: form.startTime || null,
        endTime: form.endTime || null,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={initialTask ? 'Edit task' : 'Add task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="task-title" className="sr-only">
            Task title
          </label>
          <input
            id="task-title"
            name="title"
            required
            autoFocus
            value={form.title}
            onChange={handleChange}
            placeholder="What do you need to do?"
            className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label htmlFor="task-description" className="sr-only">
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-category" className="block text-xs font-medium mb-1 text-ink-soft">
              Category
            </label>
            <select
              id="task-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-priority" className="block text-xs font-medium mb-1 text-ink-soft">
              Priority
            </label>
            <select
              id="task-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p[0].toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="task-dueDate" className="block text-xs font-medium mb-1 text-ink-soft">
              Due date
            </label>
            <input
              id="task-dueDate"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label htmlFor="task-startTime" className="block text-xs font-medium mb-1 text-ink-soft">
              Start
            </label>
            <input
              id="task-startTime"
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label htmlFor="task-endTime" className="block text-xs font-medium mb-1 text-ink-soft">
              End
            </label>
            <input
              id="task-endTime"
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-paper-border bg-paper focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            />
          </div>
        </div>

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
          {submitting ? 'Saving…' : initialTask ? 'Save changes' : 'Add task'}
        </button>
      </form>
    </Modal>
  );
}

export default TaskForm;
