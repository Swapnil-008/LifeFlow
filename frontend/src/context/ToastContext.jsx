import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const show = useCallback(
    (message, { type = 'success', duration = 3000 } = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center px-4 w-full max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`toast-pop w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-card-hover text-white ${
              t.type === 'error' ? 'bg-coral-600' : 'bg-neutral-900'
            }`}
          >
            {t.type === 'error' ? (
              <XCircle size={16} className="shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0 text-brand-300" />
            )}
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
