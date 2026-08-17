import { AlertCircle, RotateCw } from 'lucide-react';

function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="p-8 text-center animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-coral-50 dark:bg-coral-500/15 flex items-center justify-center mx-auto mb-3 text-coral-600 dark:text-coral-300">
        <AlertCircle size={18} strokeWidth={1.8} />
      </div>
      <p className="text-coral-600 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-ink-soft bg-paper hover:bg-paper-border px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCw size={12} strokeWidth={2} />
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
