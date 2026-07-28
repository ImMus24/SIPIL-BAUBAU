import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/Badge';
import { PageBreadcrumb } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary } from '../types';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
} from 'lucide-react';

export const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<StatSummary | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([complaintService.getStatsSummary(), complaintService.getComplaints()])
      .then(([s, c]) => { setStats(s); setComplaints(c); })
      .catch(() => setError('Gagal memuat data statistik.'))
      .finally(() => setLoading(false));
  }, []);

  // Compute subdistrict stats from real API data
  const subdistrictStats = ['Wolio', 'Betoambari', 'Murhum', 'Kokalukuna', 'Lea-Lea', 'Sorawolio', 'Bungi', 'Batupoaro']
    .map((s) => ({
      name: s,
      total: complaints.filter((c) => c.subdistrict === s).length,
      resolved: complaints.filter((c) => c.subdistrict === s && c.status === 'selesai').length,
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="px-4 sm:px-8 max-w-container mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-xl" />)}
            </div>
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="px-4 sm:px-8 max-w-container mx-auto text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-warning mb-4" />
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  const sortedSubdistricts = [...subdistrictStats].sort((a, b) => b.total - a.total);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="px-4 sm:px-8 max-w-container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <PageBreadcrumb items={[{ label: 'Beranda', href: '/' }, { label: 'Statistik' }]} />
            <h1 className="font-heading text-3xl font-black text-foreground mt-2">Statistik Infrastruktur</h1>
            <p className="text-muted-foreground">Data real-time dari database SIPIL BAUBAU</p>
          </div>
          <Button variant="outline" icon={Download}>Export Laporan</Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Laporan" value={stats?.total ?? 0} icon={FileText} variant="primary" />
          <StatCard title="Menunggu" value={stats?.menunggu ?? 0} icon={Clock} variant="warning" />
          <StatCard title="Diproses" value={stats?.diproses ?? 0} icon={TrendingUp} variant="info" />
          <StatCard title="Selesai" value={stats?.selesai ?? 0} icon={CheckCircle2} variant="success" />
          <StatCard title="Ditolak" value={stats?.ditolak ?? 0} icon={AlertTriangle} variant="danger" />
        </div>

        {/* Completion Rate */}
        <Card variant="bordered">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Tingkat Penyelesaian</h3>
              <p className="text-sm text-muted-foreground">{stats?.selesai ?? 0} dari {stats?.total ?? 0} laporan terselesaikan</p>
            </div>
            <div className="text-3xl font-black text-primary">{stats?.completion_rate ?? 0}%</div>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 mt-3">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${stats?.completion_rate ?? 0}%` }} />
          </div>
        </Card>

        {/* Per Subdistrict */}
        <Card variant="bordered" header={<h3 className="font-bold">Laporan Per Kecamatan</h3>}>
          <div className="space-y-3">
            {sortedSubdistricts.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="w-28 text-sm font-medium text-foreground">{s.name}</span>
                <div className="flex-1 bg-muted rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all"
                    style={{ width: `${stats?.total ? (s.total / stats.total) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground w-28 justify-end">
                  <span>{s.total}</span>
                  <span className="text-success">{s.resolved} ✓</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card variant="bordered" header={<h3 className="font-bold">Laporan Terbaru</h3>}>
          {complaints.length > 0 ? (
            <div className="divide-y divide-border">
              {complaints.slice(0, 10).map((c) => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{c.ticket_code} • {c.subdistrict}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Belum ada laporan.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;
