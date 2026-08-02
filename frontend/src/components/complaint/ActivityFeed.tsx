import React from 'react';
import { Card } from '../ui/Card';
import { Activity, History, MessageSquare, FileImage, CheckCircle2, User } from 'lucide-react';
import type { ComplaintActivityLog } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface ActivityFeedProps {
  logs: ComplaintActivityLog[];
}

const ACTION_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  status_changed: { label: 'Status', icon: History, color: 'bg-info-bg text-info' },
  comment_added: { label: 'Komentar', icon: MessageSquare, color: 'bg-primary-light text-primary' },
  file_uploaded: { label: 'Berkas', icon: FileImage, color: 'bg-success-bg text-success' },
  created: { label: 'Dibuat', icon: CheckCircle2, color: 'bg-warning-bg text-warning' },
  assigned: { label: 'Penugasan', icon: User, color: 'bg-danger-bg text-danger' },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ logs }) => {
  if (logs.length === 0) return null;

  const sorted = [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Card variant="bordered">
      <Card.Header>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-base font-bold text-foreground">Aktivitas</h2>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="space-y-1">
          {sorted.map((log) => {
            const meta = ACTION_META[log.action] ?? { label: log.action, icon: Activity, color: 'bg-muted text-muted-foreground' };
            const Icon = meta.icon;
            return (
              <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
                <div className={cn('p-1.5 rounded-lg shrink-0', meta.color)}>
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-xs font-bold text-foreground">{log.description ?? meta.label}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" aria-hidden="true" />
                      {log.user?.name ?? 'Sistem'}
                    </span>
                    <span>•</span>
                    <span>{formatDateTime(log.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};
