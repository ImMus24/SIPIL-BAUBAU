import React from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm active:scale-[0.98]',
  accent:
    'bg-amber-500 text-black hover:bg-amber-600 shadow-sm hover:shadow-md active:scale-[0.98]',
  outline:
    'border border-border bg-transparent hover:bg-muted text-foreground active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-muted text-foreground active:scale-[0.98]',
  danger:
    'bg-danger text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
  success:
    'bg-success text-white hover:bg-green-700 shadow-sm active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};
