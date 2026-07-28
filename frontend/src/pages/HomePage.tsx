import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary } from '../types';

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
    <div className="space-y-0">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[780px] lg:min-h-[850px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004ac6]/95 via-[#004ac6]/80 to-[#004ac6]/40 z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAG6XoC95sZsGkgY-UfJ0DpPBSQfphLAQLCPzjxoe8aMMEa__ZJ7NENUDOSn3dnbH7j44GViixjcPzP47YwWz9h3OedPIaWJndQ-4RuCc3J_og_0wiJVXmwXwDgcL4pWsOMUhwvzG-wafhrV_ocJoaufk3Y2QEjhFwMnwvYuZ1I4c4l-Vy2dLlJZmxPEhpY36cATzab-I4_RQ41H1vxhwPbJx5YxOgvIEDpqYVX6A7MF2G4Ypj9BVJe4uMpUikb34hqJIICO__6bhA')`,
            }}
          ></div>
        </div>

        <div className="relative z-20 px-4 sm:px-8 max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
          
          <div className="text-white space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold border border-white/30 tracking-wider uppercase">
              LAYANAN PUBLIK DIGITAL
            </span>
            
            <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Laporkan Kerusakan Infrastruktur Kota Baubau Secara Online
            </h1>

            <p className="font-body text-base sm:text-lg text-white/90 max-w-xl leading-relaxed">
              Sampaikan keluhan Anda mengenai fasilitas publik di Kota Baubau dengan cepat, transparan, dan dapat dipantau langsung perkembangannya.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/submit"
                className="bg-white text-[#004ac6] px-8 py-4 rounded-xl text-sm font-semibold hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
              >
                Buat Laporan Sekarang
              </Link>
              <Link
                to="/track"
                className="border border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-sm font-semibold transition-all backdrop-blur-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined">play_circle</span>
                <span>Lihat Panduan</span>
              </Link>
            </div>
          </div>

          {/* Floating Mobile Phone Mockup Preview */}
          <div className="hidden lg:block relative">
            <div className="animate-float">
              <div className="relative bg-white rounded-[2.5rem] p-4 shadow-2xl border-[8px] border-slate-900 w-[330px] mx-auto overflow-hidden">
                <div className="bg-[#faf8ff] h-[540px] rounded-[1.8rem] overflow-hidden flex flex-col">
                  
                  <div className="bg-[#004ac6] p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                      <span className="material-symbols-outlined">menu</span>
                      <span className="material-symbols-outlined">notifications</span>
                    </div>
                    <h3 className="font-headline text-lg font-bold">Status Laporan</h3>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-[#c3c6d7] flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] shrink-0">
                        <span className="material-symbols-outlined">warning</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#191b23]">Jalan Berlubang</p>
                        <p className="text-[11px] text-[#434655]">Jl. Sudirman No. 45 (Wolio)</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl shadow-xs border border-[#c3c6d7] flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-[#39b8fd]/20 flex items-center justify-center text-[#004666] shrink-0">
                        <span className="material-symbols-outlined">lightbulb</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#191b23]">Lampu Padam</p>
                        <p className="text-[11px] text-[#434655]">Kawasan Pantai Kamali</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Background blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#004ac6]/30 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-[#39b8fd]/20 blur-3xl rounded-full"></div>
          </div>

        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="py-16 bg-[#f3f3fe]">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-8 rounded-2xl shadow-xs border border-[#c3c6d7]/40 flex flex-col items-center text-center group hover:border-[#004ac6] transition-all">
              <div className="w-16 h-16 bg-[#dbe1ff] rounded-2xl flex items-center justify-center text-[#004ac6] mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">description</span>
              </div>
              <h4 className="text-[#434655] text-xs font-semibold mb-1 uppercase tracking-wider">Total Pengaduan</h4>
              <div className="font-headline text-[36px] font-bold text-[#004ac6]">{stats.total}</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs border border-[#c3c6d7]/40 flex flex-col items-center text-center group hover:border-[#004ac6] transition-all">
              <div className="w-16 h-16 bg-[#c9e6ff] rounded-2xl flex items-center justify-center text-[#006591] mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">sync</span>
              </div>
              <h4 className="text-[#434655] text-xs font-semibold mb-1 uppercase tracking-wider">Sedang Diproses</h4>
              <div className="font-headline text-[36px] font-bold text-[#006591]">{stats.diproses}</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs border border-[#c3c6d7]/40 flex flex-col items-center text-center group hover:border-[#004ac6] transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">verified</span>
              </div>
              <h4 className="text-[#434655] text-xs font-semibold mb-1 uppercase tracking-wider">Selesai Ditangani</h4>
              <div className="font-headline text-[36px] font-bold text-emerald-600">{stats.selesai}</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xs border border-[#c3c6d7]/40 flex flex-col items-center text-center group hover:border-[#004ac6] transition-all">
              <div className="w-16 h-16 bg-[#ffdbcd] rounded-2xl flex items-center justify-center text-[#943700] mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">engineering</span>
              </div>
              <h4 className="text-[#434655] text-xs font-semibold mb-1 uppercase tracking-wider">Petugas Aktif</h4>
              <div className="font-headline text-[36px] font-bold text-[#943700]">86</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Category Section */}
      <section className="py-16">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-headline text-3xl font-bold text-[#191b23]">Kategori Pengaduan</h2>
            <p className="text-sm text-[#434655] max-w-2xl mx-auto">
              Pilih kategori infrastruktur yang ingin Anda laporkan untuk mempercepat proses penugasan tim teknis lapangan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/submit?category=${cat.catId}`)}
                className="bg-white p-6 rounded-2xl border border-[#c3c6d7] hover:border-[#004ac6] hover:shadow-xl hover:shadow-[#004ac6]/10 transition-all text-center group"
              >
                <div className="w-12 h-12 bg-[#ededf9] mx-auto rounded-xl flex items-center justify-center text-[#434655] group-hover:bg-[#dbe1ff] group-hover:text-[#004ac6] transition-colors mb-4">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <span className="font-semibold text-xs text-[#191b23] group-hover:text-[#004ac6] transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Interactive Map Section */}
      <section className="py-16 bg-white overflow-hidden border-t border-b border-[#e1e2ed]">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            <div className="lg:w-1/3 space-y-6">
              <h2 className="font-headline text-3xl font-bold text-[#191b23]">Pantau Kondisi Kota Real-Time</h2>
              <p className="text-sm text-[#434655] leading-relaxed">
                Peta interaktif menunjukkan titik-titik kerusakan yang sedang dilaporkan oleh warga Baubau. Kami menjaga transparansi setiap laporan.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div>
                  <span className="text-xs font-semibold text-[#191b23]">Belum Diproses</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-semibold text-[#191b23]">Dalam Pengerjaan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-semibold text-[#191b23]">Selesai Diperbaiki</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="p-4 bg-[#dbe1ff] rounded-xl border border-[#004ac6]/20 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-[#004ac6] shrink-0">info</span>
                  <p className="text-xs text-[#004ac6] font-medium leading-relaxed">
                    Peta diperbarui secara otomatis berdasarkan data sistem pengaduan terbaru di Kota Baubau.
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
      <section className="py-16 bg-[#f3f3fe]">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-headline text-3xl font-bold text-[#191b23]">Cara Kerja SIPIL BAUBAU</h2>
            <p className="text-sm text-[#434655] max-w-xl mx-auto">
              Alur pelaporan yang mudah dan sistematis untuk memastikan aspirasi Anda didengar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-[#c3c6d7] z-0"></div>
            
            <div className="relative z-10 space-y-3 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-headline text-2xl font-bold shadow-lg shadow-[#004ac6]/20 mx-auto md:mx-0">
                1
              </div>
              <h4 className="font-headline font-bold text-base text-[#191b23]">Pilih Lokasi</h4>
              <p className="text-xs text-[#434655] leading-relaxed">
                Tandai titik kerusakan secara akurat menggunakan sistem GPS atau peta interaktif.
              </p>
            </div>

            <div className="relative z-10 space-y-3 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-white text-[#004ac6] flex items-center justify-center font-headline text-2xl font-bold shadow-sm border border-[#c3c6d7] mx-auto md:mx-0">
                2
              </div>
              <h4 className="font-headline font-bold text-base text-[#191b23]">Upload Foto</h4>
              <p className="text-xs text-[#434655] leading-relaxed">
                Lampirkan bukti foto kerusakan dari berbagai sisi untuk memudahkan verifikasi tim.
              </p>
            </div>

            <div className="relative z-10 space-y-3 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-white text-[#004ac6] flex items-center justify-center font-headline text-2xl font-bold shadow-sm border border-[#c3c6d7] mx-auto md:mx-0">
                3
              </div>
              <h4 className="font-headline font-bold text-base text-[#191b23]">Isi Pengaduan</h4>
              <p className="text-xs text-[#434655] leading-relaxed">
                Berikan deskripsi detail mengenai jenis kerusakan dan dampak yang dirasakan warga.
              </p>
            </div>

            <div className="relative z-10 space-y-3 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-white text-[#004ac6] flex items-center justify-center font-headline text-2xl font-bold shadow-sm border border-[#c3c6d7] mx-auto md:mx-0">
                4
              </div>
              <h4 className="font-headline font-bold text-base text-[#191b23]">Pantau Progress</h4>
              <p className="text-xs text-[#434655] leading-relaxed">
                Terima notifikasi real-time saat status laporan Anda berubah hingga selesai diperbaiki.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-16">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-headline text-3xl font-bold text-[#191b23]">Suara Warga Baubau</h2>
            <p className="text-sm text-[#434655]">
              Kepuasan masyarakat adalah prioritas kami dalam membangun infrastruktur kota yang lebih baik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:-translate-y-2 transition-all">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-sm">star</span>
                ))}
              </div>
              <p className="text-xs italic text-[#434655] leading-relaxed">
                "Sangat terbantu dengan aplikasi ini. Laporan lampu jalan mati di depan rumah direspon hanya dalam waktu 24 jam!"
              </p>
              <div className="flex items-center gap-4 pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border border-[#c3c6d7]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6v1ntwT_US2lztpx4xgK63UULwhtBcBkVgR1V3LBWzQbH7IQcrT5rhqYA03S6GauBM4CUaCsCPXOLiWDkpBONpxeaqrBLWA2cGhB0CTjMsXai6lMwik5K83DlzY3d0Fs9w2RaU6nVbwaXchdlFmFn4sE695bHZuouIurQ5nTE64vj0vjTsocx6HQMXLDhJKXpVAeHwpx25cNsRbDMAsgTfr8Vlx4XZr_MhcZCBosm7TxnF3T-NEFsTd88ZElRsWCE_ANxKPjgAL4"
                  alt="Herman Susilo"
                />
                <div>
                  <h6 className="font-semibold text-xs text-[#191b23]">Herman Susilo</h6>
                  <p className="text-[11px] text-[#434655]">Warga Kelurahan Batulo</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border-[#004ac6]/30 space-y-4 hover:-translate-y-2 transition-all shadow-xl shadow-[#004ac6]/5">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-sm">star</span>
                ))}
              </div>
              <p className="text-xs italic text-[#434655] leading-relaxed">
                "Transparansi pengerjaannya bagus sekali. Saya bisa melihat foto tim teknis saat memperbaiki drainase yang mampet."
              </p>
              <div className="flex items-center gap-4 pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border border-[#c3c6d7]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChz8nVzY6iL4a5Xl0HrWbMC5fVieBwAa7uYTIU0yi_ed8jJi_znuJPRuSARJzi0_b1jGI2CiJ0172X45vHy8wRODX9O6QRkUzFERO8lUuJagw-mIbq2W-GgnK33tiLSAHtQDDYVH6cnF3wsnMwAKSs_DFi_AfF6oUC_0tgJfJRvfkcPznvaLlaBN9tAZy3bHb1fDaKJQQjLoX9LAYW2rdqFej3wVSt3tP96nX2Ra2ng6whp9EE4OPtRRPPRdmY3WATNKS9852NZ_o"
                  alt="Siti Rahmawati"
                />
                <div>
                  <h6 className="font-semibold text-xs text-[#191b23]">Siti Rahmawati</h6>
                  <p className="text-[11px] text-[#434655]">Warga Kelurahan Wameo</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4 hover:-translate-y-2 transition-all">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined fill-current text-sm">star</span>
                ))}
              </div>
              <p className="text-xs italic text-[#434655] leading-relaxed">
                "Aplikasi yang sangat modern untuk pemerintah kota. Semoga semua fasilitas publik di Baubau semakin terawat."
              </p>
              <div className="flex items-center gap-4 pt-2">
                <img
                  className="w-12 h-12 rounded-full object-cover border border-[#c3c6d7]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjqylzQWtDlqGL31rsnFQx8o-fkcQc53SJCmDAZPgvNs8wwg1alH0uozPU65qOFKXozyddyyU3Jniih8VmW2UfFM7ao63IN5S9p4PDOpv6sujwc9kboNfnKznI0FlhD26srG9rKbD1dwvUiFSphUfdQZqImmVSrhSesAcFfjMrmPVLQUm13G8QFL-2Evn0mOQ7BoUgLqY-PKlEHXX4Kvp2nNXDdz14PkeAH32YxU6zLiXhlwykKclUej1ok1nWsAFJ0TGcWHXpXQ0"
                  alt="Drs. M. Nasir"
                />
                <div>
                  <h6 className="font-semibold text-xs text-[#191b23]">Drs. M. Nasir</h6>
                  <p className="text-[11px] text-[#434655]">Tokoh Masyarakat</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-16">
        <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
          <div className="bg-[#004ac6] rounded-[3rem] p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-[40px] border-white rounded-full"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold leading-tight">
                Bangun Kota Baubau Lebih Baik Bersama Kami
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Laporkan sekarang dan jadilah bagian dari perubahan positif untuk kenyamanan seluruh warga kota.
              </p>
              <div className="pt-4">
                <Link
                  to="/submit"
                  className="inline-block bg-white text-[#004ac6] px-10 py-5 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl"
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
