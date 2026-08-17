import { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import taskService from '../services/taskService';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import SkeletonRows from '../components/ui/SkeletonRows';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { useToast } from '../context/ToastContext';

const VIEWS = [
  { value: '', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

function Tasks() {
  const { show } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const hasLoadedOnce = useRef(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort };
      if (view) params.view = view;
      if (search) params.search = search;
      const data = await taskService.list(params);
      setTasks(data.tasks);
    } catch {
      setError('Could not load tasks. Check that the backend is running.');
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }, [view, search, sort]);

  useEffect(() => {
    const timeout = setTimeout(fetchTasks, search ? 300 : 0); // debounce search only
    return () => clearTimeout(timeout);
  }, [fetchTasks, search]);

  const handleToggle = async (task) => {
    const willComplete = task.status !== 'completed';
    // Optimistic update so the checkbox feels instant
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? { ...t, status: willComplete ? 'completed' : 'pending', progress: willComplete ? 100 : 0 }
          : t
      )
    );
    try {
      await taskService.toggleComplete(task._id);
      if (willComplete) show(`"${task.title}" completed`);
    } catch {
      fetchTasks(); // roll back to server truth on failure
      show('Could not update that task', { type: 'error' });
    }
  };

  const handleProgress = async (task, progress) => {
    const nextStatus = progress >= 100 ? 'completed' : 'pending';
    setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, progress, status: nextStatus } : t));
    try {
      const data = await taskService.updateProgress(task._id, progress);
      setTasks((prev) => prev.map((t) => t._id === task._id ? data.task : t));
      if (progress >= 100) show(`"${task.title}" completed`);
    } catch {
      fetchTasks();
      show('Could not update task progress', { type: 'error' });
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
    try {
      await taskService.remove(task._id);
      show('Task deleted');
    } catch {
      fetchTasks();
      show('Could not delete that task', { type: 'error' });
    }
  };

  const handleFormSubmit = async (payload) => {
    if (editingTask) {
      await taskService.update(editingTask._id, payload);
      show('Task updated');
    } else {
      await taskService.create(payload);
      show('Task added');
    }
    await fetchTasks();
  };

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };
  const openEdit = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  // Only show the full skeleton on the very first load. Subsequent
  // filter/search/sort changes keep the current list visible (slightly
  // dimmed) instead of flashing a blank skeleton on every keystroke.
  const showSkeleton = loading && !hasLoadedOnce.current;

  return (
    <div className="page-shell animate-fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Tasks</h1><p className="page-subtitle">Plan your work and keep today moving.</p></div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 min-h-10 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 sm:px-5 py-2.5 rounded-xl transition-colors active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2} />
          Add Task
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div role="group" aria-label="Filter tasks by view" className="tab-list w-full lg:w-fit overflow-x-auto">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              aria-pressed={view === v.value}
              className={`tab-button ${
                view === v.value ? 'tab-button-active' : 'tab-button-idle'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="task-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks…"
          className="flex-1 min-h-10 px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper-card focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
        />

        <label htmlFor="task-sort" className="sr-only">
          Sort tasks
        </label>
        <select
          id="task-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="min-h-10 px-3.5 py-2.5 rounded-xl border border-paper-border bg-paper-card focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
        >
          <option value="-createdAt">Newest first</option>
          <option value="dueDate">Due date ↑</option>
          <option value="-priority">Priority high→low</option>
        </select>
      </div>

      <div className={`card overflow-hidden transition-opacity duration-150 ${loading && hasLoadedOnce.current ? 'opacity-60' : 'opacity-100'}`}>
        {showSkeleton ? (
          <SkeletonRows count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTasks} />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks yet."
            description="Add something you want to accomplish today."
          />
        ) : (
          tasks.map((task) => (
            <TaskItem key={task._id} task={task} onToggle={handleToggle} onProgress={handleProgress} onEdit={openEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      {formOpen && (
        <TaskForm initialTask={editingTask} onSubmit={handleFormSubmit} onClose={() => setFormOpen(false)} />
      )}
    </div>
  );
}

export default Tasks;
