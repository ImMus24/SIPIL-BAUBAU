import React from 'react';
import { Card } from '../ui/Card';
import { MapPin, Navigation, Copy, Check, ExternalLink, Crosshair } from 'lucide-react';
import { useState } from 'react';
import type { ComplaintDetail } from '../../types';
import { useToast } from '../ui/Toast';

interface MapPanelProps {
  complaint: ComplaintDetail;
  nearby?: ComplaintDetail['related'];
}

export const MapPanel: React.FC<MapPanelProps> = ({ complaint, nearby = [] }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const googleMapsUrl = `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`;
  const copyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${complaint.latitude.toFixed(6)}, ${complaint.longitude.toFixed(6)}`);
      setCopied(true);
      toast.success('Koordinat disalin', 'Koordinat berhasil disalin ke clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin', 'Tidak dapat mengakses clipboard.');
    }
  };

  const allPoints = [
    complaint,
    ...nearby.filter((n) => n.id !== complaint.id),
  ];

  return (
    <Card variant="bordered" className="overflow-hidden">
      <Card.Header>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-danger-bg text-danger">
            <MapPin className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-base font-bold text-foreground">Lokasi Laporan</h2>
        </div>
      </Card.Header>

      {/* Map placeholder — replaced by real BaubauMap in the page */}
      <div className="h-56 bg-gradient-to-br from-muted to-background relative flex items-center justify-center border-b border-border">
        <div className="text-center px-6">
          <Crosshair className="w-8 h-8 text-primary/50 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-bold text-foreground">{complaint.subdistrict}</p>
          <p className="text-xs text-muted-foreground mt-1">{complaint.address}</p>
          <p className="font-mono text-[11px] text-primary mt-2">
            {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}
          </p>
        </div>
        {allPoints.length > 1 && (
          <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-card border border-border text-[10px] font-bold text-muted-foreground">
            {allPoints.length} titik
          </span>
        )}
      </div>

      <Card.Body>
        <div className="grid grid-cols-1 gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary-hover transition-colors"
          >
            <Navigation className="w-4 h-4" aria-hidden="true" />
            Buka di Google Maps
            <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
          </a>
          <button
            onClick={copyCoords}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            {copied ? 'Tersalin!' : 'Salin Koordinat'}
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};
