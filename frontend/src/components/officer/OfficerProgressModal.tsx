import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { StatusBadge } from '../ui/Badge';
import { complaintService } from '../../services/complaintService';
import type { Complaint } from '../../types';
import {
  Camera, Send, X, MapPin, Clock, Navigation,
  CheckCircle2, Loader2,
} from 'lucide-react';

const OFFICER_STATUSES = [
  { value: 'dalam_perjalanan', label: 'Dalam Perjalanan', icon: Navigation, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'sedang_dikerjakan', label: 'Sedang Dikerjakan', icon: Clock, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'menunggu_material', label: 'Menunggu Material', icon: Loader2, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'selesai', label: 'Selesai', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
];

interface PhotoSection {
  type: 'before' | 'during' | 'after';
  label: string;
  file: File | null;
  preview: string | null;
}

interface OfficerProgressModalProps {
  open: boolean;
  onClose: () => void;
  complaint: Complaint;
  onSuccess: (updated: Complaint) => void;
}

export const OfficerProgressModal: React.FC<OfficerProgressModalProps> = ({
  open, onClose, complaint, onSuccess,
}) => {
  const [isComplete, setIsComplete] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoSection[]>([
    { type: 'before', label: 'Foto Sebelum', file: null, preview: null },
    { type: 'during', label: 'Foto Proses', file: null, preview: null },
    { type: 'after', label: 'Foto Setelah', file: null, preview: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (open) {
      setSelectedStatus('');
      setNotes('');
      setPhotos(p => p.map(ph => ({ ...ph, file: null, preview: null })));
      setError('');
      setIsComplete(false);
    }
  }, [open]);

  const handlePhotoChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diizinkan');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos(prev => prev.map(p => p.type === type ? { ...p, file, preview: reader.result as string } : p));
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedStatus && !isComplete) {
      setError('Pilih status terlebih dahulu.');
      return;
    }
    if (!notes.trim()) {
      setError('Catatan wajib diisi.');
      return;
    }

    const targetStatus = isComplete ? 'selesai' : selectedStatus;

    setLoading(true);
    setError('');

    try {
      // Build photos object from non-null uploads
      const photoMap: Record<string, File> = {};
      photos.forEach(p => { if (p.file) photoMap[p.type] = p.file; });
      const hasPhotos = Object.keys(photoMap).length > 0;

      const updated = await complaintService.updateComplaintStatus(
        complaint.id,
        targetStatus,
        notes,
        undefined,
        undefined,
        hasPhotos ? photoMap : undefined,
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

  const canComplete = isComplete || selectedStatus === 'selesai';

  return (
    <Modal isOpen={open} onClose={onClose} title="Update Progress Tugas" size="2xl">
      <div className="space-y-6">
        {/* Complaint Info */}
        <div className="bg-muted rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Kode Tiket</span>
            <p className="font-mono font-bold text-foreground">{complaint.ticket_code}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Status</span>
            <div className="mt-0.5"><StatusBadge status={complaint.status} size="sm" /></div>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">Judul</span>
            <p className="font-semibold text-foreground">{complaint.title}</p>
          </div>
          <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{complaint.subdistrict} — {complaint.address}</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 text-danger text-sm font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Status Selection */}
        {!canComplete && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Perbarui Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OFFICER_STATUSES.map((s) => {
                const Icon = s.icon;
                const isActive = selectedStatus === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => { setSelectedStatus(s.value); setIsComplete(false); setError(''); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Complete */}
        {!selectedStatus && !canComplete && (
          <button
            onClick={() => { setIsComplete(true); setSelectedStatus(''); setError(''); }}
            className="w-full p-3 rounded-xl border-2 border-dashed border-success/30 bg-success/5 hover:bg-success/10 hover:border-success/50 transition-all text-center"
          >
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
            <span className="text-sm font-bold text-success">Tandai Selesai Langsung</span>
          </button>
        )}

        {canComplete && (
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-success" />
            <p className="text-sm font-bold text-success">Tugas akan ditandai Selesai</p>
          </div>
        )}

        {/* Photo Documentation — 3 columns */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Dokumentasi Foto</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div key={photo.type} className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{photo.label}</p>
                {photo.preview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border group aspect-[4/3]">
                    <img src={photo.preview} alt={photo.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPhotos(prev => prev.map(p => p.type === photo.type ? { ...p, file: null, preview: null } : p));
                          if (fileInputRefs.current[photo.type]) fileInputRefs.current[photo.type]!.value = '';
                        }}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-opacity"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 aspect-[4/3] rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-medium">Upload Foto</span>
                    <input
                      ref={el => { fileInputRefs.current[photo.type] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoChange(photo.type, e)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">Max 5MB per foto. Format: JPG, PNG, WEBP</p>
        </div>

        {/* Notes */}
        <Textarea
          label="Catatan Progress"
          placeholder="Deskripsikan progress penanganan di lokasi..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Batal</Button>
          <Button
            loading={loading}
            icon={Send}
            iconPosition="right"
            onClick={handleSubmit}
            disabled={!notes.trim()}
            className="flex-1"
          >
            {canComplete ? 'Selesaikan Tugas' : 'Simpan Progress'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OfficerProgressModal;
