import React from 'react';
import { Card } from '../ui/Card';
import { Bell, BellRing, CheckCircle2, Info } from 'lucide-react';
import type { ComplaintNotificationRef } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface NotificationHistoryProps {
  notifications: ComplaintNotificationRef[];
}

export const NotificationHistory: React.FC<NotificationHistoryProps> = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <Card variant="bordered">
      <Card.Header>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-warning-bg text-warning">
            <Bell className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-base font-bold text-foreground">Riwayat Notifikasi</h2>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-4 py-3',
                n.is_read ? 'border-border bg-card' : 'border-primary/30 bg-primary-light/40',
              )}
            >
              <div className={cn('p-1.5 rounded-lg shrink-0', n.is_read ? 'bg-muted text-muted-foreground' : 'bg-primary text-white')}>
                {n.is_read ? <Info className="w-3.5 h-3.5" aria-hidden="true" /> : <BellRing className="w-3.5 h-3.5" aria-hidden="true" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground truncate">{n.title}</p>
                  {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1">{formatDateTime(n.created_at)}</p>
              </div>
              {n.is_read && <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-1" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};
