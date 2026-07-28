import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary } from '../types';
import { ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<StatSummary>({
    total: 1254,
    menunggu: 18,
    diproses: 482,
    selesai: 715,
    ditolak: 8,
    completion_rate: 65.2,
  });

  useEffect(() => {
    complaintService.getComplaints().then(setComplaints);
    complaintService.getStatsSummary().then((s) => {
      setStats({
        ...s,
        total: 1254,
        diproses: 482,
        selesai: 715,
      });
    });
  }, []);

  const categories = [
    { name: 'Jalan Rusak', icon: 'edit_road', catId: 1 },
    { name: 'Lampu Jalan', icon: 'light', catId: 3 },
    { name: 'Drainase', icon: 'waves', catId: 2 },
    { name: 'Taman Kota', icon: 'park', catId: 5 },
    { name: 'Sampah', icon: 'delete_sweep', catId: 4 },
    { name: 'Pipa Bocor', icon: 'water_drop', catId: 2 },
    { name: 'Rambu Lalu Lintas', icon: 'traffic', catId: 6 },
    { name: 'Lainnya', icon: 'more_horiz', catId: 1 },
  ];

  return (
    <div className="space-y-0 pt-20">
      
      {/* 1. Hero Section - Styled in Logo Kota Baubau Colors */}
      <section className="relative min-h-[780px] lg:min-h-[850px] flex items-center overflow-hidden bg-gradient-to-b from-sky-950 via-sky-900 to-slate-950 text-white">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/95 via-sky-900/80 to-slate-950/40 z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAG6XoC95sZsGkgY-UfJ0DpPBSQfphLAQLCPzjxoe8aMMEa__ZJ7NENUDOSn3dnbH7j44GViixjcPzP47YwWz9h3OedPIaWJndQ-4RuCc3J_og_0wiJVXmwXwDgcL4pWsOMUhwvzG-wafhrV_ocJoaufk3Y2QEjhFwMnwvYuZ1I4c4l-Vy2dLlJZmxPEhpY36cATzab-I4_RQ41H1vxhwPbJx5YxOgvIEDpqYVX6A7MF2G4Ypj9BVJe4uMpUikb34hqJIICO__6bhA')`,
            }}
          ></div>
        </div>

        <div className="relative z-20 px-4 sm:px-8 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16">
          
          <div className="space-y-7">
            <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-sm font-black uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Pemerintah Kota Baubau • Sulawesi Tenggara</span>
            </div>
            
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Laporkan Kerusakan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-sky-300">
                Infrastruktur Kota Baubau
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-sky-100/90 max-w-xl leading-relaxed">
              Sampaikan keluhan Anda mengenai fasilitas publik di Kota Baubau dengan cepat, transparan, dan dapat dipantau langsung perkembangannya.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/submit"
                className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-600 text-slate-950 font-black px-8 py-4 rounded-xl text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center space-x-2"
              >
                <span>Buat Laporan Sekarang</span>
              </Link>
              <Link
                to="/track"
                className="border border-amber-300/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-base font-bold transition-all backdrop-blur-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-amber-300">play_circle</span>
                <span>Lihat Panduan</span>
              </Link>
            </div>
          </div>

          {/* Floating Mobile Phone Mockup Preview in Royal Navy & Gold */}
          <div className="hidden lg:block relative">
            <div className="animate-float">
              <div className="relative bg-slate-950 rounded-[2.5rem] p-4 shadow-2xl border-[6px] border-amber-400/80 w-[330px] mx-auto overflow-hidden">
                <div className="bg-slate-50 h-[540px] rounded-[1.8rem] overflow-hidden flex flex-col">
                  
                  <div className="bg-gradient-to-r from-sky-700 to-sky-900 p-6 text-white border-b border-amber-400/40">
                    <div className="flex justify-between items-center mb-4">
                      <span className="material-symbols-outlined text-amber-300">menu</span>
                      <span className="material-symbols-outlined text-amber-300">notifications</span>
                    </div>
                    <h3 className="font-headline text-lg font-extrabold text-amber-300">Status Laporan Real-Time</h3>
                  </div>

                  <div className="p-4 space-y-3.5">
                    <div className="p-3.5 bg-white rounded-xl shadow-xs border border-sky-100 flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 border border-amber-300">
                        <span className="material-symbols-outlined">lightbulb</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Lampu Padam</p>
                        <p className="text-xs text-slate-500">Kawasan Pantai Kamali</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl shadow-xs border border-sky-100 flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 shrink-0 border border-sky-300">
                        <span className="material-symbols-outlined">warning</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Jalan Berlubang</p>
                        <p className="text-xs text-slate-500">Jl. Sudirman No. 45 (Wolio)</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl shadow-xs border border-sky-100 flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-300">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Drainase Selesai</p>
                        <p className="text-xs text-slate-500">Kecamatan Murhum</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Background blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-400/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-sky-600/30 blur-3xl rounded-full"></div>
          </div>

        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-b border-sky-100 dark:border-slate-800">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-sky-600 transition-all">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-950/80 rounded-2xl flex items-center justify-center text-sky-700 dark:text-sky-300 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">description</span>
              </div>
              <h4 className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Total Pengaduan</h4>
              <div className="font-headline text-[40px] font-black text-sky-800 dark:text-sky-400">{stats.total}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-amber-500 transition-all">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/80 rounded-2xl flex items-center justify-center text-amber-700 dark:text-amber-300 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">sync</span>
              </div>
              <h4 className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Sedang Diproses</h4>
              <div className="font-headline text-[40px] font-black text-amber-600 dark:text-amber-400">{stats.diproses}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-emerald-600 transition-all">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">verified</span>
              </div>
              <h4 className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Selesai Ditangani</h4>
              <div className="font-headline text-[40px] font-black text-emerald-600 dark:text-emerald-400">{stats.selesai}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-sky-800 transition-all">
              <div className="w-16 h-16 bg-sky-900 text-amber-300 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">engineering</span>
              </div>
              <h4 className="text-slate-600 dark:text-slate-400 text-sm font-bold mb-1 uppercase tracking-wider">Petugas OPD Aktif</h4>
              <div className="font-headline text-[40px] font-black text-slate-900 dark:text-white">86</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Category Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          
          <div className="text-center mb-14 space-y-3">
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Kategori Pengaduan Infrastruktur</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Pilih kategori infrastruktur yang ingin Anda laporkan untuk mempercepat proses penugasan tim teknis lapangan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/submit?category=${cat.catId}`)}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-600 dark:hover:border-sky-500 hover:shadow-xl hover:shadow-sky-600/10 transition-all text-center group"
              >
                <div className="w-14 h-14 bg-sky-50 dark:bg-slate-800 mx-auto rounded-xl flex items-center justify-center text-sky-800 dark:text-sky-300 group-hover:bg-sky-700 group-hover:text-white transition-colors mb-4">
                  <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-200 group-hover:text-sky-800 dark:group-hover:text-sky-400 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Interactive Map Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden border-t border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            <div className="lg:w-1/3 space-y-6">
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Pantau Kondisi Kota Real-Time</h2>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Peta interaktif menunjukkan titik-titik kerusakan yang sedang dilaporkan oleh warga Kota Baubau. Kami menjaga transparansi setiap laporan.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Menunggu Verifikasi</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-sky-600"></div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Dalam Pengerjaan OPD</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Selesai Diperbaiki</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="p-5 bg-sky-50 dark:bg-sky-950/60 rounded-xl border border-sky-200 dark:border-sky-800 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-sky-700 dark:text-sky-300 shrink-0">info</span>
                  <p className="text-sm text-sky-900 dark:text-sky-200 font-medium leading-relaxed">
                    Peta diperbarui secara otomatis berdasarkan data sistem pengaduan terbaru di 8 Kecamatan se-Kota Baubau.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 w-full">
              <BaubauMap complaints={complaints} height="480px" />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Timeline Section */}
      <section className="py-20 bg-slate-100/80 dark:bg-slate-950">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Cara Kerja SIPIL BAUBAU</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Alur pelaporan yang mudah dan sistematis untuk memastikan aspirasi Anda didengar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-sky-300 dark:bg-sky-800 z-0"></div>
            
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-sky-800 text-amber-300 flex items-center justify-center font-headline text-2xl font-black shadow-lg shadow-sky-800/20 mx-auto md:mx-0 ring-2 ring-amber-400">
                1
              </div>
              <h4 className="font-headline font-bold text-lg text-slate-900 dark:text-white">Pilih Lokasi</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tandai titik kerusakan secara akurat menggunakan sistem GPS atau peta interaktif.
              </p>
            </div>

            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 flex items-center justify-center font-headline text-2xl font-black shadow-sm border border-slate-300 dark:border-slate-700 mx-auto md:mx-0">
                2
              </div>
              <h4 className="font-headline font-bold text-lg text-slate-900 dark:text-white">Upload Foto</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Lampirkan bukti foto kerusakan dari berbagai sisi untuk memudahkan verifikasi tim.
              </p>
            </div>

            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 flex items-center justify-center font-headline text-2xl font-black shadow-sm border border-slate-300 dark:border-slate-700 mx-auto md:mx-0">
                3
              </div>
              <h4 className="font-headline font-bold text-lg text-slate-900 dark:text-white">Isi Pengaduan</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Berikan deskripsi detail mengenai jenis kerusakan dan dampak yang dirasakan warga.
              </p>
            </div>

            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 flex items-center justify-center font-headline text-2xl font-black shadow-sm border border-slate-300 dark:border-slate-700 mx-auto md:mx-0">
                4
              </div>
              <h4 className="font-headline font-bold text-lg text-slate-900 dark:text-white">Pantau Progress</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Terima notifikasi real-time saat status laporan Anda berubah hingga selesai diperbaiki.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Suara Warga Baubau</h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Kepuasan masyarakat adalah prioritas kami dalam membangun infrastruktur kota yang lebih baik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-card p-8 rounded-3xl space-y-5 hover:-translate-y-2 transition-all">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-base">star</span>
                ))}
              </div>
              <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                "Sangat terbantu dengan aplikasi ini. Laporan lampu jalan mati di depan rumah direspon hanya dalam waktu 24 jam!"
              </p>
              <div className="flex items-center gap-4 pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6v1ntwT_US2lztpx4xgK63UULwhtBcBkVgR1V3LBWzQbH7IQcrT5rhqYA03S6GauBM4CUaCsCPXOLiWDkpBONpxeaqrBLWA2cGhB0CTjMsXai6lMwik5K83DlzY3d0Fs9w2RaU6nVbwaXchdlFmFn4sE695bHZuouIurQ5nTE64vj0vjTsocx6HQMXLDhJKXpVAeHwpx25cNsRbDMAsgTfr8Vlx4XZr_MhcZCBosm7TxnF3T-NEFsTd88ZElRsWCE_ANxKPjgAL4"
                  alt="Herman Susilo"
                />
                <div>
                  <h6 className="font-bold text-sm text-slate-900 dark:text-white">Herman Susilo</h6>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Warga Kelurahan Batulo</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border-sky-300 dark:border-sky-700 space-y-5 hover:-translate-y-2 transition-all shadow-xl shadow-sky-600/5">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-base">star</span>
                ))}
              </div>
              <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                "Transparansi pengerjaannya bagus sekali. Saya bisa melihat foto tim teknis saat memperbaiki drainase yang mampet."
              </p>
              <div className="flex items-center gap-4 pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChz8nVzY6iL4a5Xl0HrWbMC5fVieBwAa7uYTIU0yi_ed8jJi_znuJPRuSARJzi0_b1jGI2CiJ0172X45vHy8wRODX9O6QRkUzFERO8lUuJagw-mIbq2W-GgnK33tiLSAHtQDDYVH6cnF3wsnMwAKSs_DFi_AfF6oUC_0tgJfJRvfkcPznvaLlaBN9tAZy3bHb1fDaKJQQjLoX9LAYW2rdqFej3wVSt3tP96nX2Ra2ng6whp9EE4OPtRRPPRdmY3WATNKS9852NZ_o"
                  alt="Siti Rahmawati"
                />
                <div>
                  <h6 className="font-bold text-sm text-slate-900 dark:text-white">Siti Rahmawati</h6>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Warga Kelurahan Wameo</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-5 hover:-translate-y-2 transition-all">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-base">star</span>
                ))}
              </div>
              <p className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                "Aplikasi yang sangat modern untuk pemerintah kota. Semoga semua fasilitas publik di Baubau semakin terawat."
              </p>
              <div className="flex items-center gap-4 pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjqylzQWtDlqGL31rsnFQx8o-fkcQc53SJCmDAZPgvNs8wwg1alH0uozPU65qOFKXozyddyyU3Jniih8VmW2UfFM7ao63IN5S9p4PDOpv6sujwc9kboNfnKznI0FlhD26srG9rKbD1dwvUiFSphUfdQZqImmVSrhSesAcFfjMrmPVLQUm13G8QFL-2Evn0mOQ7BoUgLqY-PKlEHXX4Kvp2nNXDdz14PkeAH32YxU6zLiXhlwykKclUej1ok1nWsAFJ0TGcWHXpXQ0"
                  alt="Drs. M. Nasir"
                />
                <div>
                  <h6 className="font-bold text-sm text-slate-900 dark:text-white">Drs. M. Nasir</h6>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tokoh Masyarakat</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-950 dark:from-slate-900 dark:via-sky-950 dark:to-slate-900 rounded-[3rem] p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-amber-400/30">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-[40px] border-amber-400 rounded-full"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold leading-tight">
                Bangun Kota Baubau Lebih Baik Bersama Kami
              </h2>
              <p className="text-base sm:text-lg text-sky-100/90 leading-relaxed">
                Laporkan sekarang dan jadilah bagian dari perubahan positif untuk kenyamanan seluruh warga kota.
              </p>
              <div className="pt-4">
                <Link
                  to="/submit"
                  className="inline-block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-600 text-slate-950 font-black px-10 py-5 rounded-2xl text-base hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-amber-500/20"
                >
                  Mulai Laporan Pertama Anda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
