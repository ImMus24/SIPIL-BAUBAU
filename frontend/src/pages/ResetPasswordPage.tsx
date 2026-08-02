import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const emailParam = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !emailParam) {
      setErrorMsg('Tautan reset tidak valid. Silakan ulangi permintaan reset kata sandi.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Kata sandi minimal 8 karakter.');
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await authService.resetPassword(token, emailParam, password, passwordConfirmation);
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        typeof err === 'object' && err !== null && 'response' in err
          ? ((err as { response: { data?: { message?: string } } }).response?.data?.message
            ?? (err as { response: { data?: { errors?: Record<string, string[]> } } }).response?.data?.errors?.token?.[0]
            ?? 'Gagal mereset kata sandi.')
          : 'Gagal mereset kata sandi. Silakan coba lagi.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl border border-border shadow-2xl p-8 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" aria-hidden="true" />
            </div>
            <h1 className="font-heading text-xl font-black text-foreground mb-2">Kata Sandi Berhasil Direset</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Silakan masuk dengan kata sandi baru Anda.
            </p>
            <Button icon={ArrowRight} onClick={() => navigate('/login')} fullWidth>
              Masuk Sekarang
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl border border-border shadow-2xl p-8 animate-fade-in-up">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-black text-foreground mb-1">Atur Kata Sandi Baru</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Masukkan kata sandi baru untuk akun <span className="font-semibold text-foreground">{emailParam || 'Anda'}</span>.
          </p>

          {errorMsg && (
            <div className="mb-4 rounded-xl bg-danger-bg border border-danger-border px-4 py-3 text-sm text-danger">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi baru (min. 8 karakter)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                aria-label="Kata sandi baru"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>

            <Input
              type={showPassword ? 'text' : 'password'}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              label="Konfirmasi Kata Sandi"
            />

            <Button type="submit" loading={loading} icon={ShieldCheck} fullWidth>
              Reset Kata Sandi
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Kembali ke halaman masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
