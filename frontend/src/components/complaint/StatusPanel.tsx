import React from 'react';
import { Card } from '../ui/Card';
import { StatusBadge, UrgencyBadge } from '../ui/Badge';
import { Gauge, CalendarClock, UserCog, AlertTriangle } from 'lucide-react';
import type { ComplaintDetail } from '../../types';
import { cn } from '../../lib/utils';

interface StatusPanelProps {
  complaint: ComplaintDetail;
}

const SLA_COLOR: Record<string, string> = {
  selesai: 'text-success bg-success-bg border-success-border',
  on_track: 'text-info bg-info-bg border-info-border',
  overdue: 'text-danger bg-danger-bg border-danger-border',
  unknown: 'text-muted-foreground bg-muted border-border',
};

export const StatusPanel: React.FC<StatusPanelProps> = ({ complaint }) => {
  const progress = complaint.progress_percentage ?? 0;
  const sla = complaint.sla;

  return (
    <Card variant="bordered" className="relative overflow-hidden">
      {/* Top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-golden to-success" />

      <Card.Body className="pt-7">
        {/* Progress ring */}
        <div className="flex items-center gap-5">
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: `conic-gradient(var(--color-primary) ${progress * 3.6}deg, var(--color-border) 0deg)`,
            }}
            role="img"
            aria-label={`Kemajuan ${progress} persen`}
          >
            <div className="absolute inset-[7px] rounded-full bg-card flex items-center justify-center">
              <span className="font-heading text-lg font-black text-foreground">{progress}%</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Gauge className="w-3 h-3" aria-hidden="true" /> Kemajuan
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">{complaint.progress_label}</p>
          </div>
        </div>

        {/* Status + Priority */}
        <div className="flex items-center justify-between gap-2 mt-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
            <StatusBadge status={complaint.status} size="sm" />
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Prioritas</p>
            <UrgencyBadge urgency={complaint.urgency} />
          </div>
        </div>

        {/* Officer */}
        {complaint.current_officer && (
          <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-border">
            <div className="p-2 rounded-lg bg-info-bg text-info">
              <UserCog className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Petugas Penanganan</p>
              <p className="text-sm font-bold text-foreground truncate">{complaint.current_officer}</p>
            </div>
          </div>
        )}

        {/* SLA */}
        <div className={cn('mt-4 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5', SLA_COLOR[sla.status])}>
          <CalendarClock className="w-4 h-4 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Target Penyelesaian (SLA)</p>
            <p className="text-sm font-bold truncate">{sla.label}</p>
          </div>
        </div>

        {/* Overdue warning */}
        {sla.status === 'overdue' && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-danger-bg border border-danger-border px-3.5 py-2.5">
            <AlertTriangle className="w-4 h-4 text-danger shrink-0" aria-hidden="true" />
            <p className="text-xs font-semibold text-danger">Laporan melewati target penyelesaian.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
