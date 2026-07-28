import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-900 text-white flex items-center justify-center mx-auto shadow-lg">
          <ShieldCheck className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Tentang SIPIL BAUBAU</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Sistem Pengaduan Infrastruktur Berbasis Web dengan Pemetaan Lokasi GIS dan Monitoring Penanganan Laporan Real-Time di Kota Baubau
        </p>
      </div>

      {/* Main Vision */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900">Maksud & Tujuan Aplikasi</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          SIPIL BAUBAU dikembangkan sebagai wujud komitmen Pemerintah Kota Baubau dalam mewujudkan tata kelola pemerintahan yang responsif, transparan, dan akuntabel. Aplikasi ini mempermudah masyarakat Kota Baubau di 8 Kecamatan (Wolio, Betoambari, Murhum, Kokalukuna, Lea-Lea, Sorawolio, Bungi, dan Batupoaro) dalam melaporkan setiap kerusakan jalan, jembatan, saluran air/drainase, lampu jalan (PJU), fasilitas publik, dan kebersihan.
        </p>
      </div>

      {/* OPD Partners Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 text-center">Organisasi Perangkat Daerah (OPD) Terkait</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <h4 className="font-bold text-sm text-teal-800">Dinas PUPR Kota Baubau</h4>
            <p className="text-xs text-slate-500">Penanganan perbaikan badan jalan, jembatan, drainase perkotaan, dan tata ruang.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <h4 className="font-bold text-sm text-teal-800">Dinas PERKIM Kota Baubau</h4>
            <p className="text-xs text-slate-500">Pengelolaan jaringan Penerangan Jalan Umum (PJU) dan pemukiman warga.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <h4 className="font-bold text-sm text-teal-800">Dinas Lingkungan Hidup Kota Baubau</h4>
            <p className="text-xs text-slate-500">Pengangkutan sampah liar, kebersihan TPS, dan pemangkasan pohon tumbang.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <h4 className="font-bold text-sm text-teal-800">Dinas Perhubungan Kota Baubau</h4>
            <p className="text-xs text-slate-500">Perbaikan rambu lalu lintas, cermin tikungan, dan penerangan markah jalan.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
