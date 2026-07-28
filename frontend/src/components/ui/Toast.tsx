import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  isOpen,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      color: 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    error: {
      icon: AlertCircle,
      color: 'bg-rose-50 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100 border-rose-300 dark:border-rose-700',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    warning: {
      icon: AlertTriangle,
      color: 'bg-amber-50 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    info: {
      icon: Info,
      color: 'bg-sky-50 dark:bg-sky-950/90 text-sky-900 dark:text-sky-100 border-sky-300 dark:border-sky-700',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
  };

  const current = typeConfig[type];
  const IconComponent = current.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className={`flex items-start p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${current.color}`}>
        <IconComponent className={`w-6 h-6 mr-3 shrink-0 mt-0.5 ${current.iconColor}`} />
        <div className="flex-1 pr-2">
          <h4 className="font-extrabold text-sm tracking-tight">{title}</h4>
          {message && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{message}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
