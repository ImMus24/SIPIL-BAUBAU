import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: { value: string; up: boolean };
}

const variantConfig = {
  default: { bg: 'bg-muted', iconColor: 'text-muted-foreground' },
  primary: { bg: 'bg-primary-light', iconColor: 'text-primary' },
  success: { bg: 'bg-success-bg', iconColor: 'text-success' },
  warning: { bg: 'bg-warning-bg', iconColor: 'text-warning' },
  danger: { bg: 'bg-danger-bg', iconColor: 'text-danger' },
  info: { bg: 'bg-info-bg', iconColor: 'text-info' },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
  trend,
}) => {
  const config = variantConfig[variant];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-heading font-black text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={clsx('flex items-center gap-1 text-xs font-bold mt-1', trend.up ? 'text-success' : 'text-danger')}>
              {trend.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={clsx('p-3.5 rounded-xl', config.bg)}>
          <Icon className={clsx('w-6 h-6', config.iconColor)} />
        </div>
      </div>
    </div>
  );
};
