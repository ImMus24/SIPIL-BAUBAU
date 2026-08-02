import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'bordered' | 'flat' | 'premium';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const variantClasses = {
  default: 'bg-card border border-border shadow-sm',
  interactive: 'bg-card border border-border shadow-sm hover-lift cursor-pointer hover:border-primary/30',
  bordered: 'bg-card border-2 border-border shadow-none',
  flat: 'bg-muted border-none shadow-none',
  premium: 'bg-card border border-border shadow-md gradient-border',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> & {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  onClick,
  header,
  footer,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-200',
        variantClasses[variant],
        onClick && !className?.includes('cursor') && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      aria-label={onClick ? 'Kartu interaktif' : undefined}
    >
      {header && <div className="px-6 py-4 border-b border-border">{header}</div>}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && <div className="px-6 py-4 border-t border-border bg-muted/50">{footer}</div>}
    </div>
  );
};

Card.Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-b border-border', className)}>{children}</div>
);

Card.Body = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-6', className)}>{children}</div>
);

Card.Footer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-t border-border bg-muted/50', className)}>{children}</div>
);
