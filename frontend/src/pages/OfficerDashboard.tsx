import React, { useEffect, useState } from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Activity, Calendar, MapPin, ArrowUpCircle, Timer } from 'lucide-react';
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
import type { Complaint, OfficerDashboardData, AgencyStats, TodaysTasks } from '../types';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

export const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OfficerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('semua');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    dashboardService
      .getDashboard()
      .then((res) => setData(res as OfficerDashboardData))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleStatusUpdated = () => setRefreshKey((k) => k + 1);
  const openStatusModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const statsAgency: AgencyStats = data?.stats_agency ?? { menunggu: 0, diproses: 0, selesai: 0, ditolak: 0 };
  const todaysTasks: TodaysTasks = data?.todays_tasks ?? { new_today: 0, in_progress: 0, completed_today: 0 };
  const tasks = data?.assigned_tasks ?? [];
  const priority = data?.priority_complaints ?? [];
  const avgTime = data?.avg_resolution_time ?? 0;

  const filtered = activeTab === 'semua' ? tasks : tasks.filter((c: Complaint) => c.status === activeTab);

  const tabs = [
    { id: 'semua', label: 'Semua', badge: tasks.length },
    { id: 'menunggu', label: 'Menunggu', badge: statsAgency.menunggu },
    { id: 'diproses', label: 'Diproses', badge: statsAgency.diproses },
    { id: 'selesai', label: 'Selesai', badge: statsAgency.selesai },
    { id: 'ditolak', label: 'Ditolak', badge: statsAgency.ditolak },
  ];

  const columns = [
    { key: 'ticket_code', header: 'Tiket', width: '110px' },
    {
      key: 'title',
      header: 'Judul Tugas',
      render: (item: Complaint) => (
        <div>
          <p className="font-semibold text-foreground">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.subdistrict}</p>
        </div>
      ),
    },
    {
      key: 'reporter_name',
      header: 'Pelapor',
      width: '120px',
    },
    {
      key: 'created_at',
      header: 'Diterima',
      render: (item: Complaint) => new Date(item.created_at).toLocaleDateString('id-ID'),
      width: '110px',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Complaint) => <StatusBadge status={item.status} />,
      width: '120px',
    },
    {
      key: 'actions',
      header: 'Aksi',
      width: '90px',
      render: (item: Complaint) => {
        if (item.status === 'selesai' || item.status === 'ditolak') return <span className="text-xs text-muted-foreground">-</span>;
        return (
          <Button
            variant="accent"
            size="lg"
            icon={ArrowUpCircle}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); openStatusModal(item); }}
          >
            Update
          </Button>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Dashboard Petugas', href: '/officer' }]} />

        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground">Dashboard Petugas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau dan kelola tugas penanganan laporan infrastruktur
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Tugas Baru (Hari Ini)" value={todaysTasks.new_today} icon={ClipboardList} variant="primary" />
          <StatCard title="Sedang Diproses" value={statsAgency.diproses} icon={Clock} variant="info" />
          <StatCard title="Selesai" value={statsAgency.selesai} icon={CheckCircle2} variant="success" />
          <StatCard title="Menunggu" value={statsAgency.menunggu} icon={AlertTriangle} variant="warning" />
          <StatCard title="Rata-rata Waktu" value={`${avgTime} jam`} icon={Timer} variant="default" />
        </div>

        {/* Today's Progress + Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Progress Hari Ini</h3>
            </div>
            <div className="flex items-center justify-around h-20">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-black text-primary">{todaysTasks.new_today}</p>
                <p className="text-xs text-muted-foreground mt-1">Baru</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex flex-col items-center">
                <p className="text-3xl font-black text-info">{todaysTasks.in_progress}</p>
                <p className="text-xs text-muted-foreground mt-1">Diproses</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex flex-col items-center">
                <p className="text-3xl font-black text-success">{todaysTasks.completed_today}</p>
                <p className="text-xs text-muted-foreground mt-1">Selesai</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Ringkasan</h3>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Total Tugas', value: tasks.length, color: 'text-foreground' },
                { label: 'Prioritas Tinggi', value: priority.length, color: 'text-danger' },
                { label: 'Rata-rata Waktu', value: `${avgTime} jam`, color: 'text-info' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className={`font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Priority Complaints */}
        {priority.length > 0 && (
          <Card variant="bordered" className="border-danger/20 bg-danger/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h3 className="font-heading font-bold text-danger">Prioritas Tinggi</h3>
              <span className="ml-auto text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-full font-bold">
                {priority.length} laporan
              </span>
            </div>
            <div className="space-y-2">
              {priority.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.ticket_code} · {c.subdistrict}</p>
                  </div>
                  <UrgencyBadge urgency={c.urgency} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Buka Google Maps', icon: MapPin, color: 'bg-success/10 text-success', onClick: () => window.open('https://maps.google.com', '_blank') },
            { label: 'Update Progress', icon: ArrowUpCircle, color: 'bg-primary/10 text-primary', onClick: () => tasks.length > 0 && openStatusModal(tasks[0]) },
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs + Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
          </div>
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={(c: Complaint) => c.id}
            loading={loading}
            emptyMessage="Belum ada tugas yang ditugaskan ke OPD Anda."
            rowClick={(item: Complaint) => navigate(`/track?ticket=${item.ticket_code}`)}
          />
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

export default OfficerDashboard;
