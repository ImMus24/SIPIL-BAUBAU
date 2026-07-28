import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { PageBreadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary } from '../types';
import {
  BarChart3,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react';

export const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<StatSummary>({ total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 });
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    Promise.all([complaintService.getStatsSummary(), complaintService.getComplaints()])
      .then(([s, c]) => { setStats(s); setComplaints(c); })
      .catch(() => {});
  }, []);

  const subdistrictData = ['Wolio', 'Betoambari', 'Murhum', 'Kokalukuna', 'Lea-Lea', 'Sorawolio', 'Bungi', 'Batupoaro']
    .map((s) => ({
      name: s,
      total: Math.floor(Math.random() * 50) + 5,
      resolved: Math.floor(Math.random() * 30) + 2,
    }));

  const columns = [
    { key: 'ticket_code', header: 'Tiket', width: '120px' },
    { key: 'title', header: 'Judul', render: (item: Complaint) => <span className="font-semibold text-foreground">{item.title}</span> },
    { key: 'subdistrict', header: 'Kecamatan', width: '120px' },
    { key: 'status', header: 'Status', render: (item: Complaint) => <StatusBadge status={item.status} />, width: '140px' },
    { key: 'created_at', header: 'Tanggal', render: (item: Complaint) => new Date(item.created_at).toLocaleDateString('id-ID'), width: '120px' },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="px-4 sm:px-8 max-w-container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <PageBreadcrumb items={[{ label: 'Statistik Publik' }]} />
            <h1 className="font-heading text-3xl font-black text-foreground mt-2">Statistik Publik</h1>
            <p className="text-muted-foreground">Data laporan infrastruktur Kota Baubau secara real-time</p>
          </div>
          <Button variant="outline" icon={Download}>Ekspor Data</Button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
          <StatCard title="Diproses" value={stats.diproses} icon={Clock} variant="info" />
          <StatCard title="Selesai" value={stats.selesai} icon={CheckCircle2} variant="success" trend={{ value: `${stats.completion_rate}% tingkat penyelesaian`, up: true }} />
          <StatCard title="Menunggu" value={stats.menunggu} icon={AlertTriangle} variant="warning" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Distribusi Status</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Selesai', value: stats.selesai, color: 'bg-success', pct: stats.total ? (stats.selesai / stats.total) * 100 : 0 },
                { label: 'Diproses', value: stats.diproses, color: 'bg-info', pct: stats.total ? (stats.diproses / stats.total) * 100 : 0 },
                { label: 'Menunggu', value: stats.menunggu, color: 'bg-warning', pct: stats.total ? (stats.menunggu / stats.total) * 100 : 0 },
                { label: 'Ditolak', value: stats.ditolak, color: 'bg-danger', pct: stats.total ? (stats.ditolak / stats.total) * 100 : 0 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.value} ({item.pct.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Per Subdistrict */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-bold text-foreground">Per Kecamatan</h3>
            </div>
            <div className="space-y-2">
              {subdistrictData.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground w-24">{s.name}</span>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${(s.total / Math.max(...subdistrictData.map((x) => x.total))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground w-16 text-right">{s.total}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-foreground">Seluruh Laporan</h3>
            <Button variant="ghost" size="sm" icon={Filter}>Filter</Button>
          </div>
          <Table
            columns={columns}
            data={complaints}
            keyExtractor={(c) => c.id}
            emptyMessage="Belum ada data laporan"
          />
        </Card>
      </div>
    </div>
  );
};
