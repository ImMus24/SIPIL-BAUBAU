import React from 'react';
import { clsx } from 'clsx';
import type { ComplaintStatus, UrgencyLevel } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', dot = true }) => {
  const sizeClasses = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-xs', lg: 'px-3 py-1.5 text-sm' };

  const statusMap: Record<ComplaintStatus, { label: string; bg: string; text: string; ring: string }> = {
    menunggu: {
      label: 'Menunggu',
      bg: 'bg-warning-bg',
      text: 'text-warning',
      ring: 'ring-1 ring-inset ring-warning-border',
    },
    diproses: {
      label: 'Diproses',
      bg: 'bg-info-bg',
      text: 'text-info',
      ring: 'ring-1 ring-inset ring-info-border',
    },
    selesai: {
      label: 'Selesai',
      bg: 'bg-success-bg',
      text: 'text-success',
      ring: 'ring-1 ring-inset ring-success-border',
    },
    ditolak: {
      label: 'Ditolak',
      bg: 'bg-danger-bg',
      text: 'text-danger',
      ring: 'ring-1 ring-inset ring-danger-border',
    },
  };

  const current = statusMap[status] || statusMap['menunggu'];

  return (
    <span className={clsx('inline-flex items-center rounded-lg font-bold', sizeClasses[size], current.bg, current.text, current.ring)}>
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />}
      {current.label}
    </span>
  );
};

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: 'sm' | 'md';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, size = 'sm' }) => {
  const sizeClasses = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };

  const urgencyMap: Record<UrgencyLevel, { label: string; bg: string; text: string }> = {
    rendah: { label: 'Rendah', bg: 'bg-muted', text: 'text-muted-foreground' },
    sedang: { label: 'Sedang', bg: 'bg-info-bg', text: 'text-info' },
    tinggi: { label: 'Tinggi', bg: 'bg-warning-bg', text: 'text-warning' },
    darurat: { label: 'Darurat', bg: 'bg-danger-bg', text: 'text-danger font-extrabold' },
  };

  const current = urgencyMap[urgency] || urgencyMap['sedang'];

  return (
    <span className={clsx('inline-flex items-center rounded-lg font-semibold', sizeClasses[size], current.bg, current.text)}>
      {current.label}
    </span>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', dot }) => {
  const sizeClasses = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-xs' };
  const variantStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary-light text-primary',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
    info: 'bg-info-bg text-info',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-lg font-bold', sizeClasses[size], variantStyles[variant])}>
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};
