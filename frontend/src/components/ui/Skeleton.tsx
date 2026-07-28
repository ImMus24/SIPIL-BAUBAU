import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}></div>;
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
    <div className="flex justify-between items-center">
      <Skeleton className="w-1/3 h-5" />
      <Skeleton className="w-20 h-6" variant="rectangular" />
    </div>
    <Skeleton className="w-full h-4" />
    <Skeleton className="w-3/4 h-4" />
    <div className="pt-4 flex justify-between items-center">
      <Skeleton className="w-28 h-8" variant="rectangular" />
      <Skeleton className="w-24 h-4" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between">
      <Skeleton className="w-48 h-6" />
      <Skeleton className="w-32 h-6" />
    </div>
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between space-x-4">
          <Skeleton className="w-10 h-10" variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-1/2 h-3" />
          </div>
          <Skeleton className="w-24 h-7" variant="rectangular" />
        </div>
      ))}
    </div>
  </div>
);
