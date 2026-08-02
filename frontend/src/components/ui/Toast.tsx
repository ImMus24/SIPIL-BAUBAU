import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const typeConfig = {
  success: { icon: CheckCircle2, bg: 'bg-success-bg border-success-border', color: 'text-success' },
  error: { icon: AlertCircle, bg: 'bg-danger-bg border-danger-border', color: 'text-danger' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-bg border-warning-border', color: 'text-warning' },
  info: { icon: Info, bg: 'bg-info-bg border-info-border', color: 'text-info' },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const context: ToastContextType = {
    toast: addToast,
    success: (t, m) => addToast('success', t, m),
    error: (t, m) => addToast('error', t, m),
    warning: (t, m) => addToast('warning', t, m),
    info: (t, m) => addToast('info', t, m),
  };

  return (
    <ToastContext.Provider value={context}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        role="status"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = typeConfig[toast.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
                className={cn(
                  'pointer-events-auto flex items-start p-4 rounded-xl border shadow-xl backdrop-blur-md',
                  config.bg,
                )}
              >
                <Icon className={cn('w-5 h-5 mr-3 shrink-0 mt-0.5', config.color)} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <h4 className={cn('font-bold text-sm', config.color)}>{toast.title}</h4>
                  {toast.message && (
                    <p className="text-xs text-foreground/70 mt-0.5">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-2 shrink-0"
                  aria-label="Tutup notifikasi"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
