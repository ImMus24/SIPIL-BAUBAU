import React, { useCallback, useRef, useState } from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

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
    'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md shadow-primary/20 active:scale-[0.98]',
  secondary:
    'bg-navy text-navy-foreground hover:bg-navy-light shadow-sm active:scale-[0.98]',
  accent:
    'bg-golden text-golden-foreground hover:bg-golden-hover shadow-sm hover:shadow-md shadow-golden/25 active:scale-[0.98]',
  outline:
    'border border-border bg-transparent hover:bg-muted hover:border-primary/30 text-foreground active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-muted text-foreground active:scale-[0.98]',
  danger:
    'bg-danger text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
  success:
    'bg-success text-white hover:bg-green-700 shadow-sm active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
};

interface RippleState {
  id: number;
  x: number;
  y: number;
  size: number;
}

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
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const rippleId = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = rippleId.current++;
      setRipples((prev) => [...prev, { id, x, y, size }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
      onClick?.(e);
    },
    [disabled, loading, onClick],
  );

  return (
    <button
      className={cn(
        'ripple-container inline-flex items-center justify-center font-semibold transition-all duration-150',
        'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-ink"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          aria-hidden="true"
        />
      ))}
    </button>
  );
};
