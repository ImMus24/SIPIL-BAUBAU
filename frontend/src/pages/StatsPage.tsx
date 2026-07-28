import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { complaintService } from '../services/complaintService';
import type { StatSummary } from '../types';
import { useTheme } from '../context/ThemeContext';
import { MOCK_SUBDISTRICT_STATS, MOCK_CATEGORY_STATS } from '../services/mockData';
import { StatCard } from '../components/ui/StatCard';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Building, Award, PieChart } from 'lucide-react';

export const StatsPage: React.FC = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<StatSummary>({
    total: 148,
    menunggu: 18,
    diproses: 34,
    selesai: 88,
    ditolak: 8,
    completion_rate: 65.2,
  });

  useEffect(() => {
    complaintService.getStatsSummary().then(setStats);
  }, []);

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  // ApexCharts Configs
  const statusChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
    theme: { mode: isDark ? 'dark' : 'light' },
    labels: ['Selesai Ditangani', 'Sedang Diproses', 'Menunggu Verifikasi', 'Ditolak'],
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
    legend: { position: 'bottom', labels: { colors: textColor } },
    dataLabels: { enabled: true },
    stroke: { colors: [isDark ? '#1e293b' : '#ffffff'] },
  };
  const statusChartSeries = [stats.selesai, stats.diproses, stats.menunggu, stats.ditolak];

  const categoryChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', fontFamily: 'inherit', toolbar: { show: false }, background: 'transparent' },
    theme: { mode: isDark ? 'dark' : 'light' },
    plotOptions: { bar: { borderRadius: 8, horizontal: true } },
    colors: [isDark ? '#38bdf8' : '#0f766e'],
    grid: { borderColor: gridColor },
    xaxis: {
      categories: MOCK_CATEGORY_STATS.map((c) => c.category_name),
      labels: { style: { colors: textColor } }
    },
    yaxis: {
      labels: { style: { colors: textColor } }
    },
    legend: { labels: { colors: textColor } },
  };
  const categoryChartSeries = [
    { name: 'Jumlah Pengaduan', data: MOCK_CATEGORY_STATS.map((c) => c.count) }
  ];

  const subdistrictChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', fontFamily: 'inherit', toolbar: { show: false }, background: 'transparent' },
    theme: { mode: isDark ? 'dark' : 'light' },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '55%' } },
    colors: [isDark ? '#fbbf24' : '#d97706', isDark ? '#34d399' : '#059669'],
    grid: { borderColor: gridColor },
    xaxis: {
      categories: MOCK_SUBDISTRICT_STATS.map((s) => s.subdistrict),
      labels: { style: { colors: textColor } }
    },
    yaxis: {
      labels: { style: { colors: textColor } }
    },
    legend: { labels: { colors: textColor } },
  };
  const subdistrictChartSeries = [
    { name: 'Total Laporan', data: MOCK_SUBDISTRICT_STATS.map((s) => s.count) },
    { name: 'Selesai Ditangani', data: MOCK_SUBDISTRICT_STATS.map((s) => s.resolved) }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 dark:text-sky-400 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Transparansi Publik Kota Baubau</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Statistik & Analisis Penanganan</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Laporan kinerja pelayanan infrastruktur publik Pemkot Baubau
          </p>
        </div>
        <div className="px-4 py-2 bg-teal-50 dark:bg-sky-950/80 border border-teal-200 dark:border-sky-800 rounded-2xl text-right">
          <p className="text-[10px] uppercase font-bold text-teal-800 dark:text-sky-300">Tingkat Penyelesaian OPD</p>
          <p className="text-2xl font-black text-teal-700 dark:text-sky-400">{stats.completion_rate}%</p>
        </div>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Laporan Received"
          value={stats.total}
          subtitle="Semua kategori"
          icon={Building}
          colorBg="bg-slate-100 dark:bg-slate-800"
          colorIcon="text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Selesai Ditangani"
          value={stats.selesai}
          subtitle="Telah ditutup dengan bukti"
          icon={CheckCircle2}
          colorBg="bg-emerald-50 dark:bg-emerald-950/80"
          colorIcon="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Sedang Diproses"
          value={stats.diproses}
          subtitle="Teknisi OPD di lapangan"
          icon={Clock}
          colorBg="bg-blue-50 dark:bg-blue-950/80"
          colorIcon="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={stats.menunggu}
          subtitle="Laporan baru masuk"
          icon={AlertTriangle}
          colorBg="bg-amber-50 dark:bg-amber-950/80"
          colorIcon="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Donut Chart Status */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-teal-600 dark:text-sky-400" />
            <span>Persentase Status Laporan</span>
          </h3>
          <div className="pt-4">
            <Chart options={statusChartOptions} series={statusChartSeries} type="donut" height={320} />
          </div>
        </div>

        {/* Bar Chart Categories */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600 dark:text-sky-400" />
            <span>Sebaran Pengaduan Berdasarkan Kategori</span>
          </h3>
          <div className="pt-2">
            <Chart options={categoryChartOptions} series={categoryChartSeries} type="bar" height={300} />
          </div>
        </div>

      </div>

      {/* Subdistrict Distribution Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Sebaran Pengaduan Menurut 8 Kecamatan di Kota Baubau</span>
        </h3>
        <div className="pt-4">
          <Chart options={subdistrictChartOptions} series={subdistrictChartSeries} type="bar" height={340} />
        </div>
      </div>

    </div>
  );
};
