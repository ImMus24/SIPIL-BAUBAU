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
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { DonutChart } from '../../components/charts/DonutChart';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import type { CitizenDashboardData, Complaint } from '../../types';
import {
  FileText, Clock, CheckCircle2, Plus, X,
  Activity, MapPin, Bell, ThumbsUp,
  HelpCircle, ChevronRight,
} from 'lucide-react';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<CitizenDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getCitizenDashboard();
      setData(res as CitizenDashboardData);
    } catch (err) {
      console.error('Failed to load citizen dashboard:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }]} />
        <ErrorState title="Gagal Memuat Dashboard" message={error} onRetry={fetchData} variant="fullscreen" />
      </div>
    </DashboardLayout>
  );

  const stats = data?.stats ?? { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 };
  const myReports: Complaint[] = data?.my_reports ?? [];
  const timeline = data?.timeline ?? [];
  const satisfaction = data?.satisfaction ?? { completion_rate: 0, total_completed: 0, total_reports: 0 };

  const filtered = myReports.filter((c) => {
    if (activeTab !== 'semua' && c.status !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.ticket_code.toLowerCase().includes(q) ||
        (c.subdistrict || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tabs = [
    { id: 'semua' as TabId, label: 'Semua', badge: myReports.length },
    { id: 'menunggu' as TabId, label: 'Menunggu', badge: stats.menunggu },
    { id: 'diproses' as TabId, label: 'Diproses', badge: stats.diproses },
    { id: 'selesai' as TabId, label: 'Selesai', badge: stats.selesai },
    { id: 'ditolak' as TabId, label: 'Ditolak', badge: stats.ditolak },
  ];

  const donutSeries = [stats.menunggu, stats.diproses, stats.selesai, stats.ditolak];
  const donutLabels = ['Menunggu', 'Diproses', 'Selesai', 'Ditolak'];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <Breadcrumb items={[{ label: 'Dashboard Warga', href: '/dashboard' }]} />

        {/* HERO */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Selamat Datang, {user?.name?.split(' ')[0] || 'Warga Baubau'}! 👋
              </h1>
              <p className="text-primary-foreground/80 text-sm max-w-lg leading-relaxed">
                Laporkan kerusakan infrastruktur dan pantau progress penanganan secara real-time.
                Setiap laporan Anda akan ditindaklanjuti oleh OPD terkait.
              </p>
            </div>
            <Button variant="accent" size="lg" icon={Plus} onClick={() => navigate('/submit')} className="shadow-xl shrink-0">
              Buat Pengaduan
            </Button>
          </div>
        </div>

        {/* KPI */}
        {loading ? (
          <Skeleton.KPIGrid count={5} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Total Pengaduan" value={stats.total} icon={FileText} variant="primary" subtitle="Semua laporan" />
            <StatCard title="Sedang Diverifikasi" value={stats.menunggu} icon={Clock} variant="warning" subtitle="Menunggu verifikasi" />
            <StatCard title="Sedang Diproses" value={stats.diproses} icon={Activity} variant="info" subtitle="Ditangani OPD" />
            <StatCard title="Selesai" value={stats.selesai} icon={CheckCircle2} variant="success" subtitle="Telah ditangani" />
            <StatCard title="Ditolak" value={stats.ditolak} icon={X} variant="danger" subtitle="Tidak memenuhi syarat" />
          </div>
        )}

        {/* Quick Actions */}
        {!loading && (
          <div>
            <h2 className="font-heading font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-muted-foreground">
              Aksi Cepat
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickActionCard label="Buat Pengaduan" description="Laporkan kerusakan infrastruktur" icon={Plus} color="bg-primary/10 text-primary" onClick={() => navigate('/submit')} />
              <QuickActionCard label="Pengaduan Saya" description="Lihat semua laporan Anda" icon={FileText} color="bg-info/10 text-info" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} />
              <QuickActionCard label="Peta Infrastruktur" description="Lihat sebaran laporan di peta" icon={MapPin} color="bg-success/10 text-success" onClick={() => navigate('/map')} />
              <QuickActionCard label="FAQ & Bantuan" description="Panduan penggunaan sistem" icon={HelpCircle} color="bg-warning/10 text-warning" onClick={() => navigate('/faq')} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* My Reports */}
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className="font-heading text-lg font-bold text-foreground">Pengaduan Saya</h2>
                <input
                  type="text" placeholder="Cari berdasarkan tiket, judul..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 sm:w-48 h-9 px-3 rounded-xl bg-accent border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                    {tab.label}
                    {tab.badge > 0 && <span className="ml-1.5 text-[10px] opacity-60">({tab.badge})</span>}
                  </button>
                ))}
              </div>
              {loading ? (
                <Skeleton.Table rows={4} cols={3} />
              ) : filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{searchQuery ? 'Tidak ada laporan yang cocok.' : 'Belum ada laporan.'}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filtered.slice(0, 10).map((report) => (
                    <div key={report.id} onClick={() => navigate(`/track?ticket=${report.ticket_code}`)}
                      className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{report.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-muted-foreground font-mono">{report.ticket_code}</span>
                            <span className="text-[11px] text-muted-foreground">·</span>
                            <span className="text-[11px] text-muted-foreground">{report.subdistrict}</span>
                            <span className="text-[11px] text-muted-foreground">·</span>
                            <span className="text-[11px] text-muted-foreground">{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={report.status} size="sm" />
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filtered.length > 10 && (
                <div className="mt-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/track')}>Lihat Semua Laporan</Button>
                </div>
              )}
            </Card>

            {/* Donut Chart */}
            <Card>
              <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Statistik Pengaduan
              </h2>
              {loading ? (
                <Skeleton.Chart />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DonutChart series={donutSeries} labels={donutLabels} height={250} colors={['#f59e0b', '#3b82f6', '#22c55e', '#ef4444']} title="Status Laporan" />
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground">Rincian</h4>
                    {[
                      { label: 'Total Laporan', value: stats.total, color: 'text-primary' },
                      { label: 'Tingkat Penyelesaian', value: `${stats.completion_rate}%`, color: 'text-success' },
                      { label: 'Selesai', value: stats.selesai, color: 'text-success' },
                      { label: 'Sedang Diproses', value: stats.diproses, color: 'text-info' },
                      { label: 'Menunggu', value: stats.menunggu, color: 'text-warning' },
                      { label: 'Ditolak', value: stats.ditolak, color: 'text-danger' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Aktivitas Terkini</h3>
              </div>
              <ActivityFeed items={timeline.slice(0, 8).map((t) => ({
                id: `${t.complaint_id}-${t.created_at}`,
                title: t.title || `Status: ${t.status}`,
                description: `${t.ticket_code} · ${t.updated_by || 'Sistem'}`,
                time: new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                status: t.status,
              }))} loading={loading} emptyMessage="Belum ada aktivitas." />
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Notifikasi</h3>
                {data?.notifications_count ? (
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{data.notifications_count} baru</span>
                ) : null}
              </div>
              {data && data.notifications_count > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ada {data.notifications_count} notifikasi belum dibaca.</p>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>Lihat Notifikasi</Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Tidak ada notifikasi baru</p>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Kepuasan Layanan</h3>
              </div>
              <div className="text-center py-4">
                <div className="text-5xl font-black text-primary">{satisfaction.completion_rate}%</div>
                <p className="text-sm text-muted-foreground mt-2">Tingkat Penyelesaian</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Laporan Selesai</span>
                    <span className="font-bold text-success">{satisfaction.total_completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Laporan Anda</span>
                    <span className="font-bold text-foreground">{satisfaction.total_reports}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Jelajahi
              </h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/map')} className="w-full text-left p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-semibold text-foreground">Peta Infrastruktur</p>
                  <p className="text-xs text-muted-foreground">Lihat semua laporan di peta</p>
                </button>
                <button onClick={() => navigate('/stats')} className="w-full text-left p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-semibold text-foreground">Statistik Kota</p>
                  <p className="text-xs text-muted-foreground">Data pengaduan seluruh Baubau</p>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
