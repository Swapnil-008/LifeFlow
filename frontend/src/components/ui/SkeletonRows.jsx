/**
 * Row-shaped skeleton placeholders for lists (tasks, expenses, etc.) so a
 * loading list keeps its layout instead of collapsing to a spinner + blank
 * space, and doesn't jump/reflow once real data arrives.
 */
function SkeletonRows({ count = 3 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-paper-border last:border-b-0">
          <div className="w-5 h-5 rounded-md bg-paper-border animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-paper-border animate-pulse" />
            <div className="h-2.5 w-1/3 rounded bg-paper-border animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonRows;
