import React from 'react';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string | number;
  title: string;
  description?: string;
  time: string;
  status?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  loading?: boolean;
  emptyMessage?: string;
  maxItems?: number;
}

const statusColors: Record<string, string> = {
  selesai: 'bg-success',
  diproses: 'bg-info',
  menunggu: 'bg-warning',
  ditolak: 'bg-danger',
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  loading = false,
  emptyMessage = 'Belum ada aktivitas terbaru',
  maxItems = 10,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-muted mt-2 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Activity className="w-8 h-8 text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const displayItems = items.slice(0, maxItems);

  return (
    <div className="space-y-1">
      {displayItems.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
        >
          {item.icon || (
            <div
              className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                statusColors[item.status || ''] || 'bg-muted-foreground'
              }`}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {item.title}
            </p>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
            )}
          </div>
          <time className="text-xs text-muted-foreground shrink-0 pt-0.5">{item.time}</time>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
