import React from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../dashboard/LoadingSkeleton';
import { AreaChart } from '../charts/AreaChart';
import { TrendingUp, Award, Target, Zap, } from 'lucide-react';
import type { PerformanceDay } from '../../types';

interface OfficerPerformanceChartProps {
  performanceChart: PerformanceDay[];
  performanceScore: number;
  completedThisMonth: number;
  loading: boolean;
}

export const OfficerPerformanceChart: React.FC<OfficerPerformanceChartProps> = ({
  performanceChart, performanceScore, completedThisMonth, loading,
}) => {
  if (loading) return <Skeleton variant="rectangular" height={350} />;

  if (performanceChart.length === 0) {
    return (
      <Card>
        <div className="py-8 text-center">
          <TrendingUp className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada data performa</p>
        </div>
      </Card>
    );
  }

  const labels = performanceChart.map(d => d.label);
  const completedData = performanceChart.map(d => d.completed);
  const newData = performanceChart.map(d => d.new);
  const totalCompleted = completedData.reduce((a, b) => a + b, 0);
  const totalNew = newData.reduce((a, b) => a + b, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-foreground">Performa 7 Hari</h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Selesai</span>
            <span className="font-bold text-foreground">{totalCompleted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Baru</span>
            <span className="font-bold text-foreground">{totalNew}</span>
          </div>
        </div>
      </div>

      <AreaChart
        series={[
          { name: 'Selesai', data: completedData },
          { name: 'Baru', data: newData },
        ]}
        categories={labels}
        height={220}
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-lg font-black text-foreground">{performanceScore}</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Skor</p>
        </div>
        <div className="text-center border-x border-border">
          <div className="flex items-center justify-center gap-1">
            <Target className="w-4 h-4 text-success" />
            <span className="text-lg font-black text-foreground">{completedThisMonth}</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Selesai Bulan Ini</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-lg font-black text-foreground">{totalNew}</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Tugas Baru</p>
        </div>
      </div>
    </Card>
  );
};

export default OfficerPerformanceChart;
