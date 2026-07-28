import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  label: string;
  description?: string;
  icon: LucideIcon;
  color?: string;
  onClick: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  label,
  description,
  icon: Icon,
  color = 'bg-primary/10 text-primary',
  onClick,
}) => (
  <button
    onClick={onClick}
    className="group flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left w-full"
  >
    <div className={`shrink-0 w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="min-w-0">
      <p className="font-heading font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
        {label}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
      )}
    </div>
  </button>
);

export default QuickActionCard;
