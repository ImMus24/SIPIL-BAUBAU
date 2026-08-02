import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Stepper } from '../components/ui/Stepper';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import { useToast } from '../components/ui/Toast';
import {
  MapPin, Camera, Send, ChevronLeft, ArrowRight, CheckCircle2, X,
} from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  { id: 'category', label: 'Kategori', description: 'Pilih jenis' },
  { id: 'location', label: 'Lokasi', description: 'Tandai titik' },
  { id: 'details', label: 'Detail', description: 'Deskripsi' },
  { id: 'confirm', label: 'Kirim', description: 'Konfirmasi' },
];

const subdistricts = [
  { value: 'Wolio', label: 'Wolio' },
  { value: 'Betoambari', label: 'Betoambari' },
  { value: 'Murhum', label: 'Murhum' },
  { value: 'Kokalukuna', label: 'Kokalukuna' },
  { value: 'Lea-Lea', label: 'Lea-Lea' },
  { value: 'Sorawolio', label: 'Sorawolio' },
  { value: 'Bungi', label: 'Bungi' },
  { value: 'Batupoaro', label: 'Batupoaro' },
];

const urgencyOptions = [
  { value: 'rendah', label: 'Rendah - Tidak mengganggu aktivitas' },
  { value: 'sedang', label: 'Sedang - Cukup mengganggu' },
  { value: 'tinggi', label: 'Tinggi - Mengganggu aktivitas warga' },
  { value: 'darurat', label: 'Darurat - Berbahaya! Butuh penanganan segera' },
];

const DRAFT_KEY = 'sipil-baubau-draft';

interface DraftState {
  categoryId: number | null;
  subdistrict: string;
  address: string;
  title: string;
  description: string;
  urgency: string;
  reporterName: string;
  reporterPhone: string;
  lat: number;
  lng: number;
}

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [complaintId, setComplaintId] = useState<number | null>(null);

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subdistrict, setSubdistrict] = useState('');
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [lat, setLat] = useState(-5.4642);
  const [lng, setLng] = useState(122.6035);
  const [draftSaved, setDraftSaved] = useState(false);

  const categoryNames: Record<number, string> = {
    1: 'Jalan Rusak', 2: 'Drainase', 3: 'Lampu Jalan',
    4: 'Sampah', 5: 'Taman Kota', 6: 'Lainnya',
  };
  const categoryColors: Record<number, string> = {
    1: 'from-amber-500 to-orange-600', 2: 'from-sky-400 to-blue-600',
    3: 'from-yellow-400 to-amber-500', 4: 'from-teal-400 to-emerald-600',
    5: 'from-emerald-400 to-green-600',
  };

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d: DraftState = JSON.parse(raw);
        setCategoryId(d.categoryId);
        setSubdistrict(d.subdistrict);
        setAddress(d.address);
        setTitle(d.title);
        setDescription(d.description);
        setUrgency(d.urgency);
        setReporterName(d.reporterName);
        setReporterPhone(d.reporterPhone);
        if (d.lat && d.lng) { setLat(d.lat); setLng(d.lng); }
      }
    } catch { /* ignore corrupt draft */ }
  }, []);

  // Auto-save draft (debounced-ish: saves on every state change)
  useEffect(() => {
    if (success) return;
    const timer = setTimeout(() => {
      const draft: DraftState = {
        categoryId, subdistrict, address, title, description,
        urgency, reporterName, reporterPhone, lat, lng,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setDraftSaved(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [categoryId, subdistrict, address, title, description, urgency, reporterName, reporterPhone, lat, lng, success]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftSaved(false);
  };

  const handleNext = () => {
    setError('');
    if (step === 0 && !categoryId) { setError('Pilih kategori laporan.'); return; }
    if (step === 1 && (!subdistrict || !address)) { setError('Lengkapi data lokasi (kecamatan & alamat).'); return; }
    if (step === 2 && (!title || !description || !urgency || !reporterName)) {
      setError('Lengkapi detail laporan (judul, deskripsi, urgensi, nama pelapor).');
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await complaintService.createComplaint({
        title,
        description,
        category_id: categoryId!,
        subdistrict,
        address,
        urgency,
        reporter_name: reporterName,
        reporter_phone: reporterPhone || undefined,
        photos: files.length > 0 ? files : undefined,
      });
      setTicketCode(result.ticket_code);
      setComplaintId(result.id);
      setSuccess(true);
      clearDraft();
      toast.success('Laporan Terkirim!', `Kode tiket: ${result.ticket_code}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message :
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response: { data: { message: string } } }).response?.data?.message || 'Gagal mengirim laporan.'
          : 'Gagal mengirim laporan. Silakan coba lagi.';
      setError(msg);
      toast.error('Gagal Mengirim', msg);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="px-4 sm:px-8 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Laporan Berhasil Dikirim!</h1>
          <p className="text-muted-foreground mb-2">Kode tiket laporan Anda:</p>
          <p className="text-lg font-mono font-bold text-primary mb-6">{ticketCode}</p>
          <p className="text-sm text-muted-foreground mb-8">
            Simpan kode tiket ini untuk melacak status laporan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(complaintId ? `/complaints/${complaintId}` : `/track?ticket=${ticketCode}`)}>
              Lihat Detail Laporan
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="px-4 sm:px-8 max-w-3xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-black text-foreground">Buat Laporan Baru</h1>
            <p className="text-muted-foreground mt-1">Laporkan kerusakan infrastruktur di Kota Baubau</p>
          </div>
          {draftSaved && (
            <button
              onClick={clearDraft}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-danger transition-colors shrink-0 mt-1"
              title="Hapus draft tersimpan"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Hapus Draft
            </button>
          )}
        </div>

        <Stepper steps={steps} currentStep={step} onChange={setStep} className="mb-10" />

        {draftSaved && step > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-xl bg-info-bg border border-info-border text-xs font-medium text-foreground/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-info" aria-hidden="true" />
            Draft tersimpan otomatis di perangkat Anda.
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 bg-danger-bg border border-danger-border text-danger text-sm font-medium rounded-xl" role="alert">
            {error}
          </div>
        )}

        {/* Step 0: Category */}
        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
            {[1, 2, 3, 4, 5, 6].map((id) => {
              const color = categoryColors[id] || 'from-slate-400 to-slate-600';
              const isSelected = categoryId === id;
              return (
                <button
                  key={id}
                  onClick={() => { setCategoryId(id); handleNext(); }}
                  className={cn(
                    'p-5 rounded-2xl border-2 text-center transition-all hover-lift',
                    isSelected ? 'border-primary bg-primary-light/40 dark:bg-primary/10 shadow-glow' : 'border-border bg-card hover:border-primary/50',
                  )}
                  aria-pressed={isSelected}
                >
                  <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mx-auto mb-2 transition-transform', color, isSelected && 'scale-110')}>
                    <span className="text-white text-xl font-bold">{categoryNames[id][0]}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{categoryNames[id]}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Kecamatan"
                options={subdistricts}
                placeholder="Pilih kecamatan"
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
              />
              <Input
                label="Alamat Lengkap"
                placeholder="Contoh: Jl. Wolio Raya No. 10"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Real map picker */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-1.5">
                Tandai Titik Lokasi <span className="text-danger">*</span>
              </p>
              <BaubauMap
                pickLocation
                selectedLat={lat}
                selectedLng={lng}
                onLocationSelect={(lat2, lng2) => { setLat(lat2); setLng(lng2); }}
                height="320px"
                showLegend={false}
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                Klik pada peta untuk memindahkan pin lokasi kerusakan.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(0)}>Kembali</Button>
              <Button fullWidth icon={ArrowRight} iconPosition="right" onClick={handleNext}>Selanjutnya</Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nama Pelapor" placeholder="Nama lengkap" value={reporterName} onChange={(e) => setReporterName(e.target.value)} />
              <Input label="Nomor Telepon" placeholder="08xx xxxx xxxx" value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)} />
            </div>
            <Input label="Judul Laporan" placeholder="Contoh: Jalan Berlubang di Depan SD" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea label="Deskripsi" rows={4} placeholder="Jelaskan detail kerusakan..." value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select label="Tingkat Urgensi" options={urgencyOptions} placeholder="Pilih tingkat urgensi" value={urgency} onChange={(e) => setUrgency(e.target.value)} />
            <div className="flex gap-3">
              <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(1)}>Kembali</Button>
              <Button fullWidth icon={ArrowRight} iconPosition="right" onClick={handleNext}>Selanjutnya</Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-sm">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" aria-hidden="true" />
                Ringkasan Laporan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  ['Kategori', categoryNames[categoryId ?? 1]],
                  ['Kecamatan', subdistrict],
                  ['Alamat', address],
                  ['Judul', title],
                  ['Deskripsi', description],
                  ['Urgensi', urgencyOptions.find((u) => u.value === urgency)?.label || '-'],
                  ['Nama Pelapor', reporterName],
                  ['No. HP', reporterPhone || '-'],
                  ['Koordinat', `${lat.toFixed(5)}, ${lng.toFixed(5)}`],
                ].map(([label, value]) => (
                  <div key={label} className={label === 'Deskripsi' || label === 'Alamat' ? 'sm:col-span-2' : ''}>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <p className="font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo upload with preview grid */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" aria-hidden="true" />
                Foto Pendukung {files.length > 0 && <span className="text-muted-foreground font-medium">({files.length})</span>}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {files.map((f, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={`Pratinjau foto ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Hapus foto ${i + 1}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
                      {f.name.length > 12 ? `${f.name.slice(0, 12)}…` : f.name}
                    </span>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center gap-1.5 aspect-square rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-primary-light/20 transition-all text-muted-foreground hover:text-primary">
                  <Camera className="w-5 h-5" aria-hidden="true" />
                  <span className="text-[11px] font-semibold">Tambah</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2.5">
                Unggah foto kerusakan untuk mempercepat verifikasi (opsional, maks. beberapa file).
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(2)}>Kembali</Button>
              <Button fullWidth loading={loading} icon={Send} iconPosition="right" onClick={handleSubmit}>
                {loading ? 'Mengirim...' : 'Kirim Laporan'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitComplaintPage;
