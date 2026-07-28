import React from 'react';
import { clsx } from 'clsx';

interface TabsProps {
  tabs: { id: string; label: string; badge?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={clsx('flex gap-1 p-1 bg-muted rounded-xl', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150',
            activeTab === tab.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted-foreground/20 text-muted-foreground'
                )}
              >
                {tab.badge}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};
