import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b border-[#c3c6d7]/30 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 max-w-[1280px] mx-auto h-16">
        
        {/* Brand Name */}
        <Link to="/" className="font-headline font-bold text-xl sm:text-2xl text-[#004ac6] tracking-tight">
          SIPIL BAUBAU
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-[#004ac6] font-semibold border-b-2 border-[#004ac6] pb-1'
                    : 'text-[#434655] hover:text-[#004ac6] hover:scale-105'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User Auth Action Button */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={role === 'citizen' ? '/dashboard' : '/admin'}
                className="inline-flex items-center space-x-2 px-5 py-2 bg-[#004ac6] hover:bg-[#2563eb] text-white rounded-full text-xs font-semibold shadow-lg shadow-[#004ac6]/20 transition-all active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{role === 'admin' ? 'Portal Admin' : role === 'officer' ? 'Portal OPD' : 'Dashboard'}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2 text-[#737686] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-[#004ac6]/20"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#434655] hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-medium py-2 ${
                isActive(link.path) ? 'text-[#004ac6] font-bold' : 'text-[#434655]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 text-center bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-bold"
              >
                Keluar Akun
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center bg-[#004ac6] text-white rounded-full text-sm font-semibold"
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
