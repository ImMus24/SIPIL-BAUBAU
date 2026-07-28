export function ErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-muted-foreground/30 mb-4">500</div>
        <h1 className="text-2xl font-semibold mb-2">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground mb-6">
          Maaf, terjadi kesalahan pada server. Silakan coba kembali atau hubungi administrator.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Coba Lagi
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
