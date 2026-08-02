import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../dashboard/LoadingSkeleton';
import {
  Clock, CheckCircle2, Navigation,
  AlertTriangle, Loader2, Activity,
} from 'lucide-react';
import type { TimelineItem } from '../../types';

interface OfficerTaskTimelineProps {
  timeline: TimelineItem[];
  loading: boolean;
  onSelect?: (complaintId: number) => void;
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  menunggu: AlertTriangle,
  diproses: Clock,
  dalam_perjalanan: Navigation,
  sedang_dikerjakan: Activity,
  menunggu_material: Loader2,
  selesai: CheckCircle2,
  ditolak: AlertTriangle,
};

const STATUS_COLORS: Record<string, string> = {
  menunggu: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  diproses: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  dalam_perjalanan: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  sedang_dikerjakan: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  menunggu_material: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  selesai: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  ditolak: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  dalam_perjalanan: 'Dalam Perjalanan',
  sedang_dikerjakan: 'Sedang Dikerjakan',
  menunggu_material: 'Menunggu Material',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export const OfficerTaskTimeline: React.FC<OfficerTaskTimelineProps> = ({ timeline, loading, onSelect }) => {
  if (loading) return <Skeleton variant="rectangular" height={300} />;

  const displayTimeline = timeline.slice(0, 8);

  if (displayTimeline.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-foreground">Timeline Tugas</h3>
        </div>
        <div className="py-8 text-center">
          <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-foreground">Timeline Tugas</h3>
        <span className="ml-auto text-xs text-muted-foreground">{timeline.length} aktivitas</span>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-3">
          {displayTimeline.map((item, idx) => {
            const Icon = STATUS_ICONS[item.status] || Activity;
            const colorClass = STATUS_COLORS[item.status] || 'bg-muted text-muted-foreground';
            const label = STATUS_LABELS[item.status] || item.status;

            return (
              <div key={`${item.complaint_id}-${idx}`} onClick={() => onSelect?.(item.complaint_id)} className={`flex items-start gap-3 relative ${onSelect ? 'cursor-pointer hover:bg-muted/40 rounded-xl px-2 -mx-2 transition-colors' : ''}`}>
                {/* Icon */}
                <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-foreground">{label}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {item.ticket_code}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.notes}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {new Date(item.created_at).toLocaleString('id-ID', {
                      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default OfficerTaskTimeline;
