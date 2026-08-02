import React, { useRef, useState } from 'react';
import {
  CheckCircle2, XCircle, UserCheck, AlertTriangle, Tag, Navigation,
  Camera, Upload, Download, Printer, Star, MessageSquare, RefreshCw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusUpdateModal } from '../ui/StatusUpdateModal';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { useUploadComplaintFile } from '../../hooks/queries';
import type { ComplaintDetail, ComplaintFileCategory, Agency } from '../../types';

interface DetailActionPanelProps {
  complaint: ComplaintDetail;
  agencies: Agency[];
  onDataChanged: () => void;
}

const FILE_CATEGORY_LABEL: Record<ComplaintFileCategory, string> = {
  before: 'Foto Sebelum',
  progress: 'Foto Proses',
  after: 'Foto Sesudah',
  support: 'Dokumen Pendukung',
};

export const DetailActionPanel: React.FC<DetailActionPanelProps> = ({ complaint, agencies, onDataChanged }) => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role ?? 'citizen';

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState<ComplaintFileCategory>('support');
  const uploadMutation = useUploadComplaintFile(complaint.id);

  const isAdmin = role === 'admin';
  const isOfficer = role === 'officer';
  const isHead = role === 'head_of_agency';
  const isCitizen = role === 'citizen';
  const canOfficerAct = isOfficer && (!complaint.agency_id || complaint.agency_id === user?.agency_id);

  const downloadTicket = () => {
    const content = [
      'SIPIL BAUBAU — TIKET LAPORAN',
      '================================',
      `Tiket      : ${complaint.ticket_code}`,
      `Judul      : ${complaint.title}`,
      `Status     : ${complaint.progress_label}`,
      `Prioritas  : ${complaint.urgency}`,
      `Kategori   : ${complaint.category?.name ?? '-'}`,
      `Pelapor    : ${complaint.reporter_name}`,
      `Telepon    : ${complaint.reporter_phone || '-'}`,
      `Kecamatan  : ${complaint.subdistrict}`,
      `Alamat     : ${complaint.address}`,
      `Diajukan   : ${new Date(complaint.created_at).toLocaleString('id-ID')}`,
      '',
      `Link: ${window.location.origin}/complaints/${complaint.id}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiket-${complaint.ticket_code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Tiket diunduh', 'File tiket berhasil diunduh.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileUpload = (category: ComplaintFileCategory, file: File) => {
    uploadMutation.mutate(
      { file, category },
      {
        onSuccess: () => {
          toast.success('Berkas diunggah', `${FILE_CATEGORY_LABEL[category]} berhasil diunggah.`);
          onDataChanged();
        },
        onError: () => toast.error('Gagal mengunggah', 'Pastikan berkas berukuran maksimal 15 MB.'),
      },
    );
  };

  const openUploader = (category: ComplaintFileCategory) => {
    setUploadCategory(category);
    fileInputRef.current?.click();
  };

  const openMaps = () => {
    window.open(`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`, '_blank');
  };

  return (
    <>
      <div className="sticky top-24 space-y-3">
        {/* Admin actions */}
        {isAdmin && (
          <div className="rounded-2xl border border-border bg-card shadow-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Aksi Admin</p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="success" icon={CheckCircle2} onClick={() => setStatusModalOpen(true)}>
                Verifikasi
              </Button>
              <Button size="sm" variant="danger" icon={XCircle} onClick={() => setStatusModalOpen(true)}>
                Tolak
              </Button>
              <Button size="sm" variant="secondary" icon={UserCheck} onClick={() => setStatusModalOpen(true)}>
                Assign
              </Button>
              <Button size="sm" variant="outline" icon={AlertTriangle} onClick={() => setStatusModalOpen(true)}>
                Prioritas
              </Button>
              <Button size="sm" variant="outline" icon={Tag} onClick={() => setStatusModalOpen(true)} fullWidth>
                Kategori
              </Button>
            </div>
          </div>
        )}

        {/* Officer actions */}
        {canOfficerAct && (
          <div className="rounded-2xl border border-border bg-card shadow-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Aksi Petugas</p>
            <div className="space-y-2">
              {complaint.status !== 'selesai' && complaint.status !== 'ditolak' && (
                <Button size="sm" variant="primary" icon={CheckCircle2} onClick={() => setStatusModalOpen(true)} fullWidth>
                  Perbarui Status
                </Button>
              )}
              <Button size="sm" variant="outline" icon={Navigation} onClick={openMaps} fullWidth>
                Navigasi ke Lokasi
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" icon={Camera} onClick={() => openUploader('before')} fullWidth>
                  Before
                </Button>
                <Button size="sm" variant="outline" icon={Camera} onClick={() => openUploader('progress')} fullWidth>
                  Progress
                </Button>
                <Button size="sm" variant="outline" icon={Camera} onClick={() => openUploader('after')} fullWidth>
                  After
                </Button>
                <Button size="sm" variant="outline" icon={Upload} onClick={() => openUploader('support')} fullWidth>
                  Dokumen
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Head read-only */}
        {isHead && (
          <div className="rounded-2xl border border-border bg-card shadow-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Akses Baca</p>
            <Button size="sm" variant="outline" icon={Printer} onClick={handlePrint} fullWidth>
              Cetak Laporan
            </Button>
            <Button size="sm" variant="ghost" icon={Download} onClick={downloadTicket} fullWidth className="mt-2">
              Unduh Tiket
            </Button>
          </div>
        )}

        {/* Citizen actions */}
        {isCitizen && (
          <div className="rounded-2xl border border-border bg-card shadow-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Aksi Warga</p>
            <div className="space-y-2">
              <Button size="sm" variant="primary" icon={MessageSquare} onClick={() => document.getElementById('komentar-section')?.scrollIntoView({ behavior: 'smooth' })} fullWidth>
                Lihat Timeline
              </Button>
              <Button size="sm" variant="outline" icon={Download} onClick={downloadTicket} fullWidth>
                Unduh Tiket
              </Button>
              <Button size="sm" variant="outline" icon={Printer} onClick={handlePrint} fullWidth>
                Cetak
              </Button>
              <Button size="sm" variant="outline" icon={Star} onClick={() => toast.info('Penilaian', 'Fitur penilaian akan segera hadir.')} fullWidth>
                Nilai Layanan
              </Button>
            </div>
          </div>
        )}

        {/* Generic actions for everyone */}
        <div className="rounded-2xl border border-border bg-card shadow-lg p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Lainnya</p>
          <div className="space-y-2">
            <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => { onDataChanged(); toast.info('Dimuat ulang', 'Data laporan diperbarui.'); }} fullWidth>
              Muat Ulang
            </Button>
            <Button size="sm" variant="ghost" icon={Printer} onClick={handlePrint} fullWidth>
              Cetak / PDF
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.mp4,.mov"
          className="hidden"
          aria-label="Unggah berkas"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileUpload(uploadCategory, f);
            e.target.value = '';
          }}
        />
      </div>

      <StatusUpdateModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        complaint={complaint}
        agencies={agencies}
        onSuccess={() => {
          setStatusModalOpen(false);
          toast.success('Status diperbarui', 'Status laporan berhasil diperbarui.');
          onDataChanged();
        }}
      />
    </>
  );
};
