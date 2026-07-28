import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import type { HeadOfAgencyDashboardData, Complaint, MonthlyTrend, AgencyPerformance, TopOfficer, CategoryStat, YearlyTrend } from '../types';
import {
  FileText, Clock, CheckCircle2,
  Building2, BarChart3, Award, Download,
  PieChart, Timer, ThumbsUp, Activity,
} from 'lucide-react';

export const KepalaDinasDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<HeadOfAgencyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then((res) => setData(res as HeadOfAgencyDashboardData))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats ?? { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 };
  const trends: MonthlyTrend[] = data?.monthly_trend ?? [];
  const agencyPerf: AgencyPerformance[] = data?.agency_performance ?? [];
  const reports: Complaint[] = data?.recent_reports ?? [];
  const topOfficers: TopOfficer[] = data?.top_officers ?? [];
  const topCategories: CategoryStat[] = data?.top_categories ?? [];
  const yearlyTrend: YearlyTrend[] = data?.yearly_trend ?? [];
  const avgTime = data?.avg_resolution_time ?? 0;

  const maxTrendValue = Math.max(...trends.map((t) => t.total), 1);
  const maxYearly = Math.max(...yearlyTrend.map((y) => y.total), 1);
  const maxCategoryValue = Math.max(...topCategories.map((c) => c.count), 1);

  const reportColumns = [
    { key: 'ticket_code', header: 'Tiket', width: '110px' },
    { key: 'title', header: 'Judul Laporan', render: (item: Complaint) => (
      <div>
        <p className="font-semibold text-foreground">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.subdistrict}</p>
      </div>
    )},
    { key: 'category', header: 'Kategori', render: (item: Complaint) => item.category?.name || '-', width: '120px' },
    { key: 'created_at', header: 'Tanggal', render: (item: Complaint) => new Date(item.created_at).toLocaleDateString('id-ID'), width: '110px' },
    { key: 'status', header: 'Status', render: (item: Complaint) => <StatusBadge status={item.status} />, width: '120px' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Dashboard Monitoring', href: '/kepala-dinas' }]} />

        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground">Dashboard Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selamat datang, {user?.name} — Pantau kinerja penanganan laporan infrastruktur Kota Baubau
          </p>
        </div>

        {/* Executive KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
          <StatCard title="Tingkat Penyelesaian" value={`${stats.completion_rate}%`} icon={CheckCircle2} variant="success" />
          <StatCard title="Rata-rata Waktu" value={`${avgTime} jam`} icon={Timer} variant="info" />
          <StatCard title="Diproses" value={stats.diproses} icon={Clock} variant="warning" />
          <StatCard title="Kepuasan" value="—" icon={ThumbsUp} variant="default" />
        </div>

        {/* Yearly Trend */}
        {yearlyTrend.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Tren Tahunan</h3>
            </div>
            <div className="flex items-end justify-between gap-4 h-36">
              {yearlyTrend.map((y) => (
                <div key={y.year} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] font-bold text-success">{y.resolved}</span>
                  <div
                    className="w-full rounded-t-lg bg-success/40 transition-all"
                    style={{ height: `${(y.resolved / maxYearly) * 100}%` }}
                  />
                  <div
                    className="w-full rounded-b-lg bg-primary/30 transition-all"
                    style={{ height: `${((y.total - y.resolved) / maxYearly) * 100}%` }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">{y.year}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary/30" />Total</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success/40" />Selesai</div>
            </div>
          </Card>
        )}

        {/* Monthly Trend */}
        {trends.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Tren Bulanan (12 Bulan)</h3>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {trends.map((t) => (
                <div key={t.month} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-success">{t.resolved}</span>
                  <div
                    className="w-full rounded-t-lg bg-success/60 transition-all"
                    style={{ height: `${(t.resolved / maxTrendValue) * 100}%` }}
                  />
                  <div
                    className="w-full rounded-b-lg bg-primary/40 transition-all"
                    style={{ height: `${((t.total - t.resolved) / maxTrendValue) * 100}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {t.label.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary/40" />Total</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success/60" />Selesai</div>
            </div>
          </Card>
        )}

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Kategori Laporan</h3>
            </div>
            <div className="space-y-3">
              {topCategories.map((cat) => (
                <div key={cat.category_name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{cat.category_name}</span>
                    <span className="text-muted-foreground">{cat.count} laporan</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary/40" style={{ width: `${(cat.count / maxCategoryValue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Agency Performance */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-foreground">Kinerja OPD</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agencyPerf.slice(0, 9).map((a) => (
              <Card key={a.agency_name} variant="bordered" className="border-border">
                <p className="font-bold text-foreground text-sm">{a.agency_name}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-muted-foreground">Total: <strong className="text-foreground">{a.total}</strong></span>
                  <span className="text-muted-foreground">Selesai: <strong className="text-success">{a.resolved}</strong></span>
                  <span className="text-xs font-bold">{a.completion_rate}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${a.completion_rate >= 70 ? 'bg-success' : a.completion_rate >= 40 ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: `${a.completion_rate}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Officers Ranking */}
        {topOfficers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Performa Petugas</h3>
            </div>
            <Card>
              <div className="divide-y divide-border">
                {topOfficers.map((o, idx) => (
                  <div key={o.officer_id} className="flex items-center gap-4 p-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                    }`}>{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{o.officer_name}</p>
                      <p className="text-xs text-muted-foreground">{o.agency_name}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-bold text-success">{o.completed}</p>
                      <p className="text-xs text-muted-foreground">selesai dari {o.total_handled}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Recent Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-foreground">Laporan Terbaru</h3>
          </div>
          <Table
            columns={reportColumns}
            data={reports}
            keyExtractor={(c: Complaint) => c.id}
            loading={loading}
            emptyMessage="Belum ada laporan masuk."
            rowClick={(item: Complaint) => navigate(`/track?ticket=${item.ticket_code}`)}
          />
        </div>

        {/* Export */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" icon={Download}>Ekspor PDF</Button>
          <Button variant="outline" icon={Download}>Ekspor Excel</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KepalaDinasDashboard;
