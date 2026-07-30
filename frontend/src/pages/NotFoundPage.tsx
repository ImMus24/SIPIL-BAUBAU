import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import heroPng from '../assets/hero.png';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-lg mx-auto animate-fade-in-up">
        {/* Illustration */}
        <div className="w-48 h-48 mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={heroPng}
            alt="Ilustrasi"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan. 
          Periksa kembali URL atau kembali ke beranda.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
