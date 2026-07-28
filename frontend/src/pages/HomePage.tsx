import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { Complaint, StatSummary } from '../types';
import {
  ShieldCheck,
  ChevronDown,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [_complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<StatSummary>({
    total: 1254,
    menunggu: 18,
    diproses: 482,
    selesai: 715,
    ditolak: 8,
    completion_rate: 65.2,
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    complaintService.getComplaints().then(setComplaints);
    complaintService.getStatsSummary().then((s) => {
      setStats({ ...s, total: 1254, diproses: 482, selesai: 715 });
    });
  }, []);

  const categories = [
    { name: 'Jalan Rusak', icon: 'edit_road', desc: 'Laporkan jalan berlubang atau rusak', color: 'from-amber-500 to-orange-600' },
    { name: 'Lampu Jalan', icon: 'light', desc: 'Lampu penerangan umum mati', color: 'from-yellow-400 to-amber-500' },
    { name: 'Drainase', icon: 'waves', desc: 'Saluran air tersumbat atau rusak', color: 'from-sky-400 to-blue-600' },
    { name: 'Taman Kota', icon: 'park', desc: 'Fasilitas taman umum rusak', color: 'from-emerald-400 to-green-600' },
    { name: 'Sampah', icon: 'delete_sweep', desc: 'Tumpukan sampah tak terangkut', color: 'from-teal-400 to-emerald-600' },
    { name: 'Pipa Bocor', icon: 'water_drop', desc: 'Kebocoran air bersih', color: 'from-cyan-400 to-sky-600' },
    { name: 'Rambu Lalu Lintas', icon: 'traffic', desc: 'Rambu rusak atau hilang', color: 'from-red-400 to-rose-600' },
    { name: 'Lainnya', icon: 'more_horiz', desc: 'Infrastruktur publik lainnya', color: 'from-slate-400 to-slate-600' },
  ];

  const testimonials = [
    { name: 'Wa Ode Sartika', role: 'Warga Wolio', text: 'Saya melaporkan jalan rusak di depan rumah, dalam 3 hari sudah diperbaiki. Luar biasa responsif!', rating: 5 },
    { name: 'La Ode Muh. Idris', role: 'Warga Betoambari', text: 'Aplikasi ini sangat membantu. Saya bisa pantau progress laporan kapan saja. Pemerintah Kota Baubau luar biasa!', rating: 5 },
    { name: 'Sitti Rahmawati', role: 'Warga Murhum', text: 'Drainase tersumbat sudah bertahun-tahun, setelah lapor lewat SIPIL langsung ditangani. Terima kasih Pak Wali Kota!', rating: 5 },
    { name: 'Muh. Arsyad', role: 'Warga Kokalukuna', text: 'Lampu jalan mati selama sebulan, setelah lapor lewat aplikasi langsung nyala dalam 2 hari. Mantap!', rating: 4 },
  ];

  const faqs = [
    { q: 'Apa itu SIPIL BAUBAU?', a: 'SIPIL BAUBAU adalah Sistem Pengaduan Infrastruktur Berbasis Web milik Pemerintah Kota Baubau yang memungkinkan warga melaporkan kerusakan fasilitas publik secara cepat, transparan, dan terpantau.' },
    { q: 'Bagaimana cara membuat laporan?', a: 'Cukup klik tombol "Buat Laporan Sekarang", isi data diri, pilih kategori, tentukan lokasi di peta, dan kirim. Laporan Anda akan langsung masuk ke OPD terkait.' },
    { q: 'Berapa lama laporan diproses?', a: 'Setiap laporan akan diverifikasi dalam 1x24 jam. Proses penanganan tergantung tingkat urgensi dan jenis kerusakan, dengan target maksimal 7 hari kerja.' },
    { q: 'Apakah data saya aman?', a: 'Tentu. SIPIL BAUBAU menggunakan enkripsi data dan sistem keamanan berstandar tinggi. Data pribadi Anda hanya digunakan untuk keperluan pelaporan.' },
    { q: 'Bisakah saya melacak laporan?', a: 'Ya! Setiap laporan mendapat kode tiket unik. Anda bisa melacak status laporan kapan saja melalui halaman "Cek Status" atau dashboard pribadi Anda.' },
  ];

  return (
    <div className="pt-20">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[800px] lg:min-h-[900px] flex items-center overflow-hidden bg-gradient-to-b from-primary-light via-background to-background dark:from-slate-900 dark:via-slate-950 dark:to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative z-10 px-4 sm:px-8 max-w-container mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light dark:bg-accent/10 border border-primary/20 dark:border-accent/30 text-primary dark:text-accent text-sm font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4" />
                <span>Pemerintah Kota Baubau · Sulawesi Tenggara</span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight text-foreground">
                Laporkan Kerusakan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary dark:from-accent dark:via-yellow-400 dark:to-secondary">
                  Infrastruktur Kota Baubau
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Sampaikan keluhan Anda mengenai fasilitas publik di Kota Baubau dengan cepat, transparan, dan dapat dipantau langsung perkembangannya secara real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  icon={FileText}
                  iconPosition="right"
                  onClick={() => navigate('/submit')}
                >
                  Buat Laporan Sekarang
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={Play}
                  onClick={() => navigate('/track')}
                >
                  Lacak Laporan
                </Button>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <p className="font-heading text-3xl font-black text-foreground">{stats.total.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground font-medium">Total Laporan</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-black text-success">{stats.selesai}</p>
                  <p className="text-sm text-muted-foreground font-medium">Selesai Ditangani</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-black text-primary">{stats.completion_rate}%</p>
                  <p className="text-sm text-muted-foreground font-medium">Tingkat Penyelesaian</p>
                </div>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="hidden lg:flex justify-center animate-float">
              <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-[3rem] p-4 shadow-2xl border-[6px] border-accent/80 w-[330px]">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-b-2xl z-10" />

                <div className="bg-background rounded-[2rem] overflow-hidden h-[580px] flex flex-col">
                  {/* App Header */}
                  <div className="bg-primary px-4 py-5 text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      <span className="font-heading font-bold text-sm">SIPIL BAUBAU</span>
                    </div>
                    <p className="text-xs text-white/80">Selamat datang, Warga Baubau</p>
                  </div>

                  {/* App Content */}
                  <div className="flex-1 p-4 space-y-3 overflow-hidden">
                    <div className="bg-card rounded-xl p-3 border border-border shadow-sm">
                      <p className="text-xs font-bold text-foreground mb-1">Jalan Wolio Raya Rusak</p>
                      <p className="text-[11px] text-muted-foreground">Status: <span className="text-warning font-bold">Diproses</span></p>
                    </div>
                    <div className="bg-card rounded-xl p-3 border border-border shadow-sm">
                      <p className="text-xs font-bold text-foreground mb-1">Drainase Tersumbat</p>
                      <p className="text-[11px] text-muted-foreground">Status: <span className="text-success font-bold">Selesai ✓</span></p>
                    </div>
                    <div className="bg-card rounded-xl p-3 border border-border shadow-sm">
                      <p className="text-xs font-bold text-foreground mb-1">Lampu Jalan Mati</p>
                      <p className="text-[11px] text-muted-foreground">Status: <span className="text-info font-bold">Menunggu</span></p>
                    </div>
                    <div className="bg-primary-light rounded-xl p-3 text-center mt-auto">
                      <p className="text-xs font-bold text-primary">+ Buat Laporan Baru</p>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="flex items-center justify-around py-3 border-t border-border px-2">
                    {['Beranda', 'Laporan', 'Profil'].map((l) => (
                      <span key={l} className={`text-[10px] font-bold ${l === 'Beranda' ? 'text-primary' : 'text-muted-foreground'}`}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-xs font-medium">Scroll ke bawah</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Laporan Masuk"
            value={stats.total.toLocaleString()}
            icon={FileText}
            variant="primary"
            trend={{ value: `${((stats.total - 1100) / 1100 * 100).toFixed(1)}% dari bulan lalu`, up: true }}
          />
          <StatCard
            title="Sedang Diproses"
            value={stats.diproses}
            icon={Clock}
            variant="info"
          />
          <StatCard
            title="Berhasil Ditangani"
            value={stats.selesai}
            icon={CheckCircle2}
            variant="success"
            trend={{ value: `${stats.completion_rate}% tingkat penyelesaian`, up: true }}
          />
          <StatCard
            title="Menunggu Verifikasi"
            value={stats.menunggu}
            icon={AlertTriangle}
            variant="warning"
          />
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
            Kategori Pengaduan
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pilih kategori yang sesuai dengan jenis kerusakan infrastruktur yang ingin Anda laporkan
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate('/submit')}
              className="bg-card border border-border rounded-2xl p-5 text-center hover-lift cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <span className="material-symbols-outlined text-white text-2xl">{cat.icon}</span>
              </div>
              <h3 className="font-heading font-bold text-foreground text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 bg-muted/50 dark:bg-slate-900/50">
        <div className="px-4 sm:px-8 max-w-container mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
              Cara Melapor
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hanya 3 langkah mudah untuk melaporkan kerusakan infrastruktur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: FileText, title: 'Isi Data Laporan', desc: 'Lengkapi data diri, pilih kategori, dan deskripsikan kerusakan yang Anda temui.' },
              { step: '02', icon: MapPin, title: 'Tandai Lokasi', desc: 'Tentukan titik lokasi kerusakan di peta interaktif agar mudah ditemukan petugas.' },
              { step: '03', icon: Search, title: 'Pantau Progress', desc: 'Lacak status penanganan laporan Anda secara real-time melalui kode tiket.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center bg-card border border-border rounded-2xl p-8 hover-lift">
                  <div className="w-16 h-16 rounded-2xl bg-primary-light dark:bg-primary/20 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent-foreground font-heading font-black text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MAP PREVIEW ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
              Peta Sebaran Laporan
            </h2>
            <p className="text-muted-foreground">
              Visualisasi laporan infrastruktur di seluruh kecamatan Kota Baubau
            </p>
          </div>
          <Button variant="outline" icon={MapPin} iconPosition="right" onClick={() => navigate('/map')}>
            Lihat Peta Lengkap
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg" style={{ height: '450px' }}>
          <BaubauMap />
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 bg-muted/50 dark:bg-slate-900/50">
        <div className="px-4 sm:px-8 max-w-container mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
              Apa Kata Warga Baubau
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simak pengalaman warga yang telah menggunakan SIPIL BAUBAU
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < testimonials[testimonialIdx].rating ? 'text-accent fill-accent' : 'text-muted'}`} />
                ))}
              </div>

              <p className="text-lg text-foreground/90 italic leading-relaxed mb-6">
                "{testimonials[testimonialIdx].text}"
              </p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold">
                  {testimonials[testimonialIdx].name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">{testimonials[testimonialIdx].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[testimonialIdx].role}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setTestimonialIdx((p) => (p === 0 ? testimonials.length - 1 : p - 1))}
                  className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIdx(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === testimonialIdx ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setTestimonialIdx((p) => (p === testimonials.length - 1 ? 0 : p + 1))}
                  className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
            Pertanyaan Umum
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan jawaban atas pertanyaan yang sering diajukan
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-foreground hover:bg-muted/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <div className="relative bg-gradient-to-r from-primary to-primary-hover rounded-3xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>

          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center text-primary-foreground space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-black leading-tight">
              Siap Membantu Baubau Lebih Baik?
            </h2>
            <p className="text-lg text-white/80 max-w-lg mx-auto">
              Bergabunglah dengan ribuan warga Baubau yang telah melaporkan dan memantau perbaikan infrastruktur kota.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button
                size="lg"
                icon={FileText}
                iconPosition="right"
                className="!bg-accent !text-accent-foreground hover:!bg-accent-hover !border-none"
                onClick={() => navigate('/submit')}
              >
                Buat Laporan Sekarang
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="!border-white/30 !text-white hover:!bg-white/10"
                onClick={() => navigate('/register')}
              >
                Daftar Akun Baru
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
