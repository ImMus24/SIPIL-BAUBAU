import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { History, Clock, User, FileImage, MessageSquare, CheckCircle2, Activity } from 'lucide-react';
import type { ComplaintStatusLog, ComplaintActivityLog } from '../../types';
import { STATUS_LABELS } from '../../config/constants';
import { cn, formatDateTime } from '../../lib/utils';

interface DetailTimelineProps {
  statusLogs: ComplaintStatusLog[];
  activityLogs: ComplaintActivityLog[];
}

const STATUS_DOT: Record<string, string> = {
  menunggu: 'bg-warning',
  diproses: 'bg-info',
  selesai: 'bg-success',
  ditolak: 'bg-danger',
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

const activityIcon: Record<string, React.ElementType> = {
  status_changed: History,
  comment_added: MessageSquare,
  file_uploaded: FileImage,
  created: CheckCircle2,
};

interface TimelineEvent {
  id: string;
  time: string;
  actor: string;
  title: string;
  description?: string | null;
  kind: 'status' | 'activity';
  status?: string;
  action?: string;
  photo?: string | null;
}

export const DetailTimeline: React.FC<DetailTimelineProps> = ({ statusLogs, activityLogs }) => {
  const events: TimelineEvent[] = [
    ...statusLogs.map((log) => ({
      id: `status-${log.id}`,
      time: log.created_at,
      actor: log.updated_by,
      title: statusLabel(log.status),
      description: log.notes,
      kind: 'status' as const,
      status: log.status,
      photo: log.photo_proof,
    })),
    ...activityLogs.map((log) => ({
      id: `activity-${log.id}`,
      time: log.created_at,
      actor: log.user?.name ?? 'Sistem',
      title: log.description ?? log.action,
      description: null,
      kind: 'activity' as const,
      action: log.action,
    })),
  ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <Card variant="bordered">
      <Card.Header>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-info-bg text-info">
            <History className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-base font-bold text-foreground">Riwayat Penanganan</h2>
        </div>
      </Card.Header>
      <Card.Body>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Belum ada riwayat.</p>
        ) : (
          <ol className="relative space-y-0">
            {events.map((ev, idx) => {
              const Icon = ev.kind === 'status' ? Activity : activityIcon[ev.action ?? ''] ?? History;
              const isLast = idx === events.length - 1;
              return (
                <motion.li
                  key={ev.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {/* Connector line */}
                  {!isLast && <span className="absolute left-[11px] top-7 bottom-0 w-px bg-border" />}

                  {/* Node */}
                  <div className="relative z-10 shrink-0">
                    {ev.kind === 'status' ? (
                      <span className={cn('w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-card', STATUS_DOT[ev.status ?? ''] ?? 'bg-muted')}>
                        <span className="w-2 h-2 rounded-full bg-white" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center ring-4 ring-card">
                        <Icon className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={cn('text-sm font-bold', ev.kind === 'status' ? 'text-foreground' : 'text-muted-foreground')}>
                        {ev.title}
                      </span>
                      {ev.status && (
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
                          ev.status === 'selesai' && 'bg-success-bg text-success',
                          ev.status === 'diproses' && 'bg-info-bg text-info',
                          ev.status === 'menunggu' && 'bg-warning-bg text-warning',
                          ev.status === 'ditolak' && 'bg-danger-bg text-danger',
                        )}>
                          {statusLabel(ev.status)}
                        </span>
                      )}
                    </div>
                    {ev.description && (
                      <p className="text-sm text-foreground/75 mt-1 leading-relaxed">{ev.description}</p>
                    )}
                    {ev.photo && (
                      <a
                        href={ev.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-info-bg text-info text-xs font-semibold hover:bg-info/15 transition-colors"
                      >
                        <FileImage className="w-3.5 h-3.5" aria-hidden="true" />
                        Lihat bukti foto
                      </a>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {formatDateTime(ev.time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" aria-hidden="true" />
                        {ev.actor}
                      </span>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        )}
      </Card.Body>
    </Card>
  );
};
