import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import type { Complaint, AdminDashboardData } from '../../types';
import { exportCSV } from '../../lib/export';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/utils';
import {
  FileText, Clock, CheckCircle2, AlertTriangle, X,
  Activity, Users, Download, Filter,
  Building2, ArrowUpCircle, UserCheck, BarChart3,
  PieChart, Award, ClipboardCheck,
  Building, History,
} from 'lucide-react';

type TabId = 'semua' | 'menunggu' | 'diproses' | 'selesai';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('semua');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('tab') || 'beranda';

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await dashboardService.getAdminDashboard();
      setData(res as AdminDashboardData);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData, refreshKey]);

  if (error) return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Dashboard Admin', href: '/admin' }]} />
        <ErrorState title="Gagal Memuat Dashboard" message={error} onRetry={fetchData} variant="fullscreen" />
      </div>
    </DashboardLayout>
  );

  const handleStatusUpdated = () => setRefreshKey((k) => k + 1);
  const openStatusModal = (c: Complaint) => { setSelectedComplaint(c); setModalOpen(true); };
  const goToSection = (tab: string) => setSearchParams({ tab });

  const stats = data?.stats ?? { total: 0, menunggu: 0, diproses: 0, selesai: 0, ditolak: 0, completion_rate: 0 };
  const reports: Complaint[] = data?.recent_reports ?? [];
  const trends = data?.monthly_trend ?? [];
  const agencyPerf = data?.agency_performance ?? [];
  const verification: Complaint[] = data?.verification_queue ?? [];
  const userSummary = data?.user_summary ?? { total: 0, officers: 0, citizens: 0 };
  const topCategories = data?.top_categories ?? [];
  const topSubdistricts = data?.top_subdistricts ?? [];
  const officerRanking = data?.officer_ranking ?? [];
  const auditLog = data?.audit_log ?? [];

  const filtered = activeTab === 'semua' ? reports : reports.filter((c) => c.status === activeTab);

  const tabs = [
    { id: 'semua' as TabId, label: 'Semua', badge: stats.total },
    { id: 'menunggu' as TabId, label: 'Menunggu', badge: stats.menunggu },
    { id: 'diproses' as TabId, label: 'Diproses', badge: stats.diproses },
    { id: 'selesai' as TabId, label: 'Selesai', badge: stats.selesai },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <Breadcrumb items={[{ label: 'Dashboard Admin', href: '/admin' }]} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-black text-foreground">Dashboard Administrator</h1>
            <p className="text-sm text-muted-foreground mt-1">Kelola seluruh sistem pengaduan infrastruktur Kota Baubau</p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold">{user?.name}</span>
        </div>

        {/* Section tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'beranda', label: 'Beranda', icon: Activity },
            { id: 'verifikasi', label: 'Verifikasi', icon: ClipboardCheck },
            { id: 'pengguna', label: 'Pengguna', icon: Users },
            { id: 'kategori', label: 'Kategori', icon: Building2 },
            { id: 'audit', label: 'Audit Log', icon: History },
            { id: 'laporan', label: 'Laporan', icon: Download },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  activeSection === s.id
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* KPI grid (beranda only) */}
        {activeSection === 'beranda' && (loading ? <Skeleton.KPIGrid count={7} /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <StatCard title="Total Laporan" value={stats.total} icon={FileText} variant="primary" />
            <StatCard title="Menunggu Verifikasi" value={stats.menunggu} icon={AlertTriangle} variant="warning" />
            <StatCard title="Sedang Diproses" value={stats.diproses} icon={Clock} variant="info" />
            <StatCard title="Selesai" value={stats.selesai} icon={CheckCircle2} variant="success" />
            <StatCard title="Ditolak" value={stats.ditolak} icon={X} variant="danger" />
            <StatCard title="Total Pengguna" value={userSummary.total} icon={Users} variant="default" />
            <StatCard title="Petugas Aktif" value={userSummary.officers} icon={UserCheck} variant="default" />
          </div>
        ))}

        {activeSection === 'beranda' && (
          <>
        {!loading && verification.length > 0 && (
          <Card variant="bordered" className="border-warning/20 bg-warning/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-heading font-bold text-warning">Antrian Verifikasi</h3>
              <span className="ml-auto text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold">{verification.length} menunggu</span>
            </div>
            <div className="space-y-2">
              {verification.slice(0, 5).map((c) => (
                <div key={c.id} onClick={() => navigate(`/complaints/${c.id}`)} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border cursor-pointer hover:border-primary/30 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.ticket_code} · {c.subdistrict} · {c.reporter_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <UrgencyBadge urgency={c.urgency} />
                    <Button variant="ghost" size="sm" icon={ArrowUpCircle} onClick={(e) => { e.stopPropagation(); openStatusModal(c); }}>Proses</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center gap-2 mb-6"><BarChart3 className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Tren Bulanan (6 Bulan)</h3></div>
              {loading ? <Skeleton.Chart /> : trends.length > 0 ? (
                <AreaChart series={[{ name: 'Total', data: trends.map((t) => t.total) }, { name: 'Selesai', data: trends.map((t) => t.resolved) }]} categories={trends.map((t) => t.label)} height={280} colors={['#3b82f6', '#22c55e']} />
              ) : <div className="h-48 flex items-center justify-center"><p className="text-muted-foreground">Belum ada data tren</p></div>}
            </Card>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1">
                  {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                      {tab.label}{tab.badge > 0 && <span className="ml-1 text-[10px] opacity-60">({tab.badge})</span>}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2"><Button variant="outline" size="sm" icon={Filter} onClick={() => setActiveTab('menunggu')}>Filter</Button><Button variant="outline" size="sm" icon={Download} onClick={() => exportCSV('laporan-admin', filtered, [{ key: 'ticket_code', header: 'Kode Tiket' }, { key: 'title', header: 'Judul' }, { key: 'subdistrict', header: 'Kecamatan' }, { key: 'status', header: 'Status' }, { key: 'urgency', header: 'Urgensi' }])}>Ekspor</Button></div>
              </div>

              {loading ? <Skeleton.Table rows={6} cols={5} /> : filtered.length === 0 ? (
                <Card><div className="py-8 text-center"><FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Tidak ada laporan.</p></div></Card>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <th className="pb-3 pr-3">Kode</th><th className="pb-3 pr-3">Judul</th><th className="pb-3 pr-3">Kategori</th><th className="pb-3 pr-3">Pelapor</th><th className="pb-3 pr-3">Urgensi</th><th className="pb-3 pr-3">Tanggal</th><th className="pb-3 pr-3">Status</th><th className="pb-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filtered.map((item) => (
                          <tr key={item.id} onClick={() => navigate(`/complaints/${item.id}`)} className="hover:bg-muted/30 transition-colors cursor-pointer">
                            <td className="py-3 pr-3 text-sm font-mono text-foreground font-medium">{item.ticket_code}</td>
                            <td className="py-3 pr-3"><p className="text-sm font-semibold text-foreground truncate">{item.title}</p><p className="text-xs text-muted-foreground">{item.subdistrict}</p></td>
                            <td className="py-3 pr-3 text-sm text-foreground">{item.category?.name || '-'}</td>
                            <td className="py-3 pr-3 text-sm text-muted-foreground">{item.reporter_name}</td>
                            <td className="py-3 pr-3"><UrgencyBadge urgency={item.urgency} size="sm" /></td>
                            <td className="py-3 pr-3 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                            <td className="py-3 pr-3"><StatusBadge status={item.status} size="sm" /></td>
                            <td className="py-3">
                              {item.status !== 'selesai' && item.status !== 'ditolak' ? (
                                <Button variant="ghost" size="sm" icon={ArrowUpCircle} onClick={(e) => { e.stopPropagation(); openStatusModal(item); }}>Proses</Button>
                              ) : <span className="text-xs text-muted-foreground">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-2 mb-4"><PieChart className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Kategori Teratas</h3></div>
                {loading ? <Skeleton variant="text" count={4} /> : topCategories.length > 0 ? (
                  <div className="space-y-3">
                    {topCategories.map((cat) => {
                      const maxC = Math.max(...topCategories.map(c => c.count), 1);
                      return (
                        <div key={cat.category_name} className="space-y-1">
                          <div className="flex justify-between text-sm"><span className="text-foreground font-medium">{cat.category_name}</span><span className="text-muted-foreground">{cat.count} laporan</span></div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary/40" style={{ width: `${(cat.count / maxC) * 100}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>}
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-4"><Building2 className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Kecamatan Teratas</h3></div>
                {loading ? <Skeleton variant="text" count={4} /> : topSubdistricts.length > 0 ? (
                  <div className="space-y-2">
                    {topSubdistricts.map((sd) => (
                      <div key={sd.subdistrict} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                        <span className="font-medium text-foreground text-sm">{sd.subdistrict}</span>
                        <div className="flex items-center gap-3 text-sm"><span className="text-muted-foreground">{sd.count} laporan</span><span className="text-success font-semibold">{sd.resolved} selesai</span></div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground text-center py-4">Belum ada data</p>}
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Aksi Cepat</h3></div>
              <div className="space-y-2">
                <QuickActionCard label="Verifikasi Laporan" description="Proses laporan menunggu verifikasi" icon={ClipboardCheck} color="bg-warning/10 text-warning" onClick={() => setActiveTab('menunggu')} />
                <QuickActionCard label="Tugaskan Petugas" description="Assign laporan ke OPD" icon={UserCheck} color="bg-primary/10 text-primary" onClick={() => goToSection('verifikasi')} />
                <QuickActionCard label="Kelola Pengguna" description="Atur akun warga & petugas" icon={Users} color="bg-info/10 text-info" onClick={() => goToSection('pengguna')} />
                <QuickActionCard label="Kelola Kategori" description="Tambah/edit kategori" icon={Building2} color="bg-success/10 text-success" onClick={() => goToSection('kategori')} />
                <QuickActionCard label="Lihat Audit Log" description="Rekam jejak aktivitas" icon={History} color="bg-muted-foreground/10 text-muted-foreground" onClick={() => goToSection('audit')} />
                <QuickActionCard label="Generate Laporan" description="Ekspor data" icon={Download} color="bg-danger/10 text-danger" onClick={() => goToSection('laporan')} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Ranking Petugas</h3></div>
              {loading ? <Skeleton variant="text" count={5} /> : officerRanking.length > 0 ? (
                <div className="space-y-2">
                  {officerRanking.slice(0, 10).map((o, idx) => (
                    <div key={o.officer_id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${idx === 0 ? 'bg-warning/20 text-warning' : idx === 1 ? 'bg-muted text-muted-foreground' : idx === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</span>
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground truncate">{o.officer_name}</p><p className="text-xs text-muted-foreground">{o.agency_name}</p></div>
                      <div className="text-right text-sm"><p className="font-bold text-success">{o.completed}</p><p className="text-xs text-muted-foreground">selesai</p></div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground text-center py-6">Belum ada data ranking</p>}
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4"><Building className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Kinerja OPD</h3></div>
              {loading ? <Skeleton variant="text" count={3} /> : agencyPerf.length > 0 ? (
                <div className="space-y-2">
                  {agencyPerf.slice(0, 6).map((a) => (
                    <div key={a.agency_name} className="p-3 rounded-xl bg-muted/50 border border-border">
                      <p className="font-semibold text-foreground text-sm">{a.agency_name}</p>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-muted-foreground">Total: <strong className="text-foreground">{a.total}</strong></span>
                        <span className="text-muted-foreground">Selesai: <strong className="text-success">{a.resolved}</strong></span>
                        <span className="text-xs font-bold">{a.completion_rate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${a.completion_rate >= 70 ? 'bg-success' : a.completion_rate >= 40 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${a.completion_rate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground text-center py-4">Belum ada data OPD</p>}
            </Card>

            {!loading && auditLog.length > 0 && (
              <Card>
                <div className="flex items-center gap-2 mb-4"><History className="w-5 h-5 text-primary" /><h3 className="font-heading font-bold text-foreground">Aktivitas Sistem Terbaru</h3></div>
                <div className="space-y-2">
                  {auditLog.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Activity className="w-4 h-4 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{log.description || log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.user?.name || 'Sistem'} · {new Date(log.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
          </>
        )}

        {/* ─── DEDICATED SECTIONS ─── */}
        {activeSection !== 'beranda' && (
          <div className="space-y-6">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-black text-foreground">
                  {activeSection === 'verifikasi' && 'Verifikasi Laporan'}
                  {activeSection === 'pengguna' && 'Kelola Pengguna'}
                  {activeSection === 'kategori' && 'Kelola Kategori'}
                  {activeSection === 'audit' && 'Audit Log'}
                  {activeSection === 'laporan' && 'Laporan & Ekspor'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeSection === 'verifikasi' && 'Tinjau dan verifikasi laporan yang menunggu persetujuan.'}
                  {activeSection === 'pengguna' && 'Kelola akun warga dan petugas OPD.'}
                  {activeSection === 'kategori' && 'Atur kategori pengaduan infrastruktur.'}
                  {activeSection === 'audit' && 'Rekam jejak aktivitas seluruh sistem.'}
                  {activeSection === 'laporan' && 'Ekspor data laporan untuk keperluan pelaporan.'}
                </p>
              </div>
            </div>

            {/* Verifikasi */}
            {activeSection === 'verifikasi' && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-foreground">Antrian Verifikasi</h3>
                  <span className="ml-auto text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold">{verification.length} menunggu</span>
                </div>
                {loading ? <Skeleton.Table rows={5} cols={4} /> : verification.length === 0 ? (
                  <EmptyState icon="inbox" title="Tidak ada antrian" description="Semua laporan sudah diverifikasi." className="py-10" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <th className="pb-3 pr-3">Kode</th><th className="pb-3 pr-3">Judul</th><th className="pb-3 pr-3">Pelapor</th><th className="pb-3 pr-3">Urgensi</th><th className="pb-3 pr-3">Tanggal</th><th className="pb-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {verification.map((c) => (
                          <tr key={c.id} onClick={() => navigate(`/complaints/${c.id}`)} className="hover:bg-muted/30 transition-colors cursor-pointer">
                            <td className="py-3 pr-3 text-sm font-mono text-foreground font-medium">{c.ticket_code}</td>
                            <td className="py-3 pr-3"><p className="text-sm font-semibold text-foreground truncate">{c.title}</p><p className="text-xs text-muted-foreground">{c.subdistrict}</p></td>
                            <td className="py-3 pr-3 text-sm text-muted-foreground">{c.reporter_name}</td>
                            <td className="py-3 pr-3"><UrgencyBadge urgency={c.urgency} size="sm" /></td>
                            <td className="py-3 pr-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                            <td className="py-3"><Button variant="ghost" size="sm" icon={ArrowUpCircle} onClick={(e) => { e.stopPropagation(); openStatusModal(c); }}>Proses</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {/* Pengguna */}
            {activeSection === 'pengguna' && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-foreground">Ringkasan Pengguna</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-primary-light/50 dark:bg-primary/10 border border-primary/20">
                    <p className="text-2xl font-black text-primary">{userSummary.total}</p>
                    <p className="text-sm text-muted-foreground font-medium">Total Pengguna</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-info-bg border border-info-border">
                    <p className="text-2xl font-black text-info">{userSummary.officers}</p>
                    <p className="text-sm text-muted-foreground font-medium">Petugas OPD</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-success-bg border border-success-border">
                    <p className="text-2xl font-black text-success">{userSummary.citizens}</p>
                    <p className="text-sm text-muted-foreground font-medium">Warga Terdaftar</p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                  Manajemen detail pengguna (tambah, ubah, nonaktifkan) tersedia melalui halaman kelola pengguna di backend admin.
                </div>
              </Card>
            )}

            {/* Kategori */}
            {activeSection === 'kategori' && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-foreground">Kategori Pengaduan</h3>
                </div>
                {loading ? <Skeleton variant="text" count={5} /> : topCategories.length > 0 ? (
                  <div className="space-y-3">
                    {topCategories.map((cat) => {
                      const maxC = Math.max(...topCategories.map((c) => c.count), 1);
                      return (
                        <div key={cat.category_name} className="space-y-1">
                          <div className="flex justify-between text-sm"><span className="text-foreground font-medium">{cat.category_name}</span><span className="text-muted-foreground">{cat.count} laporan</span></div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary/40" style={{ width: `${(cat.count / maxC) * 100}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                ) : <EmptyState icon="search" title="Belum ada data" description="Belum ada kategori pengaduan." className="py-10" />}
              </Card>
            )}

            {/* Audit */}
            {activeSection === 'audit' && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-foreground">Aktivitas Sistem</h3>
                </div>
                {loading ? <Skeleton.Table rows={6} cols={3} /> : auditLog.length === 0 ? (
                  <EmptyState icon="search" title="Belum ada aktivitas" description="Log aktivitas sistem akan muncul di sini." className="py-10" />
                ) : (
                  <div className="space-y-2">
                    {auditLog.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Activity className="w-4 h-4 text-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{log.description || log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.user?.name || 'Sistem'} · {new Date(log.created_at).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Laporan */}
            {activeSection === 'laporan' && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Download className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-foreground">Ekspor Data Laporan</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Unduh seluruh data laporan dalam format CSV untuk keperluan analisis dan pelaporan.</p>
                <div className="flex flex-wrap gap-3">
                  <Button icon={Download} onClick={() => exportCSV('laporan-admin', reports, [
                    { key: 'ticket_code', header: 'Kode Tiket' },
                    { key: 'title', header: 'Judul' },
                    { key: 'subdistrict', header: 'Kecamatan' },
                    { key: 'address', header: 'Alamat' },
                    { key: 'status', header: 'Status' },
                    { key: 'urgency', header: 'Urgensi' },
                    { key: 'created_at', header: 'Dibuat' },
                  ])}>
                    Ekspor CSV
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
      {selectedComplaint && <StatusUpdateModal open={modalOpen} onClose={() => setModalOpen(false)} complaint={selectedComplaint} onSuccess={handleStatusUpdated} />}
    </DashboardLayout>
  );
};

export default AdminDashboard;
