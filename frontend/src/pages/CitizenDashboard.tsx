import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Activity,
  BarChart3,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
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
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
          <StatCard title="Diproses" value={stats.diproses} icon={Clock} variant="info" />
          <StatCard title="Selesai" value={stats.selesai} icon={CheckCircle2} variant="success" />
          <StatCard title="Menunggu" value={stats.menunggu} icon={AlertTriangle} variant="warning" />
        </div>

        {/* Quick Action */}
        <Card variant="bordered" className="border-primary/20 bg-primary-light/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-foreground text-lg">Ada kerusakan infrastruktur?</h3>
              <p className="text-sm text-muted-foreground">Laporkan sekarang dan pantau progress penanganannya</p>
            </div>
            <Button icon={Plus} onClick={() => navigate('/submit')}>
              Buat Laporan Baru
            </Button>
          </div>
        </Card>

        {/* Recent Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-foreground">Laporan Terbaru</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/track')}>
              Lihat Semua
            </Button>
          </div>
          <Table
            columns={columns}
            data={complaints.slice(0, 10)}
            keyExtractor={(c) => c.id}
            loading={loading}
            emptyMessage="Belum ada laporan. Klik 'Buat Laporan Baru' untuk memulai."
            rowClick={(item) => navigate(`/track?ticket=${item.ticket_code}`)}
          />
        </div>

        {/* Activity & Map Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Aktivitas Terkini</h3>
            </div>
            {complaints.length > 0 ? (
              <div className="space-y-3">
                {complaints.slice(0, 5).map((c) => (
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
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas</p>
            )}
          </Card>

          {/* Stats */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Statistik Cepat</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Tingkat Penyelesaian', value: `${stats.completion_rate}%`, color: 'bg-success' },
                { label: 'Laporan Diproses', value: `${stats.diproses} laporan`, color: 'bg-info' },
                { label: 'Menunggu Verifikasi', value: `${stats.menunggu} laporan`, color: 'bg-warning' },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.label === 'Tingkat Penyelesaian' ? `${stats.completion_rate}%` : '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
