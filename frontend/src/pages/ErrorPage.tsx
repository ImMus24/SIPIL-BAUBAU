import { RefreshCw } from 'lucide-react';
import { Error500 } from '../assets/illustrations';

export function ErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-lg mx-auto animate-fade-in-up">
        {/* Illustration */}
        <div className="w-64 h-64 mx-auto mb-8">
          <Error500
            variant="light"
            className="w-full h-full"
          />
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md mx-auto">
          Maaf, terjadi kesalahan pada server. Silakan coba kembali atau hubungi administrator jika masalah berlanjut.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
