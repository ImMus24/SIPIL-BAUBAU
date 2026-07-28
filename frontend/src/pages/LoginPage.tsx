import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      if (email.includes('admin')) {
        navigate('/admin');
      } else if (email.includes('pupr') || email.includes('officer')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Kombinasi email atau kata sandi tidak sesuai.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Masuk Portal SIPIL BAUBAU</h2>
          <p className="text-xs text-slate-500">Akses akun Masyarakat, Petugas OPD, atau Admin</p>
        </div>

        {/* Quick Demo Credentials Assistant */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Demo Akun Cepat:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => fillQuickDemo('admin@baubaukota.go.id')}
              className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg hover:bg-amber-200"
            >
              Admin Master
            </button>
            <button
              onClick={() => fillQuickDemo('officer.pupr@baubaukota.go.id')}
              className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg hover:bg-blue-200"
            >
              Petugas OPD PUPR
            </button>
            <button
              onClick={() => fillQuickDemo('warga@gmail.com')}
              className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg hover:bg-emerald-200"
            >
              Warga Masyarakat
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Email Terdaftar *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="nama@baubaukota.go.id / email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Kata Sandi *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 text-xs"
          >
            {loading ? <span>Memverifikasi...</span> : <span>Masuk ke Portal</span>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Belum memiliki akun?{' '}
            <Link to="/register" className="font-bold text-teal-700 hover:underline">
              Daftar Warga Baru
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
