import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Stepper } from '../components/ui/Stepper';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { MapPin, Camera, Send, ChevronLeft, ArrowRight } from 'lucide-react';

const steps = [
  { id: 'category', label: 'Kategori', description: 'Pilih jenis' },
  { id: 'location', label: 'Lokasi', description: 'Tandai titik' },
  { id: 'details', label: 'Detail', description: 'Deskripsi' },
  { id: 'confirm', label: 'Kirim', description: 'Konfirmasi' },
];

const categories = [
  { id: 1, name: 'Jalan Rusak', icon: 'edit_road', color: 'from-amber-500 to-orange-600' },
  { id: 2, name: 'Drainase', icon: 'waves', color: 'from-sky-400 to-blue-600' },
  { id: 3, name: 'Lampu Jalan', icon: 'light', color: 'from-yellow-400 to-amber-500' },
  { id: 4, name: 'Sampah', icon: 'delete_sweep', color: 'from-teal-400 to-emerald-600' },
  { id: 5, name: 'Taman Kota', icon: 'park', color: 'from-emerald-400 to-green-600' },
  { id: 6, name: 'Lainnya', icon: 'more_horiz', color: 'from-slate-400 to-slate-600' },
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

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subdistrict, setSubdistrict] = useState('');
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleNext = () => {
    setError('');
    if (step === 0 && !categoryId) { setError('Pilih kategori laporan.'); return; }
    if (step === 1 && (!subdistrict || !address)) { setError('Lengkapi data lokasi.'); return; }
    if (step === 2 && (!title || !description || !urgency)) { setError('Lengkapi detail laporan.'); return; }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate submit
    setTimeout(() => {
      setLoading(false);
      navigate('/track?success=1');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="px-4 sm:px-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-black text-foreground">Buat Laporan Baru</h1>
          <p className="text-muted-foreground mt-1">Laporkan kerusakan infrastruktur di Kota Baubau</p>
        </div>

        <Stepper steps={steps} currentStep={step} onChange={setStep} className="mb-10" />

        {error && (
          <div className="p-4 mb-4 bg-danger-bg border border-danger-border text-danger text-sm font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Step 0: Category */}
        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategoryId(cat.id); handleNext(); }}
                className={`p-5 rounded-2xl border-2 text-center transition-all ${
                  categoryId === cat.id ? 'border-primary bg-primary-light' : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-2`}>
                  <span className="material-symbols-outlined text-white text-xl">{cat.icon}</span>
                </div>
                <p className="text-sm font-bold text-foreground">{cat.name}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <Select
              label="Kecamatan"
              required
              placeholder="Pilih kecamatan"
              options={subdistricts}
              value={subdistrict}
              onChange={(e) => setSubdistrict(e.target.value)}
            />
            <Textarea
              label="Alamat Lengkap"
              required
              placeholder="Contoh: Jl. Wolio Raya No. 10, Kel. ..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
            <div className="bg-muted rounded-2xl h-48 flex items-center justify-center border border-border">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Peta interaktif akan ditampilkan di sini</p>
              </div>
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
            <Input
              label="Nama Pelapor"
              required
              placeholder="Nama lengkap"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
            />
            <Input
              label="No. HP"
              required
              placeholder="08xx xxxx xxxx"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
            />
            <Input
              label="Judul Laporan"
              required
              placeholder="Contoh: Jalan Berlubang di Depan SD Negeri ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              charCount
            />
            <Textarea
              label="Deskripsi"
              required
              placeholder="Jelaskan detail kerusakan yang Anda lihat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              charCount
              rows={4}
            />
            <Select
              label="Tingkat Urgensi"
              required
              placeholder="Pilih tingkat urgensi"
              options={urgencyOptions}
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            />
            {/* Photo upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Foto (opsional)</label>
              <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary transition-colors bg-muted/50">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Klik untuk upload foto</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
              </label>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((f, i) => (
                    <Tag key={i} variant="info" removable onRemove={() => setFiles(files.filter((_, j) => j !== i))}>
                      {f.name}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(1)}>Kembali</Button>
              <Button fullWidth icon={ArrowRight} iconPosition="right" onClick={handleNext}>Selanjutnya</Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <Card variant="bordered">
              <div className="space-y-3 text-sm">
                <h3 className="font-heading font-bold text-lg text-foreground">Ringkasan Laporan</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Kategori', categories.find((c) => c.id === categoryId)?.name || '-'],
                    ['Kecamatan', subdistrict],
                    ['Alamat', address],
                    ['Judul', title],
                    ['Deskripsi', description],
                    ['Urgensi', urgencyOptions.find((u) => u.value === urgency)?.label || '-'],
                    ['Pelapor', reporterName],
                    ['No. HP', reporterPhone],
                  ].map(([label, value]) => (
                    <div key={label} className={label === 'Deskripsi' || label === 'Alamat' ? 'col-span-2' : ''}>
                      <p className="text-xs text-muted-foreground font-medium">{label}</p>
                      <p className="font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <div className="flex gap-3">
              <Button variant="outline" icon={ChevronLeft} onClick={() => setStep(2)}>Kembali</Button>
              <Button fullWidth loading={loading} icon={Send} iconPosition="right" onClick={handleSubmit}>
                Kirim Laporan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
