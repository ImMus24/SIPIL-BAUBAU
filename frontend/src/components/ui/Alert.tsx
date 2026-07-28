import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantConfig = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-success-bg',
    border: 'border-success-border',
    text: 'text-success',
    iconColor: 'text-success',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-danger-bg',
    border: 'border-danger-border',
    text: 'text-danger',
    iconColor: 'text-danger',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-bg',
    border: 'border-warning-border',
    text: 'text-warning',
    iconColor: 'text-warning',
  },
  info: {
    icon: Info,
    bg: 'bg-info-bg',
    border: 'border-info-border',
    text: 'text-info',
    iconColor: 'text-info',
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible,
  onDismiss,
  className,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border',
        config.bg,
        config.border,
        className
      )}
      role="alert"
    >
      <Icon className={clsx('w-5 h-5 mt-0.5 shrink-0', config.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <h4 className={clsx('font-bold text-sm mb-0.5', config.text)}>{title}</h4>}
        <div className="text-sm text-foreground/80">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};
