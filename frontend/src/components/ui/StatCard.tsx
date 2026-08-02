import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'golden';
  trend?: { value: string; up: boolean };
}

const variantConfig = {
  default: { bg: 'bg-muted', iconColor: 'text-muted-foreground' },
  primary: { bg: 'bg-primary-light', iconColor: 'text-primary' },
  success: { bg: 'bg-success-bg', iconColor: 'text-success' },
  warning: { bg: 'bg-warning-bg', iconColor: 'text-warning' },
  danger: { bg: 'bg-danger-bg', iconColor: 'text-danger' },
  info: { bg: 'bg-info-bg', iconColor: 'text-info' },
  golden: { bg: 'bg-golden-light', iconColor: 'text-golden-foreground' },
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
    <div className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">{title}</p>
          <p className="text-2xl font-heading font-extrabold text-foreground leading-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          {trend && (
            <div className={cn('flex items-center gap-1 text-xs font-bold mt-1', trend.up ? 'text-success' : 'text-danger')}>
              {trend.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span className="truncate">{trend.value}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110', config.bg)}>
          <Icon className={cn('w-6 h-6', config.iconColor)} />
        </div>
      </div>
    </div>
  );
};
