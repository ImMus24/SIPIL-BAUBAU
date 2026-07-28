import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setErrorMsg('Harap isi email dan kata sandi.'); return; }
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      const user = authService.getCurrentUser();
      const routeMap: Record<string, string> = {
        citizen: '/dashboard',
        officer: '/officer',
        admin: '/admin',
        head_of_agency: '/kepala-dinas',
      };
      navigate(routeMap[user?.role ?? 'citizen'] ?? '/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || 'Email atau kata sandi salah.');
    } finally { setLoading(false); }
  };

  const fillQuick = (e: string) => { setEmail(e); setPassword('password123'); };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 pt-24">
      <div className="max-w-5xl w-full bg-card rounded-3xl border border-border shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] animate-fade-in-up">
        
        {/* Left Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/40">
                <ShieldCheck className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-heading font-black text-2xl tracking-tight">SIPIL BAUBAU</h2>
            </div>
            <div className="space-y-3">
              <h1 className="font-heading text-3xl font-black leading-tight">Selamat Datang</h1>
              <p className="text-base text-white/80 leading-relaxed max-w-md">
                Sistem Pengaduan Infrastruktur Kota Terpadu untuk Baubau yang lebih baik dan transparan.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3 relative z-10">
            {['Keamanan Data Terjamin', 'Respon Cepat Tanggap OPD', 'Pantau Real-time via Dashboard'].map((h) => (
              <div key={h} className="flex items-center gap-2.5 text-sm text-white/90 font-medium">
                <div className="w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center">
                  <span className="text-accent text-xs font-bold">✓</span>
                </div>
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/20 blur-3xl rounded-full" />
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full space-y-6">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-bold text-foreground">Masuk ke Akun</h2>
              <p className="text-sm text-muted-foreground">Silakan masuk untuk melanjutkan</p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-danger-bg border border-danger-border text-danger text-sm font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Alamat Email"
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />
              <div>
                <Input
                  label="Kata Sandi"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <div className="flex justify-end mt-1.5">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi admin di pengaduan@baubaukota.go.id'); }} className="text-xs font-semibold text-primary hover:underline">
                    Lupa Sandi?
                  </a>
                </div>
              </div>

              <Button type="submit" fullWidth loading={loading} icon={ArrowRight} iconPosition="right">
                Masuk
              </Button>
            </form>

            {/* Quick Demo */}
            <div className="pt-3 border-t border-border space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Demo Akun Cepat:</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => fillQuick('admin@baubaukota.go.id')} className="px-3.5 py-2 bg-primary-light text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                  Admin
                </button>
                <button type="button" onClick={() => fillQuick('officer.pupr@baubaukota.go.id')} className="px-3.5 py-2 bg-secondary-light text-secondary text-xs font-bold rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors">
                  Petugas PUPR
                </button>
                <button type="button" onClick={() => fillQuick('warga@gmail.com')} className="px-3.5 py-2 bg-muted text-muted-foreground text-xs font-bold rounded-lg hover:bg-foreground hover:text-background transition-colors">
                  Warga
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Belum punya akun?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
