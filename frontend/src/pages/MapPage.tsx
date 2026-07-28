import React, { useEffect, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { Complaint } from '../types';
import { MapPin, List } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState('semua');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { complaintService.getComplaints().then(setComplaints); }, []);

  const tabs = [
    { id: 'semua', label: 'Semua' },
    { id: 'menunggu', label: 'Menunggu' },
    { id: 'diproses', label: 'Diproses' },
    { id: 'selesai', label: 'Selesai' },
  ];

  return (
    <div className="pt-20 h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-lg font-bold text-foreground">Peta Interaktif</h1>
        </div>
        <div className="flex items-center gap-2">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
            title={sidebarOpen ? 'Tutup panel' : 'Buka panel'}
          >
            <List className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <BaubauMap />
          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-card border border-border rounded-2xl p-3 shadow-lg">
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Menunggu', color: 'bg-warning' },
                { label: 'Diproses', color: 'bg-info' },
                { label: 'Selesai', color: 'bg-success' },
                { label: 'Ditolak', color: 'bg-danger' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-l border-border bg-card overflow-y-auto animate-slide-in-right">
            <div className="p-4">
              <h3 className="font-heading font-bold text-foreground text-sm mb-3">
                Daftar Laporan ({complaints.length})
              </h3>
              <div className="space-y-2">
                {complaints.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-mono text-muted-foreground">{c.ticket_code}</p>
                      <Badge
                        variant={c.status === 'selesai' ? 'success' : c.status === 'diproses' ? 'info' : c.status === 'ditolak' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.subdistrict}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
