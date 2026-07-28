import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { dashboardService } from '../services/dashboardService';
import type { Complaint, StatSummary, CitizenDashboardData } from '../types';
import {
  FileText, Clock, CheckCircle2, Plus,
  Activity, BarChart3, MapPin,
  Bell, ThumbsUp, X,
} from 'lucide-react';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CitizenDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('semua');

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then((res) => setData(res as CitizenDashboardData))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats: StatSummary = data?.stats ?? { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 };
  const myReports: Complaint[] = data?.my_reports ?? [];
  const filtered = activeTab === 'semua' ? myReports : myReports.filter((c) => c.status === activeTab);

  const tabs = [
    { id: 'semua', label: 'Semua', badge: myReports.length },
    { id: 'menunggu', label: 'Menunggu', badge: stats.menunggu },
    { id: 'diproses', label: 'Diproses', badge: stats.diproses },
    { id: 'selesai', label: 'Selesai', badge: stats.selesai },
  ];

  const columns = [
    { key: 'ticket_code', header: 'Kode Tiket', width: '120px' },
    { key: 'title', header: 'Judul Laporan', width: '200px' },
    { key: 'category', header: 'Kategori', render: (item: Complaint) => item.category?.name || '-', width: '120px' },
    { key: 'created_at', header: 'Tanggal', render: (item: Complaint) => new Date(item.created_at).toLocaleDateString('id-ID'), width: '120px' },
    { key: 'status', header: 'Status', render: (item: Complaint) => <StatusBadge status={item.status} />, width: '140px' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }]} />

        {/* Hero Welcome */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Selamat Datang, Warga Baubau!
              </h1>
              <p className="text-primary-foreground/80 text-sm max-w-lg">
                Laporkan kerusakan infrastruktur dan pantau progress penanganan secara real-time.
              </p>
            </div>
            <Button
              variant="accent"
              size="lg"
              icon={Plus}
              onClick={() => navigate('/submit')}
              className="shadow-xl"
            >
              Buat Pengaduan
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
          <StatCard title="Menunggu" value={stats.menunggu} icon={Clock} variant="warning" />
          <StatCard title="Diproses" value={stats.diproses} icon={Activity} variant="info" />
          <StatCard title="Selesai" value={stats.selesai} icon={CheckCircle2} variant="success" />
          <StatCard title="Ditolak" value={stats.ditolak} icon={X} variant="danger" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Buat Pengaduan', icon: Plus, color: 'bg-primary/10 text-primary', onClick: () => navigate('/submit') },
            { label: 'Pengaduan Saya', icon: FileText, color: 'bg-info/10 text-info', onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
            { label: 'Peta Infrastruktur', icon: MapPin, color: 'bg-success/10 text-success', onClick: () => navigate('/map') },
            { label: 'Statistik', icon: BarChart3, color: 'bg-warning/10 text-warning', onClick: () => navigate('/stats') },
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

        {/* My Reports with Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Pengaduan Saya</h2>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
          </div>
          <Table
            columns={columns}
            data={filtered.slice(0, 10)}
            keyExtractor={(c) => c.id}
            loading={loading}
            emptyMessage="Belum ada laporan. Klik 'Buat Pengaduan' untuk memulai."
            rowClick={(item) => navigate(`/track?ticket=${item.ticket_code}`)}
          />
          {myReports.length > 10 && (
            <div className="text-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/track')}>
                Lihat Semua Laporan
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Aktivitas Terkini</h3>
            </div>
            {myReports.length > 0 ? (
              <div className="space-y-3">
                {myReports.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      c.status === 'selesai' ? 'bg-success' : c.status === 'diproses' ? 'bg-info' : 'bg-warning'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.ticket_code} · {new Date(c.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">Belum ada aktivitas</div>
            )}
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Notifikasi</h3>
                {data?.notifications_count ? (
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {data.notifications_count}
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada notifikasi baru
              </p>
            </Card>

            {/* Satisfaction */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Kepuasan Layanan</h3>
              </div>
              <div className="text-center py-4">
                <p className="text-3xl font-black text-primary">{stats.completion_rate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Tingkat Penyelesaian</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
