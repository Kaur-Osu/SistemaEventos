import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

const ICONS = {
  success: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const STYLES = {
  success: 'bg-dark text-white border-white/10',
  error  : 'bg-error text-white border-white/10',
  warning: 'bg-warning text-dark border-dark/10',
  info   : 'bg-primary text-white border-white/10',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type, dying: false }]);
    setTimeout(() => {
      // Marca como "muriendo" para animar la salida
      setToasts(prev => prev.map(t => t.id === id ? { ...t, dying: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, dying: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Contenedor de toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={[
              'flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl',
              'border min-w-[280px] max-w-sm pointer-events-auto',
              'transition-all duration-300',
              STYLES[toast.type] ?? STYLES.info,
              toast.dying
                ? 'opacity-0 translate-x-4 scale-95'
                : 'opacity-100 translate-x-0 scale-100 animate-slide-down',
            ].join(' ')}
          >
            {ICONS[toast.type]}
            <span className="text-sm font-medium flex-grow leading-snug">{toast.message}</span>
            <button
              onClick={() => remove(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity ml-1 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);