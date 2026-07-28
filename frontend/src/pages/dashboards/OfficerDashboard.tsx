import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/dashboard/LoadingSkeleton';
import { ErrorState } from '../../components/dashboard/ErrorState';
import { OfficerWelcomeHeader } from '../../components/officer/OfficerWelcomeHeader';
import { OfficerKPIGrid } from '../../components/officer/OfficerKPIGrid';
import { OfficerQuickActions } from '../../components/officer/OfficerQuickActions';
import { OfficerTaskCard } from '../../components/officer/OfficerTaskCard';
import { OfficerTaskMap } from '../../components/officer/OfficerTaskMap';
import { OfficerProgressModal } from '../../components/officer/OfficerProgressModal';
import { OfficerTaskTimeline } from '../../components/officer/OfficerTaskTimeline';
import { OfficerPerformanceChart } from '../../components/officer/OfficerPerformanceChart';
import { OfficerActivityFeed } from '../../components/officer/OfficerActivityFeed';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import type {
  Complaint, OfficerDashboardData, PerformanceDay,
} from '../../types';
import {
  ClipboardList, ArrowUpCircle, Navigation,
} from 'lucide-react';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai';

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
  const [searchFilter, setSearchFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
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

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStatusUpdated = () => setRefreshKey(k => k + 1);
  const openStatusModal = (c: Complaint) => { setSelectedComplaint(c); setModalOpen(true); };

  const openGoogleMaps = (task: Complaint) => {
    if (task.latitude && task.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(task.address + ', ' + task.subdistrict)}`, '_blank');
    }
  };

  const viewComplaintDetail = (task: Complaint) => {
    openStatusModal(task);
  };

  const completeTask = (task: Complaint) => {
    setSelectedComplaint(task);
    setModalOpen(true);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={[{ label: 'Dashboard Petugas', href: '/officer' }]} />
          <ErrorState title="Gagal Memuat Dashboard" message={error} onRetry={fetchData} variant="fullscreen" />
        </div>
      </DashboardLayout>
    );
  }

  const statsAgency = data?.stats_agency ?? { menunggu: 0, diproses: 0, selesai: 0, ditolak: 0 };
  const todaysTasks = data?.todays_tasks ?? { new_today: 0, in_progress: 0, completed_today: 0 };
  const tasks: Complaint[] = data?.assigned_tasks ?? [];
  const priority: Complaint[] = data?.priority_complaints ?? [];
  const avgTime = data?.avg_resolution_time ?? 0;
  const performanceChart: PerformanceDay[] = data?.performance_chart ?? [];
  const timeline = data?.timeline ?? [];
  const performanceScore = data?.officer_performance_score ?? 0;
  const completedThisMonth = data?.completed_this_month ?? 0;
  const welcome = data?.welcome ?? { name: user?.name || 'Petugas', date: '', time: '', greeting: 'Selamat Datang' };
  const unreadNotif = 0;

  // Filter tasks
  const filtered = tasks.filter(t => {
    const matchesTab = activeTab === 'semua' || t.status === activeTab;
    if (!searchFilter) return matchesTab;
    const q = searchFilter.toLowerCase();
    return matchesTab && (
      t.ticket_code?.toLowerCase().includes(q) ||
      t.title?.toLowerCase().includes(q) ||
      t.reporter_name?.toLowerCase().includes(q) ||
      t.subdistrict?.toLowerCase().includes(q) ||
      t.address?.toLowerCase().includes(q)
    );
  });

  const hasUnfinishedTasks = tasks.some(t => t.status !== 'selesai' && t.status !== 'ditolak');
  const firstUnfinished = tasks.find(t => t.status !== 'selesai' && t.status !== 'ditolak');
  const firstWithPhoto = tasks.find(t => t.status !== 'selesai');

  const tabs = [
    { id: 'semua' as TabId, label: 'Semua', count: tasks.length },
    { id: 'menunggu' as TabId, label: 'Menunggu', count: statsAgency.menunggu },
    { id: 'diproses' as TabId, label: 'Diproses', count: statsAgency.diproses },
    { id: 'selesai' as TabId, label: 'Selesai', count: statsAgency.selesai },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Dashboard Petugas', href: '/officer' }]} />

        {/* Welcome Header */}
        <OfficerWelcomeHeader
          welcome={welcome}
          unreadNotifications={unreadNotif}
          onSearch={setSearchFilter}
        />

        {/* KPI Grid */}
        <OfficerKPIGrid
          statsAgency={statsAgency}
          todaysTasks={todaysTasks}
          avgResolutionTime={avgTime}
          performanceScore={performanceScore}
          completedThisMonth={completedThisMonth}
          loading={loading}
        />

        {/* Quick Actions */}
        <OfficerQuickActions
          hasUnfinishedTasks={hasUnfinishedTasks}
          onStartToday={() => { if (firstUnfinished) openStatusModal(firstUnfinished); }}
          onViewMap={() => navigate('/map')}
          onViewComplaints={() => navigate('/complaints')}
          onUploadDoc={() => { if (firstWithPhoto) openStatusModal(firstWithPhoto); }}
          onViewHistory={() => {}}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Performance Chart + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <OfficerPerformanceChart
              performanceChart={performanceChart}
              performanceScore={performanceScore}
              completedThisMonth={completedThisMonth}
              loading={loading}
            />

            {/* Task Map */}
            <OfficerTaskMap
              assignedTasks={tasks.map(t => ({
                id: t.id,
                ticket_code: t.ticket_code,
                title: t.title,
                latitude: t.latitude,
                longitude: t.longitude,
                status: t.status,
                subdistrict: t.subdistrict,
                urgency: t.urgency,
                created_at: t.created_at,
              }))}
              loading={loading}
              onNavigateToLocation={(point) => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`, '_blank');
              }}
            />
          </div>

          {/* Right: Timeline + Activity */}
          <div className="space-y-6">
            <OfficerTaskTimeline timeline={timeline} loading={loading} />
            <OfficerActivityFeed activities={tasks} loading={loading} />
          </div>
        </div>

        {/* Priority Queue */}
        {!loading && priority.length > 0 && (
          <Card variant="bordered" className="border-danger/20 bg-danger/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
              <h3 className="font-heading font-bold text-danger">Prioritas Tinggi</h3>
              <span className="ml-auto text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-full font-bold">{priority.length} laporan</span>
            </div>
            <div className="space-y-2">
              {priority.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.ticket_code} · {c.subdistrict}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" icon={ArrowUpCircle} onClick={() => openStatusModal(c)}>Proses</Button>
                    <Button variant="ghost" size="sm" icon={Navigation} onClick={() => openGoogleMaps(c)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Task List */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-bold text-foreground">Daftar Tugas</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{filtered.length} item</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && <span className="ml-1 text-[10px] opacity-60">({tab.count})</span>}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={80} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">
                {searchFilter ? 'Tidak ada tugas yang cocok dengan pencarian' : 'Belum ada tugas'}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {searchFilter ? 'Coba gunakan kata kunci lain' : 'Tunggu admin menugaskan laporan ke OPD Anda'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((task) => (
                <OfficerTaskCard
                  key={task.id}
                  task={task}
                  onViewDetail={viewComplaintDetail}
                  onNavigate={openGoogleMaps}
                  onUpdate={viewComplaintDetail}
                  onComplete={completeTask}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Progress Modal */}
      {selectedComplaint && (
        <OfficerProgressModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          complaint={selectedComplaint}
          onSuccess={handleStatusUpdated}
        />
      )}
    </DashboardLayout>
  );
};

export default OfficerDashboard;
