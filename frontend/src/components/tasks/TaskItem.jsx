import { useEffect, useState } from 'react';
import { Trash2, Pencil, Check } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

function formatTimeRange(startTime, endTime) {
  if (!startTime && !endTime) return null;
  return [startTime, endTime].filter(Boolean).join(' - ');
}

function TaskItem({ task, onToggle, onEdit, onDelete, onProgress, hideActions = false }) {
  const isDone = task.status === 'completed' || Number(task.progress || 0) >= 100;
  const [draftProgress, setDraftProgress] = useState(isDone ? 100 : Number(task.progress || 0));
  const displayProgress = Math.max(0, Math.min(100, Number(draftProgress) || 0));
  const timeRange = formatTimeRange(task.startTime, task.endTime);

  useEffect(() => {
    setDraftProgress(isDone ? 100 : Number(task.progress || 0));
  }, [task.progress, task.status, isDone]);

  const commitProgress = () => {
    const next = Math.max(0, Math.min(100, Number(draftProgress) || 0));
    if (onProgress && next !== Number(task.progress || 0)) onProgress(task, next);
  };

  return (
    <div className="px-5 py-4 border-b border-paper-border last:border-b-0 group hover:bg-paper/50 transition-colors">
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(task)} className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-brand-500 border-brand-500' : 'border-paper-border hover:border-brand-500'}`} aria-label={isDone ? 'Mark as not done' : 'Mark as done'}>
          {isDone && <Check size={12} strokeWidth={2.5} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium ${isDone ? 'line-through text-ink-muted' : 'text-ink'}`}>{task.title}</p>
                <PriorityBadge priority={task.priority} />
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                {timeRange && <span>{timeRange}</span>}
                {task.category && <span>{task.category}</span>}
              </div>
            </div>

            {!hideActions && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper" aria-label="Edit task"><Pencil size={14} strokeWidth={1.8} /></button>
                <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg text-ink-muted hover:text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-500/15" aria-label="Delete task"><Trash2 size={14} strokeWidth={1.8} /></button>
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[11px] font-medium text-ink-muted">Progress</span>
              <span className={`text-[11px] font-semibold tabular-nums ${displayProgress >= 100 ? 'text-brand-600' : 'text-ink-soft'}`}>{displayProgress}%</span>
            </div>
            <div className="relative h-2.5 rounded-full bg-paper-border overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-brand-500 transition-[width] duration-200" style={{ width: `${displayProgress}%` }} />
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={displayProgress}
                onChange={(e) => setDraftProgress(Number(e.target.value))}
                onPointerUp={commitProgress}
                onMouseUp={commitProgress}
                onTouchEnd={commitProgress}
                onKeyUp={commitProgress}
                onBlur={commitProgress}
                aria-label={`Progress for ${task.title}`}
                className="absolute inset-0 w-full h-2.5 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-ink-muted"><span>0%</span><span>Drag to update</span><span>100% complete</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
