import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { StatusBadge, UrgencyBadge } from '../ui/Badge';
import { Layers, MapPin, ChevronRight } from 'lucide-react';
import type { Complaint } from '../../types';
import { formatDate } from '../../lib/utils';

interface RelatedComplaintsProps {
  complaints: Complaint[];
}

export const RelatedComplaints: React.FC<RelatedComplaintsProps> = ({ complaints }) => {
  if (complaints.length === 0) return null;

  return (
    <Card variant="bordered">
      <Card.Header>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-success-bg text-success">
            <Layers className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-base font-bold text-foreground">Laporan Terkait</h2>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {complaints.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/complaints/${c.id}`}
                className="block group rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded border border-primary/20">
                    {c.ticket_code}
                  </span>
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                  {c.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{c.subdistrict}</span>
                  <span className="mx-0.5">•</span>
                  <span>{formatDate(c.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <UrgencyBadge urgency={c.urgency} size="sm" />
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Detail <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};
