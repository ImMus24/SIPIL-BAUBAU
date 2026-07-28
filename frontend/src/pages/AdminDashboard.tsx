import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { StatusBadge, UrgencyBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Users,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('semua');
  const [stats, setStats] = useState<StatSummary>({ total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 });

  useEffect(() => {
    Promise.all([
      complaintService.getComplaints(),
      complaintService.getStatsSummary(),
    ])
      .then(([c, s]) => {
        setComplaints(c);
        setStats(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'semua' ? complaints : complaints.filter((c) => c.status === activeTab);

  const tabs = [
    { id: 'semua', label: 'Semua', badge: stats.total },
    { id: 'menunggu', label: 'Menunggu', badge: stats.menunggu },
    { id: 'diproses', label: 'Diproses', badge: stats.diproses },
    { id: 'selesai', label: 'Selesai', badge: stats.selesai },
  ];

  const columns = [
    { key: 'ticket_code', header: 'Tiket', width: '110px' },
    { key: 'title', header: 'Judul Laporan', render: (item: Complaint) => (
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
  ];

  return (
    <DashboardLayout title="Dashboard Admin" subtitle="Kelola dan pantau seluruh laporan infrastruktur" role="admin">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
          <StatCard title="Diproses" value={stats.diproses} icon={Clock} variant="info" />
          <StatCard title="Selesai" value={stats.selesai} icon={CheckCircle2} variant="success" trend={{ value: `${stats.completion_rate}%`, up: true }} />
          <StatCard title="Menunggu" value={stats.menunggu} icon={AlertTriangle} variant="warning" />
          <StatCard title="Petugas Aktif" value={12} icon={Users} variant="default" />
        </div>

        {/* Tabs + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
            <Button variant="outline" size="sm" icon={Download}>Ekspor</Button>
          </div>
        </div>

        {/* Data Table */}
        <Table
          columns={columns}
          data={filtered}
          keyExtractor={(c) => c.id}
          loading={loading}
          emptyMessage="Tidak ada laporan untuk status ini."
          rowClick={(item) => navigate(`/track?ticket=${item.ticket_code}`)}
        />

        {/* Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Aktivitas Terbaru</h3>
            </div>
            <div className="space-y-3">
              {complaints.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    c.status === 'selesai' ? 'bg-success' : c.status === 'diproses' ? 'bg-info' : 'bg-warning'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.reporter_name} · {c.subdistrict}</p>
                  </div>
                  <StatusBadge status={c.status} size="sm" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Tren Mingguan</h3>
            </div>
            <div className="flex items-end justify-around h-32 gap-2">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-lg bg-primary/30 transition-all"
                    style={{ height: `${20 + Math.random() * 80}px` }}
                  />
                  <span className="text-[10px] font-medium text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
