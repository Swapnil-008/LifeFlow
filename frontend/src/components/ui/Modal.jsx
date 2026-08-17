import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Shared modal shell used by TaskForm/ExpenseForm/HabitForm/ProfileForm/etc.
 * Centralizes the behavior that was previously duplicated (and missing) in
 * each form: Escape closes it, clicking the backdrop closes it, focus moves
 * into the dialog on open and returns to the trigger element on close.
 */
function Modal({ title, onClose, children, maxWidth = 'max-w-md' }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(document.activeElement);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Move focus into the dialog so screen reader / keyboard users land
    // somewhere sensible instead of staying on a now-hidden trigger.
    dialogRef.current?.focus();

    // Prevent the page behind the modal from scrolling while it's open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      // Return focus to whatever opened the modal (e.g. the "Add" button).
      triggerRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-ink/30 dark:bg-black/50 flex items-center justify-center z-50 px-4 modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`card w-full ${maxWidth} p-6 modal-pop focus:outline-none`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink p-1 -m-1 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
