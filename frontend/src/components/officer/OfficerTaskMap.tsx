import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Skeleton } from '../dashboard/LoadingSkeleton';
import { MapPin, Navigation, ExternalLink, Layers } from 'lucide-react';
import type { MapPoint } from '../../types';

interface OfficerTaskMapProps {
  assignedTasks: MapPoint[];
  loading: boolean;
  onNavigateToLocation?: (task: MapPoint) => void;
}

export const OfficerTaskMap: React.FC<OfficerTaskMapProps> = ({
  assignedTasks, loading,
}) => {
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const points = assignedTasks.filter(p => p.latitude && p.longitude);

  const filtered = filterUrgency === 'all'
    ? points
    : points.filter(p => p.urgency === filterUrgency);

  const getMarkerColor = (urgency: string) => {
    switch (urgency) {
      case 'tinggi': case 'darurat': return 'bg-red-500 border-red-200';
      case 'sedang': return 'bg-orange-500 border-orange-200';
      default: return 'bg-emerald-500 border-emerald-200';
    }
  };

  const getMarkerIcon = (urgency: string) => {
    switch (urgency) {
      case 'tinggi': case 'darurat': return '🔴';
      case 'sedang': return '🟠';
      default: return '🟢';
    }
  };

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  if (loading) return <Skeleton variant="rectangular" height={400} />;

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold text-foreground">Peta Tugas</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {filtered.length} titik
          </span>
        </div>
        <div className="flex gap-1">
          {['all', 'tinggi', 'sedang', 'rendah'].map((u) => (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterUrgency === u
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {u === 'all' ? 'Semua' : u.charAt(0).toUpperCase() + u.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30">
          <Layers className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Belum ada data peta</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {points.length === 0
              ? 'Tidak ada tugas dengan koordinat lokasi'
              : 'Tidak ada titik dengan filter ini'}
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
          {filtered.map((point) => (
            <div
              key={point.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-border/50 group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${getMarkerColor(point.urgency)}`}>
                  <span>{getMarkerIcon(point.urgency)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{point.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{point.ticket_code}</span>
                    <span>·</span>
                    <span>{point.subdistrict}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {point.latitude && point.longitude && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Navigation}
                    onClick={() => openGoogleMaps(point.latitude, point.longitude)}
                  >
                    Navigasi
                  </Button>
                )}
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map placeholder - shows count stats */}
      <div className="p-4 border-t border-border bg-muted/30 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <span className="text-lg font-black text-red-500">{points.filter(p => p.urgency === 'tinggi' || p.urgency === 'darurat').length}</span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Prioritas</p>
        </div>
        <div>
          <span className="text-lg font-black text-orange-500">{points.filter(p => p.urgency === 'sedang').length}</span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Sedang</p>
        </div>
        <div>
          <span className="text-lg font-black text-emerald-500">{points.filter(p => p.urgency === 'rendah').length}</span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Rendah</p>
        </div>
      </div>
    </Card>
  );
};

export default OfficerTaskMap;
