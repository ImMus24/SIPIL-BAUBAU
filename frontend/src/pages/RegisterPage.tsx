import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, CreditCard, Phone, Mail, MapPin, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Harap lengkapi nama, email, dan kata sandi.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Anda harus menyetujui Syarat & Ketentuan.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await register(name, email, password, phone);
      navigate('/dashboard');
    } catch {
      setErrorMsg('Pendaftaran gagal. Email mungkin sudah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-slate-950 flex flex-col lg:flex-row font-sans transition-colors duration-300">
      
      {/* Left Blue Hero Panel */}
      <div className="lg:w-5/12 bg-[#004ac6] dark:bg-sky-950 text-white p-8 sm:p-14 flex flex-col justify-between relative overflow-hidden">
        <div className="space-y-8 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 ring-2 ring-white/40 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="font-headline font-black text-2xl tracking-tight">SIPIL BAUBAU</span>
          </div>

          <div className="space-y-5">
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Layanan Pengaduan Infrastruktur Modern.
            </h1>
            <p className="text-base text-white/90 leading-relaxed font-medium">
              Wujudkan Kota Baubau yang lebih baik melalui partisipasi aktif Anda dalam melaporkan kendala infrastruktur di sekitar kita.
            </p>
          </div>

          {/* Interactive GIS Preview Card */}
          <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl p-5 space-y-3 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#39b8fd] text-[#001e2f] rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Peta Infrastruktur</h4>
                <p className="text-xs text-white/80">Terpantau secara Real-time</p>
              </div>
            </div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdxE0a20tjwg-ifwJPg5ZZ5GUHhjHc1pDc6gmdbNoohWTw9dqNeOn2Ybi5H6BmX400iCy0vBp9PObYkM60ijwvje4Asxg3LPKZHVLv-0xa6qVOZ02UUUPyBUb71yHkyEI9WQU4LbAbjbj6tMHfdifKiDFZnF76zPmHsM7uqSGK1UivXgZ0fTq8EsvQ7Ff7sWhC2bo3C9fepMPNsY7MPgU02owQXstE8WeBvpNTPENxvlP9yFXYZUclL27etAl30xL9ljzH_QBUuZU"
              alt="Baubau Map GIS Preview"
              className="w-full h-36 object-cover rounded-xl border border-white/20"
            />
          </div>
        </div>

        <div className="relative z-10 pt-8 text-xs text-white/70">
          © {new Date().getFullYear()} Pemerintah Kota Baubau. Transformasi Digital Menuju Smart City.
        </div>

        {/* Background glow circle */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#39b8fd]/20 blur-3xl rounded-full"></div>
      </div>

      {/* Right Register Form Panel */}
      <div className="lg:w-7/12 p-8 sm:p-14 flex items-center justify-center dark:bg-slate-900">
        <div className="max-w-xl w-full space-y-8">
          
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-extrabold text-slate-900 dark:text-white">Buat Akun Baru</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Silakan lengkapi data diri Anda untuk memulai.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-bold rounded-2xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">Nama Lengkap *</label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] dark:bg-slate-800 border border-[#e1e2ed] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-base font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#004ac6] dark:focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">NIK (KTP)</label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="16 digit NIK"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] dark:bg-slate-800 border border-[#e1e2ed] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-base font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#004ac6] dark:focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">No HP *</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="08xx..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] dark:bg-slate-800 border border-[#e1e2ed] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-base font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#004ac6] dark:focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">Email *</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="contoh@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] dark:bg-slate-800 border border-[#e1e2ed] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-base font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#004ac6] dark:focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">Alamat</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap sesuai KTP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] dark:bg-slate-800 border border-[#e1e2ed] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-base font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#004ac6] dark:focus:border-sky-500 transition-colors"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">Password *</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] dark:bg-slate-800 border border-[#e1e2ed] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-base font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#004ac6] dark:focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">Konfirmasi Password *</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8fafc] dark:bg-slate-800 border border-[#e1e2ed] dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl text-base font-medium focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-[#004ac6] dark:focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-[#004ac6] dark:text-sky-500 rounded"
                />
                <span>
                  Saya menyetujui <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#004ac6] dark:text-sky-400 font-bold underline">Syarat & Ketentuan</a> serta <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#004ac6] dark:text-sky-400 font-bold underline">Kebijakan Privasi</a> SIPIL BAUBAU.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#004ac6] hover:bg-[#2563eb] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-base font-extrabold rounded-full shadow-lg shadow-[#004ac6]/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>{loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-5 border-t border-[#e1e2ed] dark:border-slate-800">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-bold text-[#004ac6] dark:text-sky-400 hover:underline">
              Masuk di sini
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
