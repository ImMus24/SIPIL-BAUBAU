import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Skeleton } from '../../components/dashboard/LoadingSkeleton';
import { ErrorState } from '../../components/dashboard/ErrorState';
import { AreaChart } from '../../components/charts/AreaChart';
import { BarChart } from '../../components/charts/BarChart';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import type { HeadOfAgencyDashboardData, Complaint } from '../../types';
import {
  FileText, Clock, CheckCircle2,
  Building2, BarChart3, Award, Download,
  PieChart, Timer, ThumbsUp, Activity,
  TrendingUp, MapPin, ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';

export const KepalaDinasDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<HeadOfAgencyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await dashboardService.getHeadDashboard();
      setData(res as HeadOfAgencyDashboardData);
    } catch (err) {
      console.error('Failed to load head dashboard:', err);
      setError('Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (error) return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Dashboard Monitoring', href: '/kepala-dinas' }]} />
        <ErrorState title="Gagal Memuat Dashboard" message={error} onRetry={fetchData} variant="fullscreen" />
      </div>
    </DashboardLayout>
  );

  const stats = data?.stats ?? { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 };
  const trends = data?.monthly_trend ?? [];
  const agencyPerf = data?.agency_performance ?? [];
  const reports: Complaint[] = data?.recent_reports ?? [];
  const topOfficers = data?.top_officers ?? [];
  const topCategories = data?.top_categories ?? [];
  const yearlyTrend = data?.yearly_trend ?? [];
  const distPerf = data?.district_performance ?? [];
  const satisfactionRate = data?.satisfaction_rate ?? 0;
  const avgTime = data?.avg_resolution_time ?? 0;

  const maxCategoryValue = Math.max(...topCategories.map((c) => c.count), 1);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <Breadcrumb items={[{ label: 'Dashboard Monitoring', href: '/kepala-dinas' }]} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-black text-foreground flex items-center gap-3">
              Dashboard Monitoring
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-semibold">Eksekutif</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selamat datang, {user?.name} — Pantau kinerja penanganan laporan infrastruktur Kota Baubau
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={Download} onClick={() => window.print()}>Cetak PDF</Button>
            <Button variant="outline" size="sm" icon={FileSpreadsheet}>Export Excel</Button>
          </div>
        </div>

        {loading ? <Skeleton.KPIGrid count={5} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
            <StatCard title="Tingkat Penyelesaian" value={`${stats.completion_rate}%`} icon={CheckCircle2} variant="success" />
            <StatCard title="Rata-rata Waktu" value={`${avgTime} jam`} icon={Timer} variant="info" />
            <StatCard title="Sedang Diproses" value={stats.diproses} icon={Clock} variant="warning" />
            <StatCard title="Kepuasan Masyarakat" value={`${satisfactionRate}%`} icon={ThumbsUp} variant="default" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-6"><BarChart3 className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Tren Tahunan</h3></div>
            {loading ? <Skeleton.Chart /> : yearlyTrend.length > 0 ? (
              <AreaChart series={[{ name: 'Total', data: yearlyTrend.map((y) => y.total) }, { name: 'Selesai', data: yearlyTrend.map((y) => y.resolved) }]} categories={yearlyTrend.map((y) => y.year)} height={280} colors={['#3b82f6', '#22c55e']} />
            ) : <div className="h-48 flex items-center justify-center text-muted-foreground">Belum ada data tahunan</div>}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-6"><Activity className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Tren Bulanan (12 Bulan)</h3></div>
            {loading ? <Skeleton.Chart /> : trends.length > 0 ? (
              <BarChart series={[{ name: 'Selesai', data: trends.map((t) => t.resolved) }]} categories={trends.map((t) => t.label.split(' ')[0])} height={280} colors={['#22c55e']} />
            ) : <div className="h-48 flex items-center justify-center text-muted-foreground">Belum ada data bulanan</div>}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4"><PieChart className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Kategori Laporan</h3></div>
            {loading ? <Skeleton variant="text" count={5} /> : topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map((cat) => (
                  <div key={cat.category_name} className="space-y-1">
                    <div className="flex justify-between text-sm"><span className="text-foreground font-medium">{cat.category_name}</span><span className="text-muted-foreground">{cat.count} laporan</span></div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${(cat.count / maxCategoryValue) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Belum ada data kategori</p>}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Performa Kecamatan</h3></div>
            {loading ? <Skeleton variant="text" count={5} /> : distPerf.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
                  <span>Kecamatan</span><span className="text-center">Laporan</span><span className="text-right">Selesai</span>
                </div>
                {distPerf.map((d: { subdistrict: string; count: number; resolved: number }) => (
                  <div key={d.subdistrict} className="grid grid-cols-3 items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium text-foreground">{d.subdistrict}</span>
                    <span className="text-sm text-center text-muted-foreground">{d.count}</span>
                    <span className="text-sm text-right font-semibold text-success">{d.resolved}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Belum ada data kecamatan</p>}
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Kinerja OPD</h3></div>
          {loading ? <Skeleton.KPIGrid count={3} /> : agencyPerf.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencyPerf.slice(0, 9).map((a: { agency_name: string; total: number; resolved: number; completion_rate: number }) => (
                <Card key={a.agency_name} variant="bordered" className="border-border">
                  <p className="font-bold text-foreground text-sm truncate">{a.agency_name}</p>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">Total: <strong className="text-foreground">{a.total}</strong></span>
                    <span className="text-muted-foreground">Selesai: <strong className="text-success">{a.resolved}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${a.completion_rate >= 70 ? 'bg-success' : a.completion_rate >= 40 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${a.completion_rate}%` }} /></div>
                    <span className="text-xs font-bold">{a.completion_rate}%</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : <Card><p className="text-center text-muted-foreground py-6">Belum ada data OPD</p></Card>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Performa Petugas Terbaik</h3></div>
            {loading ? <Skeleton variant="text" count={5} /> : topOfficers.length > 0 ? (
              <div className="divide-y divide-border">
                {topOfficers.map((o: { officer_id: number; officer_name: string; agency_name: string; completed: number; total_handled: number }, idx: number) => (
                  <div key={o.officer_id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-warning/20 text-warning' : idx === 1 ? 'bg-muted text-muted-foreground' : idx === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground">{o.officer_name}</p><p className="text-xs text-muted-foreground">{o.agency_name}</p></div>
                    <div className="text-right text-sm"><p className="font-bold text-success">{o.completed}</p><p className="text-xs text-muted-foreground">dari {o.total_handled}</p></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Belum ada data petugas</p>}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Laporan Terbaru</h3></div>
            {loading ? <Skeleton.Table rows={5} cols={3} /> : reports.length > 0 ? (
              <div className="divide-y divide-border">
                {reports.slice(0, 8).map((report) => (
                  <div key={report.id} onClick={() => navigate(`/track?ticket=${report.ticket_code}`)}
                    className="flex items-center justify-between py-3 first:pt-0 hover:bg-muted/30 px-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{report.title}</p>
                      <p className="text-xs text-muted-foreground">{report.ticket_code} · {report.subdistrict}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={report.status} size="sm" />
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Belum ada laporan</p>}
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-2 mb-6"><TrendingUp className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Ringkasan Eksekutif</h3></div>
          {loading ? <Skeleton variant="text" count={5} /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Laporan', value: stats.total, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'Selesai', value: stats.selesai, icon: CheckCircle2, color: 'text-success', bg: 'bg-success-bg' },
                { label: 'Diproses', value: stats.diproses, icon: Clock, color: 'text-info', bg: 'bg-info-bg' },
                { label: 'Completion Rate', value: `${stats.completion_rate}%`, icon: TrendingUp, color: 'text-success', bg: 'bg-success-bg' },
                { label: 'Rata-rata Waktu', value: `${avgTime} jam`, icon: Timer, color: 'text-info', bg: 'bg-info-bg' },
                { label: 'Kepuasan', value: `${satisfactionRate}%`, icon: ThumbsUp, color: 'text-warning', bg: 'bg-warning-bg' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}><item.icon className={`w-5 h-5 ${item.color}`} /></div>
                  <div><p className="text-xs text-muted-foreground">{item.label}</p><p className="text-lg font-heading font-black text-foreground">{item.value}</p></div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KepalaDinasDashboard;
