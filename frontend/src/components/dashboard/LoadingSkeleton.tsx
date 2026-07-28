import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'chart';
  width?: string | number;
  height?: string | number;
  count?: number;
}

const SkeletonBase: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div className={`animate-pulse bg-muted rounded-xl ${className}`} style={style} />
);

export const Skeleton: React.FC<SkeletonProps> & {
  Card: React.FC<{ lines?: number; className?: string }>;
  Chart: React.FC<{ className?: string }>;
  Table: React.FC<{ rows?: number; cols?: number }>;
  KPIGrid: React.FC<{ count?: number }>;
} = ({ className = '', width, height, count = 1 }) => {
  if (count > 1) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonBase key={i} className={className} style={{ width, height }} />
        ))}
      </div>
    );
  }
  return <SkeletonBase className={className} style={{ width, height }} />;
};

Skeleton.Card = ({ lines = 3, className = '' }) => (
  <div className={`bg-card border border-border rounded-2xl p-6 space-y-4 ${className}`}>
    <SkeletonBase className="h-5 w-3/5" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase key={i} className={`h-3 ${i === lines - 1 ? 'w-4/5' : 'w-full'}`} />
    ))}
  </div>
);

Skeleton.Chart = ({ className = '' }) => (
  <div className={`bg-card border border-border rounded-2xl p-6 ${className}`}>
    <SkeletonBase className="h-5 w-2/5 mb-6" />
    <SkeletonBase className="h-48 w-full" />
  </div>
);

Skeleton.Table = ({ rows = 5, cols = 4 }) => (
  <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
    <div className="flex gap-4 mb-4">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBase key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <SkeletonBase key={j} className={`h-8 flex-1 ${j === 1 ? 'w-2/5' : ''}`} />
        ))}
      </div>
    ))}
  </div>
);

Skeleton.KPIGrid = ({ count = 5 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <SkeletonBase className="h-3 w-1/2" />
        <SkeletonBase className="h-8 w-1/3" />
        <SkeletonBase className="h-3 w-2/3" />
      </div>
    ))}
  </div>
);

export default Skeleton;
