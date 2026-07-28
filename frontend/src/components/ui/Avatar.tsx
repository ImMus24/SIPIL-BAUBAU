import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const statusSize = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

const statusColors = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  busy: 'bg-danger',
  away: 'bg-warning',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
}) => {
  return (
    <div className={clsx('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={clsx('rounded-full object-cover', sizeClasses[size])}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center',
            sizeClasses[size]
          )}
          aria-label={alt || name || 'Avatar'}
        >
          {name ? getInitials(name) : '?'}
        </div>
      )}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-card',
            statusColors[status],
            statusSize[size]
          )}
        />
      )}
    </div>
  );
};
