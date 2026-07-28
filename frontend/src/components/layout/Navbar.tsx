import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheck, LogOut, Menu, X, LayoutDashboard, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/stats', label: 'Statistik' },
    { path: '/map', label: 'Peta Interaktif' },
    { path: '/submit', label: 'Buat Laporan' },
    { path: '/track', label: 'Cek Status' },
    { path: '/about', label: 'FAQ & Tentang' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b border-sky-100 dark:border-slate-700 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 shadow-md backdrop-blur-xl'
          : 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl'
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 max-w-[1280px] mx-auto h-20">
        
        {/* Brand Shield Logo matching Logo Kota Baubau */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 flex items-center justify-center text-white font-black text-xl shadow-md ring-2 ring-amber-400/90 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-headline font-black text-lg text-slate-900 dark:text-white tracking-tight">SIPIL BAUBAU</span>
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                KOTA BAUBAU
              </span>
            </div>
            <p className="text-xs font-medium text-sky-800 dark:text-sky-400 hidden sm:block">
              Sistem Pengaduan Infrastruktur Berbasis Web
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-6 items-center">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-all duration-200 py-1 ${
                  active
                    ? 'text-sky-800 dark:text-sky-400 font-bold border-b-2 border-amber-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-400 hover:scale-105'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User Auth Action Button + Dark Mode Toggle */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={role === 'citizen' ? '/dashboard' : '/admin'}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-950 dark:bg-sky-700 hover:bg-slate-900 dark:hover:bg-sky-600 text-white rounded-full text-sm font-bold shadow-md transition-all active:scale-95 border border-amber-400/40"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>{role === 'admin' ? 'Portal Admin' : role === 'officer' ? 'Portal OPD' : 'Dashboard Saya'}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-sky-700 via-sky-800 to-sky-900 hover:from-sky-800 hover:to-sky-950 text-white px-7 py-3 rounded-full text-sm font-extrabold shadow-lg shadow-sky-800/20 transition-all active:scale-95 ring-1 ring-amber-400/60"
            >
              Masuk Portal
            </Link>
          )}
        </div>

        {/* Mobile Menu Button + Dark Toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-5 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-semibold py-2.5 ${
                isActive(link.path) ? 'text-sky-800 dark:text-sky-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-3 text-center bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 rounded-xl text-sm font-bold"
              >
                Keluar Akun
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3.5 text-center bg-sky-800 text-white rounded-full text-sm font-extrabold shadow-md"
              >
                Masuk Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
