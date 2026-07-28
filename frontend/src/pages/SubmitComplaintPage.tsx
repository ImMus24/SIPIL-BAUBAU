import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { BaubauSubdistrict, UrgencyLevel, Complaint } from '../types';
import { Modal } from '../components/ui/Modal';
import { CheckCircle2, UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';

const SUBDISTRICTS: BaubauSubdistrict[] = [
  'Wolio',
  'Betoambari',
  'Murhum',
  'Kokalukuna',
  'Lea-Lea',
  'Sorawolio',
  'Bungi',
  'Batupoaro',
];

const CATEGORIES_WIZARD = [
  { id: 1, name: 'Jalan & Jembatan', icon: 'edit_road' },
  { id: 3, name: 'Penerangan Jalan', icon: 'light' },
  { id: 2, name: 'Drainase & Air', icon: 'waves' },
  { id: 5, name: 'Fasilitas Publik', icon: 'park' },
  { id: 4, name: 'Sampah & Kebersihan', icon: 'delete_sweep' },
  { id: 6, name: 'Lalu Lintas', icon: 'traffic' },
  { id: 7, name: 'Gedung Pemerintah', icon: 'domain' },
  { id: 8, name: 'Lainnya', icon: 'more_horiz' },
];

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState<Complaint | null>(null);

  // Form States
  const [categoryId, setCategoryId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('sedang');
  const [photos, setPhotos] = useState<File[]>([]);
  const [subdistrict, setSubdistrict] = useState<BaubauSubdistrict>('Wolio');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(-5.4642);
  const [lng, setLng] = useState<number>(122.6035);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!title || !description) {
        alert('Harap isi judul dan deskripsi laporan terlebih dahulu.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!address) {
        alert('Harap isi alamat lengkap atau patokan lokasi.');
        return;
      }
      setCurrentStep(5);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await complaintService.createComplaint({
        title,
        description,
        category_id: categoryId,
        urgency,
        subdistrict,
        address,
        latitude: lat,
        longitude: lng,
        reporter_name: isAnonymous ? 'Warga Anonim Baubau' : reporterName || 'Masyarakat Baubau',
        reporter_phone: isAnonymous ? '08XXXXXXXXXX' : reporterPhone,
        reporter_email: reporterEmail,
        photos,
      });

      setCreatedResult(res);
    } catch {
      alert('Gagal mengirimkan pengaduan. Harap periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3fe] py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="space-y-3">
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#191b23]">
            Buat Laporan Baru
          </h1>
          <p className="text-base text-[#434655] leading-relaxed max-w-2xl">
            Sampaikan keluhan atau aspirasi Anda terkait infrastruktur di Kota Baubau. Kami berkomitmen untuk merespons setiap laporan dengan cepat dan tepat.
          </p>
        </div>

        {/* 5-Step Progress Indicator Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1e2ed] shadow-xs">
          <div className="grid grid-cols-5 gap-2 relative">
            <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-[#e1e2ed] -z-0"></div>
            
            {[
              { num: 1, label: 'Kategori' },
              { num: 2, label: 'Detail' },
              { num: 3, label: 'Foto' },
              { num: 4, label: 'Lokasi' },
              { num: 5, label: 'Review' },
            ].map((step) => {
              const active = currentStep === step.num;
              const completed = currentStep > step.num;
              return (
                <div key={step.num} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                      active
                        ? 'bg-[#004ac6] text-white shadow-md shadow-[#004ac6]/20 ring-4 ring-[#dbe1ff]'
                        : completed
                        ? 'bg-[#004ac6] text-white'
                        : 'bg-[#e1e2ed] text-slate-500'
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      active ? 'text-[#004ac6] font-bold' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Wizard Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e1e2ed] shadow-xs space-y-8">
          
          {/* STEP 1: Pilih Kategori Laporan */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#191b23]">
                Pilih Kategori Laporan
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {CATEGORIES_WIZARD.map((cat) => {
                  const selected = categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`p-6 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-3 min-h-[150px] ${
                        selected
                          ? 'border-[#004ac6] bg-[#dbe1ff]/40 shadow-md ring-2 ring-[#004ac6]/20'
                          : 'border-[#e1e2ed] bg-white hover:border-[#004ac6] hover:bg-slate-50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-4xl ${selected ? 'text-[#004ac6]' : 'text-slate-600'}`}>
                        {cat.icon}
                      </span>
                      <span className={`text-sm font-bold ${selected ? 'text-[#004ac6]' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Detail Laporan */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#191b23]">
                Isi Detail Pengaduan Kerusakan
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block font-bold text-slate-800 mb-2 text-sm">Judul Laporan Pengaduan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jalan Berlubang Parah di Depan Benteng Keraton Wolio"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-base font-medium rounded-xl border border-[#e1e2ed] p-4 bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#004ac6] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-2 text-sm">Tingkat Urgensi Kerusakan *</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full text-base font-semibold rounded-xl border border-[#e1e2ed] p-4 bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#004ac6] transition-colors"
                  >
                    <option value="rendah">Rendah (Kerusakan Ringan)</option>
                    <option value="sedang">Sedang (Mengganggu Kenyamanan Warga)</option>
                    <option value="tinggi">Tinggi (Beresiko Kecelakaan Lalu Lintas)</option>
                    <option value="darurat">Darurat (Bencana / Membahayakan Nyawa)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-2 text-sm">Deskripsi Lengkap Kerusakan *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Ceritakan detail kerusakan, estimasi ukuran lubang/panjang kerusakan, waktu terjadinya, atau dampaknya terhadap warga..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-base font-medium rounded-xl border border-[#e1e2ed] p-4 bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#004ac6] transition-colors"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Foto Bukti */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#191b23]">
                Upload Foto Bukti Kerusakan
              </h3>
              <p className="text-sm text-slate-500">Lampirkan foto jernih dari lokasi untuk mempermudah tim teknis OPD.</p>

              <div className="border-2 border-dashed border-[#e1e2ed] rounded-3xl p-10 text-center hover:border-[#004ac6] transition-colors bg-[#f8fafc]">
                <UploadCloud className="w-14 h-14 text-[#004ac6] mx-auto mb-4" />
                <p className="text-base font-bold text-slate-800">Pilih file foto dari perangkat Anda</p>
                <p className="text-sm text-slate-500 mt-1">Format JPG, PNG, atau WEBP (Maksimal 5MB per file)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="mt-5 text-sm mx-auto"
                />
                {photos.length > 0 && (
                  <p className="text-sm font-bold text-[#004ac6] mt-3">
                    Terpilih {photos.length} file foto bukti.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Pilih Lokasi Peta GIS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#191b23]">
                Penentuan Lokasi Presisi GIS
              </h3>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-2 text-sm">Kecamatan di Kota Baubau *</label>
                    <select
                      value={subdistrict}
                      onChange={(e) => setSubdistrict(e.target.value as BaubauSubdistrict)}
                      className="w-full text-base font-semibold rounded-xl border border-[#e1e2ed] p-4 bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#004ac6] transition-colors"
                    >
                      {SUBDISTRICTS.map((sub) => (
                        <option key={sub} value={sub}>Kecamatan {sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-2 text-sm">Alamat / Patokan Jalan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jl. Sultan Murhum No. 45 dekat Gerbang Keraton"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-base font-medium rounded-xl border border-[#e1e2ed] p-4 bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#004ac6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-2 text-sm">Tandai Lokasi Presisi di Peta GIS (Klik pada peta):</label>
                  <BaubauMap
                    pickLocation={true}
                    selectedLat={lat}
                    selectedLng={lng}
                    onLocationSelect={(latitude, longitude) => {
                      setLat(latitude);
                      setLng(longitude);
                    }}
                    height="360px"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Konfirmasi Pelapor */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#191b23]">
                Review & Konfirmasi Identitas Pelapor
              </h3>

              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-[#e1e2ed] space-y-4 text-sm text-slate-700">
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-slate-500">Judul Laporan:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%]">{title}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-slate-500">Kecamatan / Lokasi:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%]">{subdistrict} ({address})</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-slate-500">Urgensi:</span>
                  <span className="font-bold text-[#004ac6] capitalize">{urgency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Foto Lampiran:</span>
                  <span className="font-bold text-slate-900">{photos.length} Foto</span>
                </div>
              </div>

              <div className="space-y-5 pt-2">
                <label className="flex items-center space-x-3 text-sm font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-[#004ac6] rounded"
                  />
                  <span>Kirimkan laporan secara Anonim (Identitas dirahasiakan)</span>
                </label>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-2 text-sm">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="Nama lengkap Anda"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        className="w-full p-3.5 bg-[#f8fafc] border border-[#e1e2ed] rounded-xl text-base transition-colors focus:outline-none focus:border-[#004ac6]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-2 text-sm">No. WhatsApp / HP</label>
                      <input
                        type="tel"
                        placeholder="0812XXXXXXXX"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        className="w-full p-3.5 bg-[#f8fafc] border border-[#e1e2ed] rounded-xl text-base transition-colors focus:outline-none focus:border-[#004ac6]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-2 text-sm">Email (Opsional)</label>
                      <input
                        type="email"
                        placeholder="email@domain.com"
                        value={reporterEmail}
                        onChange={(e) => setReporterEmail(e.target.value)}
                        className="w-full p-3.5 bg-[#f8fafc] border border-[#e1e2ed] rounded-xl text-base transition-colors focus:outline-none focus:border-[#004ac6]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons: Batal & Lanjut */}
          <div className="pt-6 border-t border-[#e1e2ed] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-7 py-3.5 border border-[#e1e2ed] text-slate-700 font-bold text-sm rounded-full hover:bg-slate-50 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-rose-600 hover:underline text-sm font-bold"
              >
                Batal
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-9 py-4 bg-[#004ac6] hover:bg-[#2563eb] text-white text-base font-bold rounded-full shadow-lg shadow-[#004ac6]/20 transition-all flex items-center space-x-2"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-9 py-4 bg-[#004ac6] hover:bg-[#2563eb] text-white text-base font-bold rounded-full shadow-lg shadow-[#004ac6]/20 transition-all flex items-center space-x-2"
              >
                <span>{loading ? 'Mengirim...' : 'Kirim Pengaduan'}</span>
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
              </button>
            )}
          </div>

        </div>

        {/* Success Modal */}
        {createdResult && (
          <Modal
            isOpen={!!createdResult}
            onClose={() => {
              setCreatedResult(null);
              navigate(`/track?ticket=${createdResult.ticket_code}`);
            }}
            title="Laporan Pengaduan Berhasil Terdaftar!"
            maxWidth="md"
          >
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <p className="text-sm text-slate-500">Kode Tiket Pelacakan Resmi Anda:</p>
                <div className="inline-block my-3 px-6 py-3 bg-slate-900 text-amber-400 font-mono font-black text-2xl rounded-2xl shadow-md border border-slate-800">
                  {createdResult.ticket_code}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Simpan kode tiket ini untuk mengecek progres penanganan oleh Dinas terkait di Kota Baubau.
                </p>
              </div>

              <button
                onClick={() => {
                  setCreatedResult(null);
                  navigate(`/track?ticket=${createdResult.ticket_code}`);
                }}
                className="w-full py-4 bg-[#004ac6] text-white font-bold text-base rounded-xl shadow-md hover:bg-[#2563eb] transition-colors"
              >
                Lihat Progres Laporan Saya
              </button>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};
