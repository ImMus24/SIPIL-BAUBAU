import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  Play, Map, ListChecks, Camera, History, Calendar,
} from 'lucide-react';

interface QuickAction {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  onClick: () => void;
}

interface OfficerQuickActionsProps {
  hasUnfinishedTasks: boolean;
  onStartToday: () => void;
  onViewMap: () => void;
  onViewComplaints: () => void;
  onUploadDoc: () => void;
  onViewHistory: () => void;
}

export const OfficerQuickActions: React.FC<OfficerQuickActionsProps> = ({
  hasUnfinishedTasks, onStartToday, onViewMap,
  onViewComplaints, onUploadDoc, onViewHistory,
}) => {
  const actions: QuickAction[] = [
    {
      label: 'Mulai Tugas Hari Ini',
      description: 'Kerjakan tugas yang belum dimulai',
      icon: Play,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      onClick: onStartToday,
    },
    {
      label: 'Lihat Peta Tugas',
      description: 'Navigasi ke lokasi laporan',
      icon: Map,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      onClick: onViewMap,
    },
    {
      label: 'Daftar Pengaduan',
      description: 'Semua tugas yang ditugaskan',
      icon: ListChecks,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      onClick: onViewComplaints,
    },
    {
      label: 'Upload Dokumentasi',
      description: 'Foto sebelum/sesudah',
      icon: Camera,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30',
      onClick: onUploadDoc,
    },
    {
      label: 'Riwayat Tugas',
      description: 'Lihat tugas yang sudah selesai',
      icon: History,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      onClick: onViewHistory,
    },
    {
      label: 'Jadwal Tugas',
      description: 'Perkiraan penyelesaian',
      icon: Calendar,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
      onClick: () => {},
    },
  ];

  return (
    <div>
      <h2 className="font-heading font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-muted-foreground">
        Aksi Cepat
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{action.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OfficerQuickActions;
