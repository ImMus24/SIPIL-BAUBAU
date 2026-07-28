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
      bg: 'bg-amber-50 dark:bg-amber-950/80',
      text: 'text-amber-700 dark:text-amber-300',
      ring: 'ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30',
    },
    diproses: {
      label: 'Sedang Diproses',
      bg: 'bg-blue-50 dark:bg-blue-950/80',
      text: 'text-blue-700 dark:text-blue-300',
      ring: 'ring-1 ring-inset ring-blue-700/20 dark:ring-blue-500/30',
    },
    selesai: {
      label: 'Selesai Ditangani',
      bg: 'bg-emerald-50 dark:bg-emerald-950/80',
      text: 'text-emerald-700 dark:text-emerald-300',
      ring: 'ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/30',
    },
    ditolak: {
      label: 'Laporan Ditolak',
      bg: 'bg-rose-50 dark:bg-rose-950/80',
      text: 'text-rose-700 dark:text-rose-300',
      ring: 'ring-1 ring-inset ring-rose-600/20 dark:ring-rose-500/30',
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
    rendah: { label: 'Rendah', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
    sedang: { label: 'Sedang', bg: 'bg-sky-100 dark:bg-sky-950/80', text: 'text-sky-800 dark:text-sky-300' },
    tinggi: { label: 'Tinggi', bg: 'bg-orange-100 dark:bg-orange-950/80', text: 'text-orange-800 dark:text-orange-300' },
    darurat: { label: 'Darurat', bg: 'bg-red-100 dark:bg-red-950/80', text: 'text-red-800 dark:text-red-300 font-extrabold animate-pulse' },
  };

  const current = urgencyMap[urgency] || urgencyMap['sedang'];

  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${current.bg} ${current.text}`}>
      Tingkat: {current.label}
    </span>
  );
};

