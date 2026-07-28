import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { StatusUpdateModal } from '../../components/ui/StatusUpdateModal';
import { Skeleton } from '../../components/dashboard/LoadingSkeleton';
import { ErrorState } from '../../components/dashboard/ErrorState';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';
import { AreaChart } from '../../components/charts/AreaChart';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import type { Complaint, OfficerDashboardData, PerformanceDay, AssignmentHistoryItem } from '../../types';
import {
  ClipboardList, Clock, CheckCircle2, AlertTriangle,
  Activity, Calendar, MapPin, ArrowUpCircle, Timer,
  Camera, ChevronRight, ListChecks, TrendingUp, Award,
} from 'lucide-react';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

export const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<OfficerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('semua');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await dashboardService.getOfficerDashboard();
      setData(res as OfficerDashboardData);
    } catch (err) {
      console.error('Failed to load officer dashboard:', err);
      setError('Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData, refreshKey]);

  if (error) return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={[{ label: 'Dashboard Petugas', href: '/officer' }]} />
        <ErrorState title="Gagal Memuat Dashboard" message={error} onRetry={fetchData} variant="fullscreen" />
      </div>
    </DashboardLayout>
  );

  const handleStatusUpdated = () => setRefreshKey((k) => k + 1);
  const openStatusModal = (c: Complaint) => { setSelectedComplaint(c); setModalOpen(true); };

  const statsAgency = data?.stats_agency ?? { menunggu: 0, diproses: 0, selesai: 0, ditolak: 0 };
  const todaysTasks = data?.todays_tasks ?? { new_today: 0, in_progress: 0, completed_today: 0 };
  const tasks: Complaint[] = data?.assigned_tasks ?? [];
  const priority: Complaint[] = data?.priority_complaints ?? [];
  const avgTime = data?.avg_resolution_time ?? 0;
  const performanceChart: PerformanceDay[] = data?.performance_chart ?? [];
  const assignmentHistory: AssignmentHistoryItem[] = data?.assignment_history ?? [];

  const filtered = activeTab === 'semua' ? tasks : tasks.filter((c) => c.status === activeTab);
  const totalHandled = statsAgency.selesai + statsAgency.diproses + statsAgency.ditolak;

  const tabs = [
    { id: 'semua' as TabId, label: 'Semua', badge: tasks.length },
    { id: 'menunggu' as TabId, label: 'Menunggu', badge: statsAgency.menunggu },
    { id: 'diproses' as TabId, label: 'Diproses', badge: statsAgency.diproses },
    { id: 'selesai' as TabId, label: 'Selesai', badge: statsAgency.selesai },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <Breadcrumb items={[{ label: 'Dashboard Petugas', href: '/officer' }]} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-black text-foreground">Dashboard Petugas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selamat datang, {user?.name?.split(' ')[0]} — Pantau dan kelola tugas penanganan laporan
            </p>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {loading ? <Skeleton.KPIGrid count={5} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Ditugaskan Hari Ini" value={todaysTasks.new_today} icon={ClipboardList} variant="primary" />
            <StatCard title="Sedang Diproses" value={statsAgency.diproses} icon={Clock} variant="info" />
            <StatCard title="Selesai" value={statsAgency.selesai} icon={CheckCircle2} variant="success" />
            <StatCard title="Rata-rata Waktu" value={`${avgTime} jam`} icon={Timer} variant="default" />
            <StatCard title="Total Ditangani" value={totalHandled} icon={TrendingUp} variant="primary" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Progress Hari Ini</h3>
            </div>
            {loading ? <Skeleton variant="rectangular" height={80} /> : (
              <div className="flex items-center justify-around h-24">
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-black text-primary">{todaysTasks.new_today}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">Tugas Baru</p>
                </div>
                <div className="w-px h-16 bg-border" />
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-black text-info">{todaysTasks.in_progress}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">Sedang Diproses</p>
                </div>
                <div className="w-px h-16 bg-border" />
                <div className="flex flex-col items-center">
                  <p className="text-3xl font-black text-success">{todaysTasks.completed_today}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">Selesai Hari Ini</p>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Ringkasan Tugas</h3>
            </div>
            {loading ? <Skeleton variant="text" count={3} /> : (
              <div className="space-y-3">
                {[
                  { label: 'Total Tugas', value: tasks.length, color: 'text-foreground' },
                  { label: 'Prioritas Tinggi', value: priority.length, color: 'text-danger' },
                  { label: 'Rata-rata Waktu', value: `${avgTime} jam`, color: 'text-info' },
                  { label: 'Ditangani Hari Ini', value: todaysTasks.new_today + todaysTasks.completed_today, color: 'text-success' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {!loading && priority.length > 0 && (
          <Card variant="bordered" className="border-danger/20 bg-danger/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h3 className="font-heading font-bold text-danger">Prioritas Tinggi</h3>
              <span className="ml-auto text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-full font-bold">{priority.length} laporan</span>
            </div>
            <div className="space-y-2">
              {priority.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.ticket_code} · {c.subdistrict}</p>
                  </div>
                  <div className="flex items-center gap-2"><UrgencyBadge urgency={c.urgency} /><Button variant="ghost" size="sm" icon={ArrowUpCircle} onClick={() => openStatusModal(c)}>Proses</Button></div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {!loading && performanceChart.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Performa 7 Hari Terakhir</h3></div>
            <AreaChart series={[{ name: 'Selesai', data: performanceChart.map((d) => d.completed) }, { name: 'Baru', data: performanceChart.map((d) => d.new) }]} categories={performanceChart.map((d) => d.label)} height={250} colors={['#22c55e', '#3b82f6']} />
          </Card>
        )}

        {!loading && (
          <div>
            <h2 className="font-heading font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-muted-foreground">Aksi Cepat</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickActionCard label="Buka Google Maps" description="Navigasi ke lokasi" icon={MapPin} color="bg-success/10 text-success" onClick={() => window.open('https://maps.google.com', '_blank')} />
              <QuickActionCard label="Update Progress" description="Perbarui status" icon={ArrowUpCircle} color="bg-primary/10 text-primary" onClick={() => { const t = tasks.find(c => c.status !== 'selesai' && c.status !== 'ditolak'); if (t) openStatusModal(t); }} />
              <QuickActionCard label="Upload Foto" description="Dokumentasi" icon={Camera} color="bg-info/10 text-info" onClick={() => { const t = tasks.find(c => c.status !== 'selesai'); if (t) openStatusModal(t); }} />
              <QuickActionCard label="Peta Tugas" description="Lihat sebaran tugas" icon={MapPin} color="bg-warning/10 text-warning" onClick={() => navigate('/map')} />
            </div>
          </div>
        )}

        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Daftar Tugas</h2>
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}>
                  {tab.label}{tab.badge > 0 && <span className="ml-1 text-[10px] opacity-60">({tab.badge})</span>}
                </button>
              ))}
            </div>
          </div>
          {loading ? <Skeleton.Table rows={5} cols={4} /> : filtered.length === 0 ? (
            <div className="py-8 text-center"><ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Belum ada tugas.</p></div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors group">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><ClipboardList className="w-5 h-5 text-muted-foreground" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[11px] text-muted-foreground font-mono">{task.ticket_code}</span>
                        <span className="text-[11px] text-muted-foreground">·</span>
                        <span className="text-[11px] text-muted-foreground">{task.subdistrict}</span>
                        <span className="text-[11px] text-muted-foreground">·</span>
                        <span className="text-[11px] text-muted-foreground">{task.reporter_name}</span>
                        {task.urgency && <><span className="text-[11px] text-muted-foreground">·</span><UrgencyBadge urgency={task.urgency} /></>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={task.status} size="sm" />
                    {task.status !== 'selesai' && task.status !== 'ditolak' ? (
                      <Button variant="accent" size="sm" icon={ArrowUpCircle} onClick={(e) => { e.stopPropagation(); openStatusModal(task); }}>Update</Button>
                    ) : null}
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {!loading && assignmentHistory.length > 0 && (
          <Card>
            <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Riwayat Penugasan</h3></div>
            <div className="space-y-2">
              {assignmentHistory.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.ticket_code} · {item.category_name}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
      {selectedComplaint && <StatusUpdateModal open={modalOpen} onClose={() => setModalOpen(false)} complaint={selectedComplaint} onSuccess={handleStatusUpdated} />}
    </DashboardLayout>
  );
};

export default OfficerDashboard;
