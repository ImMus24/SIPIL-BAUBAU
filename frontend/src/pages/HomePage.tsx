import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary, Category } from '../types';
import {
  FilePlus,
  Search,
  Building2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Flame,
  Award
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<StatSummary>({
    total: 148,
    menunggu: 18,
    diproses: 34,
    selesai: 88,
    ditolak: 8,
    completion_rate: 65.2,
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    complaintService.getComplaints().then(setComplaints);
    complaintService.getStatsSummary().then(setStats);
    complaintService.getCategories().then(setCategories);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section - Inspired by Official Logo Kota Baubau Shield Blue & Yellow */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-950 via-sky-900 to-slate-950 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Portal Resmi Pengaduan Kota Baubau</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Sistem Pengaduan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-sky-300">
                  Infrastruktur Kota Baubau
                </span>
              </h1>

              <p className="text-base sm:text-lg text-sky-100 font-normal max-w-2xl leading-relaxed">
                Laporkan kerusakan jalan, jembatan, PJU, dan fasilitas publik di Kota Baubau dengan pemetaan lokasi GIS presisi. Pantau status penanganan oleh Dinas terkait secara transparan dan real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/submit"
                  className="px-6 py-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <FilePlus className="w-5 h-5 text-slate-950" />
                  <span>Buat Laporan Infrastruktur</span>
                </Link>
                <Link
                  to="/track"
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-sky-300/30 text-white font-bold rounded-2xl backdrop-blur-md transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Search className="w-5 h-5 text-amber-300" />
                  <span>Cek Status Laporan</span>
                </Link>
              </div>

              {/* Subdistricts pills */}
              <div className="pt-6 border-t border-sky-800/50 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-sky-200">Kecamatan:</span>
                {['Wolio', 'Betoambari', 'Murhum', 'Kokalukuna', 'Lea-Lea', 'Sorawolio', 'Bungi', 'Batupoaro'].map((sub) => (
                  <span key={sub} className="px-2.5 py-1 rounded-lg bg-sky-900/50 border border-sky-700/50 text-sky-200 font-medium">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stat Highlight Card - Baubau Yellow Shield Accent */}
            <div className="lg:col-span-5">
              <div className="bg-sky-900/40 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-sky-800/60 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/40">
                      <Award className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Capaian Penanganan</h3>
                      <p className="text-xs text-sky-200">Monitoring OPD Kota Baubau</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-amber-400">{stats.completion_rate}%</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-950/60 rounded-2xl p-4 border border-sky-800/50">
                    <p className="text-xs text-sky-200 uppercase font-semibold">Total Laporan</p>
                    <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
                  </div>
                  <div className="bg-sky-950/60 rounded-2xl p-4 border border-sky-800/50">
                    <p className="text-xs text-emerald-300 uppercase font-semibold">Selesai Ditangani</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">{stats.selesai}</p>
                  </div>
                  <div className="bg-sky-950/60 rounded-2xl p-4 border border-sky-800/50">
                    <p className="text-xs text-sky-300 uppercase font-semibold">Sedang Diproses</p>
                    <p className="text-2xl font-black text-sky-400 mt-1">{stats.diproses}</p>
                  </div>
                  <div className="bg-sky-950/60 rounded-2xl p-4 border border-sky-800/50">
                    <p className="text-xs text-amber-300 uppercase font-semibold">Verifikasi Menunggu</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">{stats.menunggu}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200 flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Petugas Dinas PUPR & PERKIM Kota Baubau siaga merespons pengaduan masyarakat.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Live GIS Map Preview */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-sky-800 font-extrabold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-sky-700" />
                <span>Pemetaan Sebaran Laporan GIS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Peta Kerusakan Infrastruktur Real-Time</h2>
            </div>
            <Link
              to="/map"
              className="inline-flex items-center space-x-1.5 text-sm font-bold text-sky-800 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-colors border border-sky-200"
            >
              <span>Buka Peta Penuh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <BaubauMap
            complaints={complaints}
            height="480px"
          />
        </section>

        {/* Categories Section */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Kategori Pengaduan Infrastruktur</h2>
            <p className="text-sm text-slate-600">Pilih kategori infrastruktur publik yang ingin Anda laporkan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/submit?category=${cat.id}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:border-sky-600 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center group-hover:bg-sky-700 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-800 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                <span className="inline-flex items-center text-xs font-bold text-sky-800 group-hover:translate-x-1 transition-transform">
                  Laporkan Kategori Ini &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4-Step Workflow Guide */}
        <section className="bg-sky-950 text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl ring-1 ring-sky-900">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Alur Kerja Transparan</span>
            <h2 className="text-2xl sm:text-3xl font-black">4 Langkah Mudah Pengaduan Masyarakat</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xl flex items-center justify-center mx-auto sm:mx-0">
                1
              </div>
              <h4 className="font-bold text-base">Isi Formulir & Pin Lokasi</h4>
              <p className="text-xs text-slate-300">Pilih titik kerusakan di peta GIS Baubau dan sertakan foto bukti.</p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xl flex items-center justify-center mx-auto sm:mx-0">
                2
              </div>
              <h4 className="font-bold text-base">Dapatkan Kode Tiket</h4>
              <p className="text-xs text-slate-300">Terima kode unik (contoh: SIPIL-2026-8A91) untuk melacak status.</p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xl flex items-center justify-center mx-auto sm:mx-0">
                3
              </div>
              <h4 className="font-bold text-base">Verifikasi & Penanganan OPD</h4>
              <p className="text-xs text-slate-300">Admin menugaskan Dinas terkait (PUPR/PERKIM/DLH) untuk turun ke lapangan.</p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xl flex items-center justify-center mx-auto sm:mx-0">
                4
              </div>
              <h4 className="font-bold text-base">Selesai & Bukti Foto</h4>
              <p className="text-xs text-slate-300">Petugas mengunggah foto penanganan selesai dan laporan ditutup.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
