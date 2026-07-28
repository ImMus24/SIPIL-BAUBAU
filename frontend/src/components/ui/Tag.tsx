import React from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary-light text-primary',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
  info: 'bg-info-bg text-info',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  removable,
  onRemove,
  className,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-lg font-semibold',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
