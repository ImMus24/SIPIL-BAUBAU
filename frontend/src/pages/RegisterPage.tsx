import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Phone } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      navigate('/dashboard');
    } catch {
      setError('Gagal mendaftar. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Pendaftaran Akun Warga</h2>
          <p className="text-xs text-slate-500">Buat akun untuk memantau semua riwayat pengaduan Anda</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Nama Lengkap *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="La Ode / Wa Ode Ahmad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Alamat Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">No. WhatsApp / HP *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                required
                placeholder="0812XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Kata Sandi *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Konfirmasi *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 text-xs"
          >
            {loading ? <span>Mendaftarkan...</span> : <span>Daftarkan Akun Warga</span>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-teal-700 hover:underline">
              Masuk Saja
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
