import { Link } from 'react-router-dom';
import { Home, LogIn, ShieldAlert } from 'lucide-react';

export function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-danger/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-warning/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
      </div>

      <div className="relative text-center max-w-lg mx-auto animate-fade-in-up">
        {/* 403 Graphic */}
        <div className="relative w-56 h-56 mx-auto mb-8">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-danger to-navy opacity-10 rotate-6" />
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-danger to-navy opacity-10 -rotate-6" />
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-danger to-navy flex items-center justify-center shadow-2xl shadow-danger/25">
            <span className="font-heading font-black text-7xl text-white tracking-tight">403</span>
          </div>
          <div className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl bg-golden flex items-center justify-center shadow-lg animate-float">
            <ShieldAlert className="w-7 h-7 text-golden-foreground" aria-hidden="true" />
          </div>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground mb-3">
          Akses Ditolak
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
          Anda tidak memiliki izin untuk mengakses halaman ini.
          Silakan hubungi administrator jika Anda yakin ini adalah kesalahan.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForbiddenPage;
