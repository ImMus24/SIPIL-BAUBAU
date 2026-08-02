import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import { PageBreadcrumb } from '../components/ui/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import type { Complaint } from '../types';
import { MapPin, List, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const STATUS_BADGE_VARIANT: Record<string, 'success' | 'info' | 'danger' | 'warning'> = {
  selesai: 'success',
  diproses: 'info',
  ditolak: 'danger',
  menunggu: 'warning',
};

const STATUS_LABEL: Record<string, string> = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export const MapPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('semua');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    complaintService
      .getComplaints()
      .then((data) => { if (mounted) setComplaints(data); })
      .catch(() => { if (mounted) setError('Gagal memuat data peta.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const tabs = [
    { id: 'semua', label: 'Semua' },
    { id: 'menunggu', label: 'Menunggu' },
    { id: 'diproses', label: 'Diproses' },
    { id: 'selesai', label: 'Selesai' },
  ];

  const mapComplaints = useMemo(() => {
    if (activeTab === 'semua') return complaints;
    return complaints.filter((c) => c.status === activeTab);
  }, [complaints, activeTab]);

  return (
    <div className="pt-20 h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-primary-light dark:bg-primary/20 rounded-xl shrink-0">
            <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-lg font-bold text-foreground truncate">Peta Interaktif</h1>
            <PageBreadcrumb items={[{ label: 'Peta Interaktif' }]} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl border border-border hover:bg-muted hover:border-primary/30 transition-all"
            title={sidebarOpen ? 'Tutup panel' : 'Buka panel'}
            aria-label={sidebarOpen ? 'Tutup panel daftar laporan' : 'Buka panel daftar laporan'}
          >
            <List className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Memuat peta…</p>
              </div>
            </div>
          ) : (
            <BaubauMap
              complaints={mapComplaints}
              height="100%"
              selectedSubdistrict="all"
            />
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <EmptyState
                icon="search"
                title="Gagal memuat data"
                description={error}
                actionText="Coba Lagi"
                onAction={() => window.location.reload()}
                className="max-w-md pointer-events-auto"
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 shrink-0 border-l border-border bg-card overflow-y-auto animate-slide-in-right hidden md:block" aria-label="Daftar laporan">
            <div className="p-4">
              <h3 className="font-heading font-bold text-foreground text-sm mb-3">
                Daftar Laporan ({mapComplaints.length})
              </h3>
              {mapComplaints.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Tidak ada laporan untuk filter ini.
                </p>
              ) : (
                <div className="space-y-2">
                  {mapComplaints.map((c) => (
                    <Link
                      key={c.id}
                      to={`/complaint/${c.ticket_code}`}
                      className={cn(
                        'block p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm transition-all group',
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-mono text-muted-foreground">{c.ticket_code}</p>
                        <Badge variant={STATUS_BADGE_VARIANT[c.status] || 'warning'} size="sm">
                          {STATUS_LABEL[c.status] || c.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {c.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.subdistrict}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
