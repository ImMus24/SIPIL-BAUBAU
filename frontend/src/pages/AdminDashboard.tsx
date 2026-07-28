import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { StatusBadge, UrgencyBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { StatusUpdateModal } from '../components/ui/StatusUpdateModal';
import { dashboardService } from '../services/dashboardService';
import type {
  Complaint, StatSummary, AdminDashboardData,
  MonthlyTrend, AgencyPerformance, CategoryStat,
  SubdistrictStat, OfficerRanking, UserSummary,
} from '../types';
import {
  FileText, Clock, CheckCircle2, AlertTriangle,
  Activity, Users, TrendingUp, Download, Filter,
  Building2, ArrowUpCircle, UserCheck, BarChart3,
  PieChart, Award,
} from 'lucide-react';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('semua');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .getDashboard()
      .then((res) => setData(res as AdminDashboardData))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleStatusUpdated = () => setRefreshKey((k) => k + 1);
  const openStatusModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const stats: StatSummary = data?.stats ?? { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 };
  const reports: Complaint[] = data?.recent_reports ?? [];
  const trends: MonthlyTrend[] = data?.monthly_trend ?? [];
  const agencyPerf: AgencyPerformance[] = data?.agency_performance ?? [];
  const verification: Complaint[] = data?.verification_queue ?? [];
  const userSummary: UserSummary = data?.user_summary ?? { total: 0, officers: 0, citizens: 0 };
  const topCategories: CategoryStat[] = data?.top_categories ?? [];
  const topSubdistricts: SubdistrictStat[] = data?.top_subdistricts ?? [];
  const officerRanking: OfficerRanking[] = data?.officer_ranking ?? [];

  const filtered = activeTab === 'semua' ? reports : reports.filter((c) => c.status === activeTab);
  const maxTrend = Math.max(...trends.map((t) => t.total), 1);
  const maxCategory = Math.max(...topCategories.map((c) => c.count), 1);

  const tabs = [
    { id: 'semua', label: 'Semua', badge: stats.total },
    { id: 'menunggu', label: 'Menunggu', badge: stats.menunggu },
    { id: 'diproses', label: 'Diproses', badge: stats.diproses },
    { id: 'selesai', label: 'Selesai', badge: stats.selesai },
  ];

  const columns = [
    { key: 'ticket_code', header: 'Tiket', width: '110px' },
    { key: 'title', header: 'Judul', render: (item: Complaint) => (
      <div>
        <p className="font-semibold text-foreground">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.subdistrict}</p>
      </div>
    )},
    { key: 'category', header: 'Kategori', render: (item: Complaint) => item.category?.name || '-', width: '120px' },
    { key: 'reporter_name', header: 'Pelapor', width: '120px' },
    { key: 'urgency', header: 'Urgensi', render: (item: Complaint) => <UrgencyBadge urgency={item.urgency} />, width: '100px' },
    { key: 'created_at', header: 'Tanggal', render: (item: Complaint) => new Date(item.created_at).toLocaleDateString('id-ID'), width: '110px' },
    { key: 'status', header: 'Status', render: (item: Complaint) => <StatusBadge status={item.status} />, width: '120px' },
    {
      key: 'actions', header: 'Aksi', width: '100px',
      render: (item: Complaint) => {
        if (item.status === 'selesai' || item.status === 'ditolak') return <span className="text-xs text-muted-foreground">-</span>;
        return (
          <Button variant="ghost" size="sm" icon={ArrowUpCircle}
            onClick={(e) => { e.stopPropagation(); openStatusModal(item); }}
          >Update</Button>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Dashboard Admin', href: '/admin' }]} />

        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground">Dashboard Administrator</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola seluruh sistem pengaduan infrastruktur Kota Baubau</p>
        </div>

        {/* KPI — 7 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
          <StatCard title="Menunggu" value={stats.menunggu} icon={AlertTriangle} variant="warning" />
          <StatCard title="Diproses" value={stats.diproses} icon={Clock} variant="info" />
          <StatCard title="Selesai" value={stats.selesai} icon={CheckCircle2} variant="success" />
          <StatCard title="Ditolak" value={stats.ditolak} icon={FileText} variant="danger" />
          <StatCard title="Pengguna" value={userSummary.total} icon={Users} variant="default" />
          <StatCard title="Petugas" value={userSummary.officers} icon={UserCheck} variant="default" />
        </div>

        {/* Verification Queue */}
        {verification.length > 0 && (
          <Card variant="bordered" className="border-warning/20 bg-warning/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-heading font-bold text-warning">Antrian Verifikasi</h3>
              <span className="ml-auto text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold">
                {verification.length} menunggu
              </span>
            </div>
            <div className="space-y-2">
              {verification.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.ticket_code} · {c.subdistrict} · {c.reporter_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <UrgencyBadge urgency={c.urgency} />
                    <Button variant="ghost" size="sm" icon={ArrowUpCircle} onClick={() => openStatusModal(c)}>
                      Proses
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Monthly Trend Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-foreground">Tren Bulanan</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {trends.map((t) => (
              <div key={t.month} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[10px] font-bold text-success">{t.resolved}</span>
                <div
                  className="w-full rounded-t-lg bg-success/40 transition-all"
                  style={{ height: `${(t.resolved / maxTrend) * 100}%` }}
                />
                <div
                  className="w-full rounded-b-lg bg-primary/30 transition-all"
                  style={{ height: `${((t.total - t.resolved) / maxTrend) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                  {t.label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary/30" />Total</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success/40" />Selesai</div>
          </div>
        </Card>

        {/* Tabs + Actions + Table */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
            <Button variant="outline" size="sm" icon={Download}>Ekspor</Button>
          </div>
        </div>
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(c) => c.id}
          loading={loading}
          emptyMessage="Tidak ada laporan."
          rowClick={(item) => navigate(`/track?ticket=${item.ticket_code}`)}
        />

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Kategori Teratas</h3>
            </div>
            {topCategories.length > 0 ? (
              <div className="space-y-3">
                {topCategories.map((cat) => (
                  <div key={cat.category_name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{cat.category_name}</span>
                      <span className="text-muted-foreground">{cat.count} laporan</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary/40" style={{ width: `${(cat.count / maxCategory) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>
            )}
          </Card>

          {/* Top Subdistricts */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Kecamatan Teratas</h3>
            </div>
            {topSubdistricts.length > 0 ? (
              <div className="space-y-3">
                {topSubdistricts.map((sd) => (
                  <div key={sd.subdistrict} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="font-medium text-foreground text-sm">{sd.subdistrict}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{sd.count} laporan</span>
                      <span className="text-success font-semibold">{sd.resolved} selesai</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>
            )}
          </Card>
        </div>

        {/* Officer Ranking */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-foreground">Ranking Petugas</h3>
          </div>
          <Card>
            {officerRanking.length > 0 ? (
              <div className="divide-y divide-border">
                {officerRanking.map((o, idx) => (
                  <div key={o.officer_id} className="flex items-center gap-4 p-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-warning/20 text-warning' : idx === 1 ? 'bg-muted text-muted-foreground' : idx === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-muted text-muted-foreground'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{o.officer_name}</p>
                      <p className="text-xs text-muted-foreground">{o.agency_name}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-bold text-success">{o.completed}</p>
                      <p className="text-xs text-muted-foreground">selesai</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Belum ada data ranking</p>
            )}
          </Card>
        </div>

        {/* Agency Performance */}
        {agencyPerf.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Kinerja OPD</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencyPerf.slice(0, 6).map((a) => (
                <Card key={a.agency_name} variant="bordered" className="border-border">
                  <p className="font-bold text-foreground text-sm">{a.agency_name}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">Total: <strong className="text-foreground">{a.total}</strong></span>
                    <span className="text-muted-foreground">Selesai: <strong className="text-success">{a.resolved}</strong></span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${a.completion_rate >= 70 ? 'bg-success' : a.completion_rate >= 40 ? 'bg-warning' : 'bg-danger'}`}
                      style={{ width: `${a.completion_rate}%` }} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Aktivitas Terbaru</h3>
            </div>
            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      c.status === 'selesai' ? 'bg-success' : c.status === 'diproses' ? 'bg-info' : 'bg-warning'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.reporter_name} · {c.subdistrict}</p>
                    </div>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas</p>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Ringkasan Sistem</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Total Pengguna', value: userSummary.total, color: 'text-primary' },
                { label: 'Petugas Aktif', value: data?.active_officers ?? 0, color: 'text-info' },
                { label: 'Total Warga', value: userSummary.citizens, color: 'text-muted-foreground' },
                { label: 'OPD Terlibat', value: agencyPerf.length, color: 'text-success' },
                { label: 'Tingkat Penyelesaian', value: `${stats.completion_rate}%`, color: 'text-success' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className={`font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedComplaint && (
        <StatusUpdateModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          complaint={selectedComplaint}
          onSuccess={handleStatusUpdated}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
