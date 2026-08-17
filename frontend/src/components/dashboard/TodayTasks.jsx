import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import taskService from '../../services/taskService';
import TaskItem from '../tasks/TaskItem';

function TodayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskService.list({ view: 'today', sort: '-priority' });
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggle = async (task) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed', progress: t.status === 'completed' ? 0 : 100 }
          : t))
    );
    try {
      await taskService.toggleComplete(task._id);
    } catch {
      fetchTasks();
    }
  };

  const handleProgress = async (task, progress) => {
    const nextStatus = progress >= 100 ? 'completed' : 'pending';
    setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, progress, status: nextStatus } : t));
    try {
      const data = await taskService.update(task._id, { progress });
      setTasks((prev) => prev.map((t) => t._id === task._id ? data.task : t));
    } catch {
      fetchTasks();
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-paper-border">
        <h2 className="font-medium text-sm">Today's Tasks</h2>
        <Link to="/tasks" className="text-xs text-brand-600 font-medium hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="p-6 text-center text-ink-muted text-sm">Loading…</div>
      ) : tasks.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-ink-soft text-sm">No tasks yet.</p>
          <p className="text-ink-muted text-xs mt-1">
            Add something you want to accomplish today.
          </p>
          <Link
            to="/tasks"
            className="inline-block mt-3 text-xs font-medium text-brand-600 hover:underline"
          >
            + Add Task
          </Link>
        </div>
      ) : (
        tasks
          .slice(0, 6)
          .map((task) => <TaskItem key={task._id} task={task} onToggle={handleToggle} onProgress={handleProgress} hideActions />)
      )}
    </div>
  );
}

export default TodayTasks;
