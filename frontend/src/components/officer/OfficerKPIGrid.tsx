import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Skeleton } from '../dashboard/LoadingSkeleton';
import {
  ClipboardList, Clock, CheckCircle2, AlertTriangle,
  Timer, TrendingUp,
} from 'lucide-react';
import type { AgencyStats, TodaysTasks } from '../../types';

interface OfficerKPIGridProps {
  statsAgency: AgencyStats;
  todaysTasks: TodaysTasks;
  avgResolutionTime: number;
  performanceScore: number;
  completedThisMonth: number;
  loading: boolean;
}

export const OfficerKPIGrid: React.FC<OfficerKPIGridProps> = ({
  statsAgency, todaysTasks, avgResolutionTime, performanceScore, completedThisMonth, loading,
}) => {
  if (loading) return <Skeleton.KPIGrid count={6} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Tugas Hari Ini"
        value={todaysTasks.new_today}
        subtitle="Tugas baru hari ini"
        icon={ClipboardList}
        variant="primary"
      />
      <StatCard
        title="Sedang Diproses"
        value={statsAgency.diproses}
        subtitle="Dalam penanganan"
        icon={Clock}
        variant="info"
      />
      <StatCard
        title="Selesai Hari Ini"
        value={todaysTasks.completed_today}
        subtitle={`${completedThisMonth} bulan ini`}
        icon={CheckCircle2}
        variant="success"
      />
      <StatCard
        title="Prioritas Tinggi"
        value={statsAgency.menunggu}
        subtitle="Menunggu ditangani"
        icon={AlertTriangle}
        variant="warning"
      />
      <StatCard
        title="Rata-rata Waktu"
        value={`${avgResolutionTime} jam`}
        subtitle="Waktu penyelesaian"
        icon={Timer}
        variant="default"
      />
      <StatCard
        title="Skor Performa"
        value={`${performanceScore}`}
        subtitle={`${performanceScore >= 80 ? '🏆 Sangat Baik' : performanceScore >= 60 ? '👍 Baik' : '📈 Perlu Ditingkatkan'}`}
        icon={TrendingUp}
        variant={performanceScore >= 80 ? 'success' : performanceScore >= 60 ? 'primary' : 'warning'}
      />
    </div>
  );
};

export default OfficerKPIGrid;
