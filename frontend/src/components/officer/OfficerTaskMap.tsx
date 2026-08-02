import React, { useMemo, useState } from 'react';
import { Card } from '../ui/Card';
import { Skeleton } from '../dashboard/LoadingSkeleton';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { MapPoint } from '../../types';
import { cn } from '../../lib/utils';

interface OfficerTaskMapProps {
  assignedTasks: MapPoint[];
  loading: boolean;
  onNavigateToLocation?: (task: MapPoint) => void;
}

const createUrgencyIcon = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
    <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
    <circle cx="12" cy="12" r="5" fill="#ffffff"/>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
};

const URGENCY_ICONS: Record<string, L.Icon> = {
  darurat: createUrgencyIcon('#DC2626'),
  tinggi: createUrgencyIcon('#F59E0B'),
  sedang: createUrgencyIcon('#0EA5E9'),
  rendah: createUrgencyIcon('#16A34A'),
};

const URGENCY_LABELS: Record<string, string> = {
  darurat: 'Darurat',
  tinggi: 'Tinggi',
  sedang: 'Sedang',
  rendah: 'Rendah',
};

export const OfficerTaskMap: React.FC<OfficerTaskMapProps> = ({
  assignedTasks, loading,
}) => {
  const { isDark } = useTheme();
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const points = useMemo(
    () => assignedTasks.filter((p) => p.latitude != null && p.longitude != null),
    [assignedTasks],
  );

  const filtered = useMemo(
    () => (filterUrgency === 'all' ? points : points.filter((p) => p.urgency === filterUrgency)),
    [points, filterUrgency],
  );

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener');
  };

  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  if (loading) return <Skeleton variant="rectangular" height={400} />;

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-light dark:bg-primary/20 rounded-xl">
            <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground leading-tight">Peta Tugas</h3>
            <p className="text-xs text-muted-foreground">{filtered.length} titik tugas</p>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', 'darurat', 'tinggi', 'sedang', 'rendah'].map((u) => (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                filterUrgency === u
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {u === 'all' ? 'Semua' : URGENCY_LABELS[u]}
            </button>
          ))}
        </div>
      </div>

      {/* Real Map */}
      <div className="relative h-[400px] bg-muted/30">
        <MapContainer
          center={[-5.4642, 122.6035]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            key={isDark ? 'dark-tiles' : 'light-tiles'}
            attribution={
              isDark
                ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
            url={isDark ? darkTileUrl : lightTileUrl}
          />

          {filtered.map((point) => (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              icon={URGENCY_ICONS[point.urgency] || URGENCY_ICONS.sedang}
            >
              <Popup>
                <div className="p-3 max-w-[240px] space-y-1.5">
                  <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
                    <span className="font-mono text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded border border-primary/20">
                      {point.ticket_code}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-danger-bg text-danger">
                      {URGENCY_LABELS[point.urgency] || point.urgency}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-tight">{point.title}</h4>
                  <p className="text-[11px] text-muted-foreground truncate">{point.subdistrict}</p>
                  <button
                    onClick={() => openGoogleMaps(point.latitude, point.longitude)}
                    className="w-full inline-flex items-center justify-center gap-1.5 mt-1 px-2.5 py-1.5 text-[11px] font-bold bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                  >
                    <Navigation className="w-3 h-3" aria-hidden="true" />
                    Buka Navigasi
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Empty overlay */}
        {filtered.length === 0 && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
            <div className="bg-card/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl border border-border max-w-xs pointer-events-auto">
              <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-bold text-foreground">Tidak ada titik tugas</p>
              <p className="text-xs text-muted-foreground mt-1">
                {points.length === 0
                  ? 'Tidak ada tugas dengan koordinat lokasi'
                  : 'Tidak ada titik dengan filter ini'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="p-4 border-t border-border bg-muted/30 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <span className="text-lg font-black text-danger">{points.filter(p => p.urgency === 'tinggi' || p.urgency === 'darurat').length}</span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Prioritas</p>
        </div>
        <div>
          <span className="text-lg font-black text-info">{points.filter(p => p.urgency === 'sedang').length}</span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Sedang</p>
        </div>
        <div>
          <span className="text-lg font-black text-success">{points.filter(p => p.urgency === 'rendah').length}</span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Rendah</p>
        </div>
      </div>
    </Card>
  );
};

export default OfficerTaskMap;
