import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorBg?: string;
  colorIcon?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorBg = 'bg-teal-50',
  colorIcon = 'text-teal-700',
  trend,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          {trend && <p className="text-xs font-semibold text-emerald-600 mt-1">{trend}</p>}
        </div>
        <div className={`p-3.5 rounded-xl ${colorBg}`}>
          <Icon className={`w-6 h-6 ${colorIcon}`} />
        </div>
      </div>
    </div>
  );
};
