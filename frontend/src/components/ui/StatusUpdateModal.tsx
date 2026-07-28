import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Modal } from './Modal';
import { complaintService } from '../../services/complaintService';
import type { Complaint, Agency } from '../../types';
import { Camera, Send, X } from 'lucide-react';

interface StatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  complaint: Complaint;
  agencies?: Agency[];
  onSuccess: (updated: Complaint) => void;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  menunggu: ['diproses', 'ditolak'],
  diproses: ['selesai', 'ditolak'],
  selesai: [],
  ditolak: [],
};

const STATUS_OPTIONS: Record<string, { value: string; label: string; color: string }> = {
  diproses: { value: 'diproses', label: 'Proses Laporan', color: 'bg-info text-info' },
  ditolak: { value: 'ditolak', label: 'Tolak Laporan', color: 'bg-danger text-danger' },
  selesai: { value: 'selesai', label: 'Selesaikan Laporan', color: 'bg-success text-success' },
};

const STATUS_PLACEHOLDER: Record<string, string> = {
  diproses: 'Catatan verifikasi dan rencana tindak lanjut...',
  ditolak: 'Alasan penolakan laporan...',
  selesai: 'Catatan penyelesaian penanganan...',
};

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  open,
  onClose,
  complaint,
  agencies = [],
  onSuccess,
}) => {
  const availableStatuses = STATUS_TRANSITIONS[complaint.status] ?? [];
  const [status, setStatus] = useState(availableStatuses[0] ?? '');
  const [notes, setNotes] = useState('');
  const [agencyId, setAgencyId] = useState<number | ''>(complaint.agency_id ?? '');
  const [photoProof, setPhotoProof] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setStatus(availableStatuses[0] ?? '');
      setNotes('');
      setAgencyId(complaint.agency_id ?? '');
      setPhotoProof(null);
      setPhotoPreview(null);
      setError('');
    }
  }, [open, complaint.status]);

  // Determine if agency selection is needed (for status 'diproses')
  const needsAgency = status === 'diproses' && !complaint.agency_id;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoProof(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!status) { setError('Pilih status tujuan.'); return; }
    if (!notes.trim()) { setError('Catatan wajib diisi.'); return; }

    setLoading(true);
    setError('');

    try {
      const updated = await complaintService.updateComplaintStatus(
        complaint.id,
        status,
        notes,
        needsAgency ? (agencyId || undefined) : undefined,
        photoProof || undefined,
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal memperbarui status.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (availableStatuses.length === 0) {
    return (
      <Modal isOpen={open} onClose={onClose} title="Status Laporan">
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Laporan dengan status <strong>{complaint.status === 'selesai' ? 'Selesai' : 'Ditolak'}</strong> tidak dapat diubah lagi.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
        </div>
      </Modal>
    );
  }

  const currentOption = STATUS_OPTIONS[status];

  return (
    <Modal isOpen={open} onClose={onClose} title="Perbarui Status Laporan">
      <div className="space-y-5">
        {/* Info Tiket */}
        <div className="bg-muted rounded-xl p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kode Tiket</span>
            <span className="font-mono font-bold text-foreground">{complaint.ticket_code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Judul</span>
            <span className="font-semibold text-foreground text-right max-w-[250px]">{complaint.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status Saat Ini</span>
            <span className="font-semibold">{complaint.status}</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-danger-bg border border-danger-border text-danger text-sm font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Pilihan Status */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Tujuan Status</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableStatuses.map((s) => {
              const opt = STATUS_OPTIONS[s];
              if (!opt) return null;
              const isSelected = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setStatus(s);
                    setError('');
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${opt.color}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Catatan */}
        <Textarea
          label="Catatan"
          placeholder={STATUS_PLACEHOLDER[status] || 'Catatan...'}
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Pilih OPD (hanya jika 'diproses' dan belum ada agency) */}
        {needsAgency && agencies.length > 0 && (
          <Select
            label="OPD Penanggung Jawab"
            options={agencies.map((a) => ({ value: String(a.id), label: a.name }))}
            placeholder="Pilih OPD..."
            value={agencyId ? String(agencyId) : ''}
            onChange={(e) => setAgencyId(e.target.value ? Number(e.target.value) : '')}
          />
        )}

        {/* Upload Foto Bukti */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Foto Bukti (opsional)</label>
          {photoPreview ? (
            <div className="relative inline-block rounded-xl overflow-hidden border border-border">
              <img src={photoPreview} alt="Preview" className="h-32 w-32 object-cover" />
              <button
                type="button"
                onClick={() => { setPhotoProof(null); setPhotoPreview(null); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:bg-accent transition-colors">
              <Camera className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Klik untuk upload foto</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button
            loading={loading}
            icon={Send}
            iconPosition="right"
            onClick={handleSubmit}
            className="flex-1"
          >
            {currentOption?.label || 'Simpan'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
