import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { complaintService } from '../services/complaintService';
import type { Complaint } from '../types';
import { MapPin, Search, Clock, User, Building2, ExternalLink } from 'lucide-react';

export const TrackComplaintPage: React.FC = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!ticketCode.trim()) { setError('Masukkan kode tiket.'); return; }
    setLoading(true);
    setError('');
    setComplaint(null);
    try {
      const res = await complaintService.getComplaintByTicket(ticketCode);
      setComplaint(res);
    } catch {
      setError('Laporan tidak ditemukan. Periksa kembali kode tiket Anda.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="px-4 sm:px-8 max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-black text-foreground">Cek Status Laporan</h1>
          <p className="text-muted-foreground mt-1">Masukkan kode tiket untuk melacak status laporan Anda</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Masukkan kode tiket (contoh: SIPIL-001)"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button onClick={handleSearch} loading={loading} icon={Search}>
              Cari
            </Button>
          </div>
          {error && <p className="text-sm text-danger font-medium mt-2">{error}</p>}
        </Card>

        {/* Loading */}
        {loading && (
          <Card>
            <div className="space-y-4">
              <Skeleton className="w-1/3 h-6" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-32" variant="rectangular" />
            </div>
          </Card>
        )}

        {/* Result */}
        {complaint && !loading && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <Card variant="bordered">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-heading text-xl font-bold text-foreground">{complaint.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{complaint.ticket_code}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={complaint.status} size="lg" />
                  <Link to={`/complaints/${complaint.id}`} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    Lihat Detail Lengkap
                  </Link>
                </div>
              </div>
            </Card>

            {/* Detail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-bold text-sm text-foreground">Data Pelapor</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-semibold text-foreground">{complaint.reporter_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">HP</span><span className="font-semibold text-foreground">{complaint.reporter_phone}</span></div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-bold text-sm text-foreground">Lokasi</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Kecamatan</span><span className="font-semibold text-foreground">{complaint.subdistrict}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Alamat</span><span className="font-semibold text-foreground text-right max-w-[200px]">{complaint.address}</span></div>
                </div>
              </Card>
            </div>

            {/* Status Timeline */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Riwayat Status</h3>
              </div>

              {complaint.status_logs && complaint.status_logs.length > 0 ? (
                <div className="relative pl-6 space-y-5">
                  <div className="absolute left-2.5 top-2 bottom-0 w-0.5 bg-border" />
                  {complaint.status_logs.map((log, idx) => (
                    <div key={log.id} className="relative">
                      <div className={`absolute -left-4 mt-1.5 w-3 h-3 rounded-full border-2 ${
                        idx === 0 ? 'bg-primary border-primary' : 'bg-card border-border'
                      }`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={log.status} size="sm" dot={false} />
                          <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString('id-ID')}</span>
                        </div>
                        {log.notes && <p className="text-sm text-foreground/80">{log.notes}</p>}
                        <p className="text-xs text-muted-foreground">Oleh: {log.updated_by}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Laporan menunggu verifikasi</p>
                </div>
              )}
            </Card>

            {/* Related info */}
            {complaint.agency && (
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-foreground">OPD Penanggung Jawab</h3>
                </div>
                <p className="font-semibold text-foreground">{complaint.agency.name}</p>
                {complaint.agency.phone && <p className="text-sm text-muted-foreground">{complaint.agency.phone}</p>}
              </Card>
            )}
          </div>
        )}

        {/* Empty state */}
        {!complaint && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">Cari Laporan Anda</h3>
            <p className="text-sm text-muted-foreground mt-1">Masukkan kode tiket yang didapatkan saat membuat laporan</p>
          </div>
        )}
      </div>
    </div>
  );
};
