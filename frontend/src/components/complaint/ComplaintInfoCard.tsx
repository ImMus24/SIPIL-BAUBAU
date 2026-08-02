import React from 'react';
import { Card } from '../ui/Card';
import { User, Phone, Mail, MapPin, Building2, Tag, Hash, CalendarClock } from 'lucide-react';
import type { ComplaintDetail } from '../../types';
import { formatDateTime } from '../../lib/utils';

interface ComplaintInfoCardProps {
  complaint: ComplaintDetail;
}

export const ComplaintInfoCard: React.FC<ComplaintInfoCardProps> = ({ complaint }) => {
  const rows = [
    { icon: Hash, label: 'Nomor Tiket', value: complaint.ticket_code, mono: true },
    { icon: Tag, label: 'Kategori', value: complaint.category?.name ?? '-' },
    { icon: Building2, label: 'OPD Tujuan', value: complaint.agency?.name ?? 'Belum ditentukan' },
    { icon: User, label: 'Pelapor', value: complaint.reporter_name },
    { icon: Phone, label: 'Telepon', value: complaint.reporter_phone || '-' },
    { icon: Mail, label: 'Email', value: complaint.reporter_email || '-' },
    { icon: MapPin, label: 'Kecamatan', value: complaint.subdistrict },
    { icon: MapPin, label: 'Alamat', value: complaint.address },
    { icon: CalendarClock, label: 'Diajukan', value: formatDateTime(complaint.created_at) },
  ];

  return (
    <Card variant="bordered">
      <Card.Header>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-light text-primary">
            <Tag className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-base font-bold text-foreground">Informasi Laporan</h2>
        </div>
      </Card.Header>
      <Card.Body>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {rows.map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-muted text-muted-foreground shrink-0">
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd className={`text-sm font-semibold text-foreground truncate mt-0.5 ${mono ? 'font-mono text-primary' : ''}`}>
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Coordinates */}
        <div className="mt-5 pt-5 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/60 border border-border px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Latitude</p>
              <p className="font-mono text-sm font-bold text-foreground mt-1">{complaint.latitude?.toFixed(6)}</p>
            </div>
            <div className="rounded-xl bg-muted/60 border border-border px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Longitude</p>
              <p className="font-mono text-sm font-bold text-foreground mt-1">{complaint.longitude?.toFixed(6)}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Deskripsi Laporan</p>
          <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{complaint.description}</p>
        </div>

        {complaint.status === 'ditolak' && complaint.rejection_reason && (
          <div className="mt-5 rounded-xl bg-danger-bg border border-danger-border p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-danger mb-1">Alasan Penolakan</p>
            <p className="text-sm text-danger/90">{complaint.rejection_reason}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
