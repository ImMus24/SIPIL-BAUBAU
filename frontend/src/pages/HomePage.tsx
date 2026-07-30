import React, { useEffect, useState, useRef } from 'react';
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
  Sparkles,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import heroPng from '../assets/hero.png';
import baubauCityBg from '../assets/baubau-city.png';

/* ─── Scroll Animation Hook ─── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

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
  const [autoPlay, setAutoPlay] = useState(true);

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

  // Auto-play testimonials
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setTestimonialIdx((p) => (p === testimonials.length - 1 ? 0 : p + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

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
      <section className="relative min-h-[700px] lg:min-h-[850px] xl:min-h-[900px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={baubauCityBg}
            alt=""
            className="w-full h-full object-cover md:object-center"
            style={{ objectPosition: '50% 30%' }}
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50 dark:from-slate-950/90 dark:via-slate-950/70 dark:to-slate-950/50" />
          {/* Extra bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent dark:from-slate-950" />
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10 px-4 sm:px-8 max-w-container mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 lg:py-20">
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

            {/* Right - Hero Illustration */}
            <div className="hidden lg:flex justify-center items-center animate-slide-in-right">
              <div className="relative group w-full max-w-2xl mx-auto">
                {/* Decorative glow behind image */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 via-accent/15 to-secondary/15 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                {/* Glass card frame */}
                <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-2 shadow-2xl">
                  <img
                    src={heroPng}
                    alt="Hero ilustrasi SIPIL BAUBAU - Sistem Pengaduan Infrastruktur Kota Baubau"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
                {/* Floating sparkle */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-float" style={{ animationDuration: '4s' }}>
                  <Sparkles className="w-4 h-4 text-accent-foreground" />
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

      {/* ─── Section Divider ─── */}
      <div className="relative -mt-2">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 60V0C240 30 480 45 720 45C960 45 1200 30 1440 0V60H0Z" fill="currentColor" className="text-background dark:text-slate-950" />
        </svg>
      </div>

      {/* ============ STATS ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <RevealSection>
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
        </RevealSection>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <RevealSection>
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
              Kategori Pengaduan
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Pilih kategori yang sesuai dengan jenis kerusakan infrastruktur yang ingin Anda laporkan
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <RevealSection key={cat.name} delay={idx * 60}>
              <div
                onClick={() => navigate('/submit')}
                className="bg-card border border-border rounded-2xl p-5 text-center hover-lift cursor-pointer group h-full"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <span className="material-symbols-outlined text-white text-2xl">{cat.icon}</span>
                </div>
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ─── Section Divider ─── */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto rotate-180" preserveAspectRatio="none">
          <path d="M0 60V0C240 30 480 45 720 45C960 45 1200 30 1440 0V60H0Z" fill="currentColor" className="text-muted/50 dark:text-slate-900/50" />
        </svg>
      </div>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 bg-muted/50 dark:bg-slate-900/50">
        <div className="px-4 sm:px-8 max-w-container mx-auto">
          <RevealSection>
            <div className="text-center mb-12 space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                Cara Melapor
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Hanya 3 langkah mudah untuk melaporkan kerusakan infrastruktur
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: FileText, title: 'Isi Data Laporan', desc: 'Lengkapi data diri, pilih kategori, dan deskripsikan kerusakan yang Anda temui.' },
              { step: '02', icon: MapPin, title: 'Tandai Lokasi', desc: 'Tentukan titik lokasi kerusakan di peta interaktif agar mudah ditemukan petugas.' },
              { step: '03', icon: Search, title: 'Pantau Progress', desc: 'Lacak status penanganan laporan Anda secara real-time melalui kode tiket.' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <RevealSection key={item.step} delay={idx * 100}>
                  <div className="text-center bg-card border border-border rounded-2xl p-8 hover-lift group h-full">
                    <div className="w-16 h-16 rounded-2xl bg-primary-light dark:bg-primary/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent/20 text-accent-foreground font-heading font-black text-lg flex items-center justify-center mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section Divider ─── */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 60V0C240 30 480 45 720 45C960 45 1200 30 1440 0V60H0Z" fill="currentColor" className="text-background dark:text-slate-950" />
        </svg>
      </div>

      {/* ============ MAP PREVIEW ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <RevealSection>
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
        </RevealSection>

        <RevealSection delay={150}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ height: '450px' }}>
            <BaubauMap />
          </div>
        </RevealSection>
      </section>

      {/* ─── Section Divider ─── */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto rotate-180" preserveAspectRatio="none">
          <path d="M0 60V0C240 30 480 45 720 45C960 45 1200 30 1440 0V60H0Z" fill="currentColor" className="text-muted/50 dark:text-slate-900/50" />
        </svg>
      </div>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 bg-muted/50 dark:bg-slate-900/50">
        <div className="px-4 sm:px-8 max-w-container mx-auto">
          <RevealSection>
            <div className="text-center mb-12 space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                Apa Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Warga Baubau</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Simak pengalaman warga yang telah menggunakan SIPIL BAUBAU
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={150}>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Decorative quote marks */}
                <div className="absolute -top-6 -left-2 text-6xl text-primary/10 dark:text-primary/20 font-serif leading-none select-none">"</div>
                <div className="absolute -bottom-10 -right-2 text-6xl text-primary/10 dark:text-primary/20 font-serif leading-none select-none">"</div>

                <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 text-center shadow-lg">
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 transition-all duration-300 ${i < testimonials[testimonialIdx].rating ? 'text-accent fill-accent scale-110' : 'text-muted'}`} />
                    ))}
                  </div>

                  <p className="text-lg sm:text-xl text-foreground/90 italic leading-relaxed mb-6 transition-all duration-500">
                    "{testimonials[testimonialIdx].text}"
                  </p>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-heading font-bold shadow-lg">
                      {testimonials[testimonialIdx].name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-foreground">{testimonials[testimonialIdx].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[testimonialIdx].role}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => { setAutoPlay(false); setTestimonialIdx((p) => (p === 0 ? testimonials.length - 1 : p - 1)); }}
                      className="p-2.5 rounded-xl border border-border hover:bg-muted hover:border-primary/30 transition-all duration-200 active:scale-95"
                      aria-label="Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setAutoPlay(false); setTestimonialIdx(i); }}
                          className={`transition-all duration-300 ${
                            i === testimonialIdx
                              ? 'w-8 h-2.5 bg-primary rounded-full'
                              : 'w-2.5 h-2.5 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50'
                          }`}
                          aria-label={`Testimonial ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => { setAutoPlay(false); setTestimonialIdx((p) => (p === testimonials.length - 1 ? 0 : p + 1)); }}
                      className="p-2.5 rounded-xl border border-border hover:bg-muted hover:border-primary/30 transition-all duration-200 active:scale-95"
                      aria-label="Selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Section Divider ─── */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 60V0C240 30 480 45 720 45C960 45 1200 30 1440 0V60H0Z" fill="currentColor" className="text-background dark:text-slate-950" />
        </svg>
      </div>

      {/* ============ FAQ ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <RevealSection>
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
              Pertanyaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Umum</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Temukan jawaban atas pertanyaan yang sering diajukan
            </p>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeFaq === idx ? 'border-primary/30 shadow-md' : 'hover:border-muted-foreground/20'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0 ${
                      activeFaq === idx ? 'scale-110' : ''
                    } transition-transform duration-200`}>
                      {idx + 1}
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-all duration-200 ${
                      activeFaq === idx ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pl-14 text-sm text-muted-foreground leading-relaxed animate-fade-in border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="py-20 px-4 sm:px-8 max-w-container mx-auto">
        <RevealSection>
          <div className="relative bg-gradient-to-br from-primary via-primary-hover to-secondary rounded-3xl overflow-hidden group cursor-pointer" onClick={() => navigate('/submit')}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.08]">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>
            {/* Glow effect */}
            <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center text-primary-foreground space-y-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Building2 className="w-6 h-6 text-accent" />
                <span className="text-sm font-medium text-accent/90 tracking-wider uppercase">Pemerintah Kota Baubau</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                Siap Membantu{' '}
                <span className="text-accent">Baubau</span> Lebih Baik?
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto">
                Bergabunglah dengan ribuan warga Baubau yang telah melaporkan dan memantau perbaikan infrastruktur kota.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="!bg-accent !text-accent-foreground hover:!bg-accent-hover !border-none shadow-lg shadow-accent/30 group/btn"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate('/submit'); }}
                >
                  Buat Laporan Sekarang
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="!border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate('/register'); }}
                >
                  Daftar Akun Baru
                </Button>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

    </div>
  );
};
