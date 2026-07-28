import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-danger/30 mb-4">403</div>
        <h1 className="text-2xl font-semibold mb-2">Akses Ditolak</h1>
        <p className="text-muted-foreground mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda yakin ini adalah kesalahan.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
          >
            Kembali ke Beranda
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-all"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForbiddenPage;
