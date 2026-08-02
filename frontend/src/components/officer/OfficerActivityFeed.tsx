import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../dashboard/LoadingSkeleton';
import { StatusBadge } from '../ui/Badge';
import {
  Activity, AlertTriangle, Clock, CheckCircle2, ArrowUpRight,
} from 'lucide-react';
import type { Complaint } from '../../types';

interface OfficerActivityFeedProps {
  activities: Complaint[];
  loading: boolean;
}

export const OfficerActivityFeed: React.FC<OfficerActivityFeedProps> = ({ activities, loading }) => {
  if (loading) return <Skeleton variant="rectangular" height={300} />;

  // Group by latest status changes
  const display = activities.slice(0, 8);

  if (display.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-foreground">Aktivitas Terbaru</h3>
        </div>
        <div className="py-8 text-center">
          <Activity className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-foreground">Aktivitas Terbaru</h3>
        <span className="ml-auto text-xs text-muted-foreground">{display.length} item</span>
      </div>

      <div className="space-y-2">
        {display.map((item) => {
          const isUrgent = item.urgency === 'tinggi' || item.urgency === 'darurat';
          const isFinished = item.status === 'selesai';
          const isInProgress = item.status === 'diproses';

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group border border-transparent hover:border-border/50"
            >
              {/* Status icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isFinished
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : isUrgent
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : isInProgress
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {isFinished ? <CheckCircle2 className="w-4 h-4" /> : isUrgent ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[11px] font-mono text-muted-foreground">{item.ticket_code}</span>
                  <StatusBadge status={item.status} size="sm" />
                  {item.subdistrict && (
                    <>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">{item.subdistrict}</span>
                    </>
                  )}
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default OfficerActivityFeed;
