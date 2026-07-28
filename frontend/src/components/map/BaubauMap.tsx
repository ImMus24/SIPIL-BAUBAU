import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Complaint, BaubauSubdistrict } from '../../types';
import { StatusBadge, UrgencyBadge } from '../ui/Badge';
import { MapPin, Navigation, Eye } from 'lucide-react';

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
  menunggu: createCustomIcon('#f59e0b'), // Amber/Yellow
  diproses: createCustomIcon('#3b82f6'), // Blue
  selesai: createCustomIcon('#10b981'),  // Green
  ditolak: createCustomIcon('#ef4444'),   // Red
  picker: createCustomIcon('#0f766e'),    // Baubau Deep Emerald
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
}

const LocationPickerMarker: React.FC<{
  position: [number, number];
  onLocationSelect?: (lat: number, lng: number) => void;
}> = ({ position, onLocationSelect }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom(), { animate: true });
  }, [position, map]);

  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return (
    <Marker position={position} icon={icons.picker}>
      <Popup>
        <div className="p-2 text-center">
          <p className="text-xs font-bold text-teal-800">Lokasi Terpilih</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
          <p className="text-[11px] text-slate-600 mt-1">Klik area lain di peta Kota Baubau untuk memindahkan pin.</p>
        </div>
      </Popup>
    </Marker>
  );
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
}) => {
  const [pickerPos, setPickerPos] = useState<[number, number]>([selectedLat, selectedLng]);

  useEffect(() => {
    setPickerPos([selectedLat, selectedLng]);
  }, [selectedLat, selectedLng]);

  const filteredComplaints = complaints.filter((c) => {
    if (selectedSubdistrict && selectedSubdistrict !== 'all') {
      return c.subdistrict === selectedSubdistrict;
    }
    return true;
  });

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200" style={{ height }}>
      {/* Map Control Header Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-slate-100 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-teal-700 text-white rounded-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pemetaan Lokasi GIS Kota Baubau</h4>
            <p className="text-[11px] text-slate-500">Sulawesi Tenggara • OpenStreetMap Live Data</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-xs">
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>Menunggu</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span>Diproses</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>Selesai</span>
        </div>
      </div>

      <MapContainer
        center={[-5.4642, 122.6035]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • SIPIL BAUBAU'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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

        {/* Complaint Markers Mode */}
        {!pickLocation &&
          filteredComplaints.map((item) => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={icons[item.status] || icons.menunggu}
            >
              <Popup>
                <div className="p-3 max-w-xs space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      {item.ticket_code}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight">{item.title}</h4>
                  <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                    <Navigation className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{item.address} ({item.subdistrict})</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <UrgencyBadge urgency={item.urgency} />
                    {onSelectComplaint && (
                      <button
                        onClick={() => onSelectComplaint(item)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-md transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detail</span>
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
