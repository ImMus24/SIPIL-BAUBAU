import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { Complaint, BaubauSubdistrict } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { StatusBadge, UrgencyBadge } from '../ui/Badge';
import { MapPin, Navigation, Eye, LocateFixed, Layers, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const createCustomIcon = (color: string) => {
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

const icons = {
  menunggu: createCustomIcon('#F59E0B'),
  diproses: createCustomIcon('#0B5ED7'),
  selesai: createCustomIcon('#16A34A'),
  ditolak: createCustomIcon('#DC2626'),
  picker: createCustomIcon('#0A2540'),
};

const STATUS_LABELS: Record<string, string> = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

interface BaubauMapProps {
  complaints?: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
  pickLocation?: boolean;
  selectedLat?: number;
  selectedLng?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
  selectedSubdistrict?: BaubauSubdistrict | 'all';
  /** Enable marker clustering (default true when complaints > 30) */
  enableClustering?: boolean;
  /** Show status filter legend */
  showLegend?: boolean;
}

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), zoom), { animate: true, duration: 0.8 });
  }, [center, zoom, map]);
  return null;
};

const LocationPickerMarker: React.FC<{
  position: [number, number];
  onLocationSelect?: (lat: number, lng: number) => void;
}> = ({ position, onLocationSelect }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, Math.max(map.getZoom(), 15), { animate: true });
  }, [position, map]);

  useMapEvents({
    click(e) {
      if (onLocationSelect) onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker position={position} icon={icons.picker}>
      <Popup>
        <div className="p-3 text-center">
          <p className="text-xs font-bold text-navy dark:text-primary">📍 Lokasi Terpilih</p>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Klik area lain di peta untuk memindahkan pin.
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

/** Layer to create the marker cluster group when clustering is enabled */
const MarkerClusterLayer: React.FC<{
  complaints: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
}> = ({ complaints, onSelectComplaint }) => {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;
    const cluster = L.markerClusterGroup({
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      iconCreateFunction: (c) => {
        const count = c.getChildCount();
        const cls = count < 10 ? 'marker-cluster-small' : count < 30 ? 'marker-cluster-medium' : 'marker-cluster-large';
        const html = `<div class="${cls}" style="width:100%;height:100%">${count}</div>`;
        return L.divIcon({ html, className: cls, iconSize: L.point(42, 42) });
      },
    });

    complaints.forEach((item) => {
      if (item.latitude == null || item.longitude == null) return;
      const marker = L.marker([item.latitude, item.longitude], { icon: icons[item.status] || icons.menunggu });
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `<div class="p-3 max-w-[260px]">
        <div class="flex items-center justify-between gap-2 border-b pb-2 mb-2">
          <span class="font-mono text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded border border-primary/20">${item.ticket_code}</span>
        </div>
        <h4 class="font-bold text-xs leading-tight line-clamp-2 mb-1">${item.title}</h4>
        <p class="text-[11px] text-muted-foreground truncate">${item.address} · ${item.subdistrict}</p>
      </div>`;
      marker.bindPopup(popupContent);
      marker.on('click', () => onSelectComplaint?.(item));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;
    return () => {
      map.removeLayer(cluster);
    };
  }, [map, complaints, onSelectComplaint]);

  return null;
};

export const BaubauMap: React.FC<BaubauMapProps> = ({
  complaints = [],
  onSelectComplaint,
  pickLocation = false,
  selectedLat = -5.4642,
  selectedLng = 122.6035,
  onLocationSelect,
  height = '500px',
  selectedSubdistrict = 'all',
  enableClustering = true,
  showLegend = true,
}) => {
  const { isDark } = useTheme();
  const [pickerPos, setPickerPos] = useState<[number, number]>([selectedLat, selectedLng]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setPickerPos([selectedLat, selectedLng]);
  }, [selectedLat, selectedLng]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (selectedSubdistrict && selectedSubdistrict !== 'all' && c.subdistrict !== selectedSubdistrict) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [complaints, selectedSubdistrict, statusFilter]);

  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  const useClustering = enableClustering && !pickLocation && filteredComplaints.length > 12;

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: complaints.length };
    complaints.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  }, [complaints]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border bg-card" style={{ height }}>
      {/* Map Control Header */}
      <div className="absolute top-3 left-3 right-3 z-[500] bg-card/90 dark:bg-card/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-gradient-to-br from-primary to-navy text-white rounded-lg shrink-0">
            <MapPin className="w-4 h-4 text-golden" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider truncate">Peta Sebaran SIPIL</h4>
            <p className="text-[11px] text-muted-foreground truncate">Kota Baubau, Sulawesi Tenggara</p>
          </div>
        </div>
        {/* Status filter pills */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
          {['all', 'menunggu', 'diproses', 'selesai', 'ditolak'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0',
                statusFilter === s
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {STATUS_LABELS[s] || 'Semua'} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      <MapContainer
        center={[-5.4642, 122.6035]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
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

        {/* Recenter controller */}
        <MapController center={[-5.4642, 122.6035]} zoom={13} />

        {/* Location Picker Mode */}
        {pickLocation && (
          <LocationPickerMarker
            position={pickerPos}
            onLocationSelect={(lat, lng) => {
              setPickerPos([lat, lng]);
              if (onLocationSelect) onLocationSelect(lat, lng);
            }}
          />
        )}

        {/* Complaint Markers — clustered when many */}
        {!pickLocation && useClustering && (
          <MarkerClusterLayer complaints={filteredComplaints} onSelectComplaint={onSelectComplaint} />
        )}

        {!pickLocation && !useClustering && filteredComplaints.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={icons[item.status] || icons.menunggu}
          >
            <Popup>
              <div className="p-3 max-w-xs space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
                  <span className="font-mono text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded border border-primary/20">
                    {item.ticket_code}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-tight">{item.title}</h4>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.address} ({item.subdistrict})</span>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <UrgencyBadge urgency={item.urgency} />
                  {onSelectComplaint && (
                    <button
                      onClick={() => onSelectComplaint(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-md transition-colors"
                    >
                      <Eye className="w-3 h-3" aria-hidden="true" />
                      Detail
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      {showLegend && !pickLocation && (
        <div className="absolute bottom-4 left-3 z-[500] bg-card/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-border">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
            <Layers className="w-3 h-3" aria-hidden="true" /> Legenda
          </p>
          <div className="space-y-1.5">
            {(['menunggu', 'diproses', 'selesai', 'ditolak'] as const).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s === 'menunggu' ? '#F59E0B' : s === 'diproses' ? '#0B5ED7' : s === 'selesai' ? '#16A34A' : '#DC2626' }} />
                <span className="text-[11px] font-medium text-foreground">{STATUS_LABELS[s]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location indicator */}
      {pickLocation && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] bg-card/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-md border border-border flex items-center gap-2">
          <LocateFixed className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-foreground">
            {pickerPos[0].toFixed(5)}, {pickerPos[1].toFixed(5)}
          </span>
        </div>
      )}

      {/* Empty state */}
      {!pickLocation && filteredComplaints.length === 0 && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center pointer-events-none">
          <div className="bg-card/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl border border-border max-w-xs pointer-events-auto">
            <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-bold text-foreground">Tidak ada laporan di area ini</p>
            <p className="text-xs text-muted-foreground mt-1">Coba ubah filter status atau pilih kecamatan lain.</p>
          </div>
        </div>
      )}
    </div>
  );
};
