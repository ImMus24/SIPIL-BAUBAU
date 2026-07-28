import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Stepper } from '../components/ui/Stepper';
import { Tag } from '../components/ui/Tag';
import { complaintService } from '../services/complaintService';
import { MapPin, Camera, Send, ChevronLeft, ArrowRight } from 'lucide-react';

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

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subdistrict, setSubdistrict] = useState('');
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const categoryNames: Record<number, string> = {
    1: 'Jalan Rusak', 2: 'Drainase', 3: 'Lampu Jalan',
    4: 'Sampah', 5: 'Taman Kota', 6: 'Lainnya',
  };
  const categoryColors: Record<number, string> = {
    1: 'from-amber-500 to-orange-600', 2: 'from-sky-400 to-blue-600',
    3: 'from-yellow-400 to-amber-500', 4: 'from-teal-400 to-emerald-600',
    5: 'from-emerald-400 to-green-600',
  };

  const handleNext = () => {
    setError('');
    if (step === 0 && !categoryId) { setError('Pilih kategori laporan.'); return; }
    if (step === 1 && (!subdistrict || !address)) { setError('Lengkapi data lokasi.'); return; }
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
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message :
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response: { data: { message: string } } }).response?.data?.message || 'Gagal mengirim laporan.'
          : 'Gagal mengirim laporan. Silakan coba lagi.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="px-4 sm:px-8 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Laporan Berhasil Dikirim!</h1>
          <p className="text-muted-foreground mb-2">Kode tiket laporan Anda:</p>
          <p className="text-lg font-mono font-bold text-primary mb-6">{ticketCode}</p>
          <p className="text-sm text-muted-foreground mb-8">
            Simpan kode tiket ini untuk melacak status laporan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(`/complaint/${ticketCode}`)}>
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
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-black text-foreground">Buat Laporan Baru</h1>
          <p className="text-muted-foreground mt-1">Laporkan kerusakan infrastruktur di Kota Baubau</p>
        </div>

        <Stepper steps={steps} currentStep={step} onChange={setStep} className="mb-10" />

        {error && (
          <div className="p-4 mb-4 bg-danger/10 border border-danger/20 text-danger text-sm font-medium rounded-xl">
            {error}
          </div>
        )}

        {/* Step 0: Category */}
        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
            {[1, 2, 3, 4, 5, 6].map((id) => {
              const color = categoryColors[id] || 'from-slate-400 to-slate-600';
              return (
                <button
                  key={id}
                  onClick={() => { setCategoryId(id); handleNext(); }}
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${
                    categoryId === id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
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
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Lokasi akan ditentukan berdasarkan alamat
            </p>
            <div className="flex gap-3">
              <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(0)}>Kembali</Button>
              <Button fullWidth icon={ArrowRight} iconPosition="right" onClick={handleNext}>Selanjutnya</Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <Input label="Nama Pelapor" placeholder="Nama lengkap" value={reporterName} onChange={(e) => setReporterName(e.target.value)} />
            <Input label="Nomor Telepon" placeholder="08xx xxxx xxxx" value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)} />
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
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h3 className="font-bold text-lg">Ringkasan Laporan</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['Kategori', categoryNames[categoryId ?? 1]],
                  ['Kecamatan', subdistrict],
                  ['Alamat', address],
                  ['Judul', title],
                  ['Deskripsi', description],
                  ['Urgensi', urgencyOptions.find((u) => u.value === urgency)?.label || '-'],
                  ['Nama Pelapor', reporterName],
                  ['No. HP', reporterPhone || '-'],
                  ['Foto', files.length > 0 ? `${files.length} file` : 'Tidak ada'],
                ].map(([label, value]) => (
                  <div key={label} className={label === 'Deskripsi' || label === 'Alamat' ? 'col-span-2' : ''}>
                    <p className="text-xs text-muted-foreground font-medium">{label}</p>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border cursor-pointer hover:bg-accent transition-colors">
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload Foto</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
              </label>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <Tag key={i} variant="info" removable onRemove={() => setFiles(files.filter((_, j) => j !== i))}>{f.name}</Tag>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(2)}>Kembali</Button>
              <Button fullWidth loading={loading} icon={Send} iconPosition="right" onClick={handleSubmit}>Kirim Laporan</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitComplaintPage;
