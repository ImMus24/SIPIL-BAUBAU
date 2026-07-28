import React from 'react';
import type { ComplaintStatus, UrgencyLevel } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  const statusMap: Record<ComplaintStatus, { label: string; bg: string; text: string; ring: string }> = {
    menunggu: {
      label: 'Menunggu Verifikasi',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      ring: 'ring-1 ring-inset ring-amber-600/20',
    },
    diproses: {
      label: 'Sedang Diproses',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      ring: 'ring-1 ring-inset ring-blue-700/20',
    },
    selesai: {
      label: 'Selesai Ditangani',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      ring: 'ring-1 ring-inset ring-emerald-600/20',
    },
    ditolak: {
      label: 'Laporan Ditolak',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      ring: 'ring-1 ring-inset ring-rose-600/20',
    },
  };

  const current = statusMap[status] || statusMap['menunggu'];

  return (
    <span className={`inline-flex items-center rounded-md ${current.bg} ${current.text} ${current.ring} ${sizeClasses[size]}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
      {current.label}
    </span>
  );
};

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  const urgencyMap: Record<UrgencyLevel, { label: string; bg: string; text: string }> = {
    rendah: { label: 'Rendah', bg: 'bg-slate-100', text: 'text-slate-700' },
    sedang: { label: 'Sedang', bg: 'bg-sky-100', text: 'text-sky-800' },
    tinggi: { label: 'Tinggi', bg: 'bg-orange-100', text: 'text-orange-800' },
    darurat: { label: 'Darurat', bg: 'bg-red-100', text: 'text-red-800 font-extrabold animate-pulse' },
  };

  const current = urgencyMap[urgency] || urgencyMap['sedang'];

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${current.bg} ${current.text}`}>
      Tingkat: {current.label}
    </span>
  );
};
