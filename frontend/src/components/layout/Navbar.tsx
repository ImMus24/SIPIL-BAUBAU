import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  MapPin,
  FilePlus,
  Search,
  BarChart3,
  Info,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Beranda', icon: Building2 },
    { path: '/map', label: 'Peta GIS', icon: MapPin },
    { path: '/submit', label: 'Buat Laporan', icon: FilePlus },
    { path: '/track', label: 'Cek Status', icon: Search },
    { path: '/stats', label: 'Statistik', icon: BarChart3 },
    { path: '/about', label: 'Tentang', icon: Info },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Matching Baubau Shield Blue & Yellow */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 flex items-center justify-center text-white font-black text-xl shadow-md ring-2 ring-amber-400/80 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">SIPIL BAUBAU</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  KOTA BAUBAU
                </span>
              </div>
              <p className="text-xs font-medium text-sky-800 hidden sm:block">
                Sistem Pengaduan Infrastruktur Berbasis Web
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-sky-50 text-sky-800 shadow-xs border border-sky-200'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-sky-700' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={role === 'citizen' ? '/dashboard' : '/admin'}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-950 text-white rounded-xl text-xs font-bold hover:bg-sky-900 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>{role === 'admin' ? 'Portal Admin' : role === 'officer' ? 'Portal OPD' : 'Dashboard Saya'}</span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</p>
                    <span className="text-[10px] font-bold text-sky-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded capitalize">
                      {role === 'admin' ? 'Admin Super' : role === 'officer' ? 'Petugas OPD' : 'Masyarakat'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Keluar"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors"
                >
                  Masuk Portal
                </Link>
                <Link
                  to="/submit"
                  className="px-4.5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-800 text-white text-xs font-bold rounded-xl shadow-md hover:from-sky-700 hover:to-sky-900 transition-all flex items-center space-x-1.5 ring-1 ring-amber-400/50"
                >
                  <FilePlus className="w-4 h-4 text-amber-300" />
                  <span>Laporkan Sekarang</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                  active ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 text-sky-600" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={role === 'citizen' ? '/dashboard' : '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center bg-sky-950 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>{role === 'admin' ? 'Portal Admin' : role === 'officer' ? 'Portal OPD' : 'Dashboard Saya'}</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-3 text-center bg-rose-50 text-rose-700 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                >
                  Masuk Portal
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center bg-sky-700 text-white rounded-xl text-sm font-bold"
                >
                  Daftar Akun Baru
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
