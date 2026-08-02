import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge, UrgencyBadge } from '../ui/Badge';
import {
  MapPin, ExternalLink, ArrowUpCircle, CheckCircle2,
  Clock, Navigation, Camera,
} from 'lucide-react';
import type { Complaint } from '../../types';

interface OfficerTaskCardProps {
  task: Complaint;
  onViewDetail: (task: Complaint) => void;
  onNavigate: (task: Complaint) => void;
  onUpdate: (task: Complaint) => void;
  onComplete: (task: Complaint) => void;
}

export const OfficerTaskCard: React.FC<OfficerTaskCardProps> = ({
  task, onViewDetail, onNavigate, onUpdate, onComplete,
}) => {
  const isFinished = task.status === 'selesai' || task.status === 'ditolak';
  const isInProgress = task.status === 'diproses';

  return (
    <Card variant="interactive" padding="md" className="group hover:border-primary/30 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
              {task.ticket_code}
            </span>
            <StatusBadge status={task.status} size="sm" />
            <UrgencyBadge urgency={task.urgency} />
          </div>

          <h3 className="font-heading font-bold text-foreground text-base leading-snug">
            {task.title}
          </h3>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{task.subdistrict}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{new Date(task.created_at).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center text-[10px] font-bold rounded-full bg-muted-foreground/20">📍</span>
              <span className="truncate">{task.address || task.reporter_name}</span>
            </div>
          </div>

          {task.category && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
              {task.category.icon && <span>{task.category.icon}</span>}
              {task.category.name}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0">
          <Button variant="outline" size="sm" icon={ExternalLink} onClick={() => onViewDetail(task)}>
            Detail
          </Button>
          <Button variant="ghost" size="sm" icon={Navigation} onClick={() => onNavigate(task)}>
            Navigasi
          </Button>
          {!isFinished && !isInProgress && (
            <Button variant="accent" size="sm" icon={ArrowUpCircle} onClick={() => onUpdate(task)}>
              Mulai
            </Button>
          )}
          {isInProgress && (
            <>
              <Button variant="primary" size="sm" icon={Camera} onClick={() => onUpdate(task)}>
                Progress
              </Button>
              <Button variant="success" size="sm" icon={CheckCircle2} onClick={() => onComplete(task)}>
                Selesai
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OfficerTaskCard;
