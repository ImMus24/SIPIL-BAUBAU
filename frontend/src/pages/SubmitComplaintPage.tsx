import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { Category, BaubauSubdistrict, UrgencyLevel, Complaint } from '../types';
import { Modal } from '../components/ui/Modal';
import {
  FilePlus,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';

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

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ? Number(searchParams.get('category')) : 1;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState<Complaint | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(initialCategory);
  const [urgency, setUrgency] = useState<UrgencyLevel>('sedang');
  const [subdistrict, setSubdistrict] = useState<BaubauSubdistrict>('Wolio');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(-5.4642);
  const [lng, setLng] = useState<number>(122.6035);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    complaintService.getCategories().then(setCategories);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !address) {
      alert('Harap lengkapi judul, deskripsi, dan alamat pengaduan.');
      return;
    }

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider">
          <FilePlus className="w-4 h-4 text-teal-600" />
          <span>Formulir Pengaduan Resmi Kota Baubau</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Laporkan Kerusakan Infrastruktur</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Laporan Anda langsung dikirimkan ke Dashboard Admin dan OPD Kota Baubau terkait.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Informasi Pengaduan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b pb-4">
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white font-bold text-sm flex items-center justify-center">
              1
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Detail Kerusakan Infrastruktur</h3>
              <p className="text-xs text-slate-500">Jelaskan judul, kategori, dan deskripsi masalah</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Judul Laporan Pengaduan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Jalan Berlubang Parah di Depan Benteng Keraton Wolio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Kategori Infrastruktur *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Tingkat Urgensi *</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="rendah">Rendah (Kerusakan Ringan)</option>
                  <option value="sedang">Sedang (Mengganggu kenyamanan)</option>
                  <option value="tinggi">Tinggi (Beresiko kecelakaan)</option>
                  <option value="darurat">Darurat (Bencana/Membahayakan nyawa)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Deskripsi Lengkap Kerusakan *</label>
              <textarea
                required
                rows={4}
                placeholder="Ceritakan detail kerusakan, kedalaman lubang, waktu terjadinya, atau dampaknya terhadap warga..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Step 2: Lokasi & Map Pin Picker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b pb-4">
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white font-bold text-sm flex items-center justify-center">
              2
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Lokasi Presisi & Pemetaan GIS</h3>
              <p className="text-xs text-slate-500">Pilih Kecamatan dan klik titik pada peta Kota Baubau</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Kecamatan di Kota Baubau *</label>
                <select
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value as BaubauSubdistrict)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
                >
                  {SUBDISTRICTS.map((sub) => (
                    <option key={sub} value={sub}>Kecamatan {sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Alamat Jalan / Patokan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jl. Sultan Murhum No. 45 dekat Gerbang Keraton"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-2">Pin Lokasi Peta Interaktif (Klik pada peta):</label>
              <BaubauMap
                pickLocation={true}
                selectedLat={lat}
                selectedLng={lng}
                onLocationSelect={(latitude, longitude) => {
                  setLat(latitude);
                  setLng(longitude);
                }}
                height="350px"
              />
              <div className="mt-2 text-[11px] text-teal-700 bg-teal-50 p-2.5 rounded-xl border border-teal-200 flex items-center justify-between font-mono">
                <span>Koordinat Terpilih:</span>
                <span>Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Lampiran Foto */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b pb-4">
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white font-bold text-sm flex items-center justify-center">
              3
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Upload Foto Bukti Lapangan</h3>
              <p className="text-xs text-slate-500">Sertakan 1-3 foto jernih lokasi kerusakan</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-500 transition-colors">
            <UploadCloud className="w-10 h-10 text-teal-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Pilih file foto dari perangkat Anda</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Format JPG, PNG, atau WEBP (Maksimal 5MB per file)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-3 text-xs mx-auto"
            />
            {photos.length > 0 && (
              <p className="text-xs font-bold text-teal-700 mt-2">
                Terpilih {photos.length} file foto bukti.
              </p>
            )}
          </div>
        </div>

        {/* Step 4: Identitas Pelapor */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white font-bold text-sm flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Identitas Kontak Pelapor</h3>
                <p className="text-xs text-slate-500">Untuk verifikasi dan notifikasi status penanganan</p>
              </div>
            </div>
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span>Kirimkan Anonim</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: La Ode Ahmad"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">No. WhatsApp / HP</label>
                <input
                  type="tel"
                  placeholder="0812XXXXXXXX"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="email@domain.com"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-teal-700 to-teal-900 hover:from-teal-800 hover:to-slate-900 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <span>Mengirimkan Laporan ke Pemkot Baubau...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span>Kirim Pengaduan Infrastruktur Sekarang</span>
            </>
          )}
        </button>
      </form>

      {/* Success Dialog Modal */}
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
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <p className="text-xs text-slate-500">Kode Tiket Resmi Pelacakan Anda:</p>
              <div className="inline-block my-2 px-4 py-2 bg-slate-900 text-amber-400 font-mono font-black text-xl rounded-xl border border-slate-800 shadow-md">
                {createdResult.ticket_code}
              </div>
              <p className="text-xs text-slate-600">
                Simpan kode unik ini untuk mengecek progres penanganan oleh Dinas terkait di Kota Baubau.
              </p>
            </div>

            <button
              onClick={() => {
                setCreatedResult(null);
                navigate(`/track?ticket=${createdResult.ticket_code}`);
              }}
              className="w-full py-3 bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md hover:bg-teal-800 transition-colors"
            >
              Lihat Progres Laporan Saya
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};
