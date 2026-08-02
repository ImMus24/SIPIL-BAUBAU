import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Stepper } from '../components/ui/Stepper';
import { ShieldCheck, User, Phone, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import heroPng from '../assets/hero.png';

const steps = [
  { id: 'personal', label: 'Data Pribadi', description: 'Nama & kontak' },
  { id: 'account', label: 'Akun', description: 'Email & password' },
  { id: 'confirm', label: 'Konfirmasi', description: 'Verifikasi data' },
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 0) {
      if (!name.trim()) { setErrorMsg('Nama lengkap wajib diisi.'); return; }
    }
    if (step === 1) {
      if (!email.trim()) { setErrorMsg('Email wajib diisi.'); return; }
      if (password.length < 8) { setErrorMsg('Kata sandi minimal 8 karakter.'); return; }
      if (password !== confirmPassword) { setErrorMsg('Konfirmasi kata sandi tidak cocok.'); return; }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        setErrorMsg('Kata sandi harus mengandung huruf besar, huruf kecil, dan angka.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleSubmit = async () => {
    if (!agreeTerms) { setErrorMsg('Anda harus menyetujui Syarat & Ketentuan.'); return; }
    setLoading(true);
    setErrorMsg('');
    try {
      await register(name, email, password, phone);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.response?.data?.errors?.email?.[0] || err?.response?.data?.errors?.password?.[0] || 'Pendaftaran gagal. Silakan periksa kembali data Anda.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 pt-24">
      <div className="max-w-4xl w-full bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary to-navy text-primary-foreground p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
            />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-golden/20 blur-3xl rounded-full" />
            <div className="absolute top-20 -left-20 w-40 h-40 bg-navy-light/40 blur-3xl rounded-full" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/40">
                  <ShieldCheck className="w-6 h-6 text-golden" />
                </div>
                <h2 className="font-heading font-black text-xl">SIPIL BAUBAU</h2>
              </div>

              {/* Register Illustration */}
              <div className="w-full max-w-xs mx-auto">
                <img
                  src={heroPng}
                  alt="Ilustrasi SIPIL BAUBAU"
                  className="w-full h-auto object-contain rounded-xl"
                  loading="lazy"
                />
              </div>

              <div className="text-center">
                <h1 className="font-heading text-2xl font-black leading-tight">Buat Akun Baru</h1>
                <p className="text-sm text-white/80 mt-2">Bergabunglah dengan ribuan warga Baubau yang peduli dengan infrastruktur kota.</p>
              </div>
            </div>

            <div className="relative z-10">
              <Stepper steps={steps} currentStep={step} orientation="vertical" />
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex items-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              {errorMsg && (
                <div className="p-4 bg-danger-bg border border-danger-border text-danger text-sm font-bold rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Step 0: Personal Data */}
              {step === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <Input
                    label="Nama Lengkap"
                    required
                    placeholder="Masukkan nama sesuai KTP"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="Nomor HP"
                    type="tel"
                    placeholder="08xx xxxx xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Button fullWidth icon={ArrowRight} iconPosition="right" onClick={handleNext}>
                    Selanjutnya
                  </Button>
                </div>
              )}

              {/* Step 1: Account */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <Input
                    label="Alamat Email"
                    type="email"
                    required
                    placeholder="contoh@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <Input
                    label="Kata Sandi"
                    type="password"
                    required
                    placeholder="Min. 8 karakter (Huruf Besar, Kecil, Angka)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <Input
                    label="Konfirmasi Kata Sandi"
                    type="password"
                    required
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    error={confirmPassword && password !== confirmPassword ? 'Kata sandi tidak cocok' : undefined}
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" icon={ArrowLeft} onClick={() => setStep(0)}>
                      Kembali
                    </Button>
                    <Button fullWidth icon={ArrowRight} iconPosition="right" onClick={handleNext}>
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Confirm */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-muted rounded-2xl p-5 space-y-3">
                    <h3 className="font-heading font-bold text-foreground">Ringkasan Data</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Nama</span><span className="font-semibold text-foreground">{name}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">HP</span><span className="font-semibold text-foreground">{phone || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-semibold text-foreground">{email}</span></div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-border text-primary focus:ring-ring"
                    />
                    <span>
                      Saya menyetujui <a href="#" className="text-primary font-bold underline">Syarat & Ketentuan</a> serta{' '}
                      <a href="#" className="text-primary font-bold underline">Kebijakan Privasi</a> SIPIL BAUBAU.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <Button variant="outline" icon={ArrowLeft} onClick={() => setStep(1)}>
                      Kembali
                    </Button>
                    <Button fullWidth loading={loading} icon={ArrowRight} iconPosition="right" onClick={handleSubmit}>
                      Daftar Sekarang
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground pt-2">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
