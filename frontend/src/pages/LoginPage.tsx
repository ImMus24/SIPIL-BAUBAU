import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Harap isi email dan kata sandi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setErrorMsg('Kredensial login tidak valid. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#f3f3fe] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Login Card Modal Container */}
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#e1e2ed] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Blue Banner Panel */}
        <div className="lg:col-span-6 bg-[#004ac6] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 ring-1 ring-white/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-headline font-black text-2xl tracking-tight">SIPIL BAUBAU</h2>
            </div>
            <p className="text-sm text-white/90 leading-relaxed max-w-md font-medium">
              Sistem Pengaduan Infrastruktur Kota Terpadu untuk Baubau yang lebih baik dan transparan.
            </p>
          </div>

          {/* Center Dashboard Mockup Preview */}
          <div className="my-6 relative z-10 rounded-2xl overflow-hidden border border-white/30 shadow-2xl bg-white/10 backdrop-blur-md p-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdxE0a20tjwg-ifwJPg5ZZ5GUHhjHc1pDc6gmdbNoohWTw9dqNeOn2Ybi5H6BmX400iCy0vBp9PObYkM60ijwvje4Asxg3LPKZHVLv-0xa6qVOZ02UUUPyBUb71yHkyEI9WQU4LbAbjbj6tMHfdifKiDFZnF76zPmHsM7uqSGK1UivXgZ0fTq8EsvQ7Ff7sWhC2bo3C9fepMPNsY7MPgU02owQXstE8WeBvpNTPENxvlP9yFXYZUclL27etAl30xL9ljzH_QBUuZU"
              alt="Dashboard Preview"
              className="w-full h-44 object-cover rounded-xl"
            />
          </div>

          {/* Bottom Security Highlights */}
          <div className="space-y-2 relative z-10 text-xs text-white/90 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Keamanan Data Terjamin</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Respon Cepat Tanggap OPD Baubau</span>
            </div>
          </div>

          {/* Glow blob background */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-400/20 blur-3xl rounded-full"></div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="font-headline text-3xl font-extrabold text-slate-900">Selamat Datang</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Silakan masuk untuk melanjutkan akses ke portal pengaduan infrastruktur.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-xs">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] border border-[#e1e2ed] rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[#004ac6]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-800 text-xs">Kata Sandi</label>
                  <a href="#lupa" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi admin di pengaduan@baubaukota.go.id'); }} className="text-xs font-bold text-[#004ac6] hover:underline">
                    Lupa Sandi?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-[#f8fafc] border border-[#e1e2ed] rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[#004ac6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#004ac6] rounded"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-sm font-bold rounded-full shadow-lg shadow-[#004ac6]/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>{loading ? 'Proses Masuk...' : 'Masuk'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="pt-2 border-t border-[#e1e2ed] space-y-2 text-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Demo Akun Cepat:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin@baubaukota.go.id')}
                  className="px-3 py-1.5 bg-[#dbe1ff] text-[#004ac6] font-bold rounded-lg hover:bg-[#004ac6] hover:text-white transition-colors"
                >
                  Admin Master
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('officer.pupr@baubaukota.go.id')}
                  className="px-3 py-1.5 bg-[#c9e6ff] text-[#006591] font-bold rounded-lg hover:bg-[#006591] hover:text-white transition-colors"
                >
                  Petugas PUPR
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('warga@gmail.com')}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Warga
                </button>
              </div>
            </div>

          </div>

          <div className="text-center text-xs text-slate-600 border-t border-[#e1e2ed] pt-4">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-[#004ac6] hover:underline">
              Daftar Sekarang
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
