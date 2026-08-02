import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const variantClasses = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return <div className={cn('shimmer', variantClasses[variant], className)} />;
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
    <div className="flex justify-between">
      <Skeleton className="w-1/3 h-5" />
      <Skeleton className="w-12 h-5" />
    </div>
    <Skeleton className="w-full h-4" />
    <Skeleton className="w-3/4 h-4" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="w-24 h-9" variant="rectangular" />
      <Skeleton className="w-20 h-4" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 4 }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <div className="p-4 border-b border-border flex gap-4">
      {[...Array(columns)].map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1" />
      ))}
    </div>
    <div className="divide-y divide-border">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 flex gap-4">
          {[...Array(columns)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
    <div className="flex justify-between">
      <Skeleton className="w-40 h-6" />
      <Skeleton className="w-24 h-6" />
    </div>
    <Skeleton className="w-full h-[300px]" variant="rectangular" />
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16" variant="circular" />
      <div className="space-y-2 flex-1">
        <Skeleton className="w-1/3 h-5" />
        <Skeleton className="w-1/4 h-4" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-4" />
    </div>
  </div>
);
