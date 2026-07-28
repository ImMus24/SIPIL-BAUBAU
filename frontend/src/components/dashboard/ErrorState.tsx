import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'default' | 'card' | 'fullscreen';
}

export const ErrorState: React.FC<ErrorStateProps> & {
  Card: React.FC<{ title?: string; onRetry?: () => void }>;
} = ({
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat data. Silakan coba lagi.',
  onRetry,
  variant = 'card',
}) => {
  if (variant === 'fullscreen') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-danger-bg flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-danger" />
          </div>
          <h3 className="font-heading font-bold text-xl text-foreground">{title}</h3>
          <p className="text-muted-foreground">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-sm font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-xl bg-danger-bg flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-danger" />
        </div>
        <h4 className="font-heading font-bold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-danger-bg text-danger hover:bg-danger/10 transition-colors text-sm font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Muat Ulang
          </button>
        )}
      </div>
    </div>
  );
};

ErrorState.Card = ({ title = 'Gagal Memuat Data', onRetry }) => (
  <ErrorState title={title} onRetry={onRetry} />
);

export default ErrorState;
