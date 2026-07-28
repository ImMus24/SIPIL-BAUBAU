import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldCheck,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Sun,
  Moon,
  Monitor,
  Bell,
  Search,
  Settings,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  const userDropdownItems = user
    ? [
        {
          label: 'Dashboard Saya',
          icon: <LayoutDashboard className="w-4 h-4" />,
          onClick: () => navigate(role === 'citizen' ? '/dashboard' : '/admin'),
        },
        { label: 'Pengaturan', icon: <Settings className="w-4 h-4" />, onClick: () => {}, divider: true },
        {
          label: 'Keluar',
          icon: <LogOut className="w-4 h-4" />,
          onClick: handleLogout,
          variant: 'danger' as const,
        },
      ]
    : [];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 shadow-lg backdrop-blur-xl border-b border-border'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 max-w-container mx-auto h-20">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-primary-foreground shadow-md ring-2 ring-accent/80 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg text-foreground tracking-tight">SIPIL BAUBAU</span>
              <span className="bg-accent text-accent-foreground text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                KOTA BAUBAU
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground hidden sm:block">
              Sistem Pengaduan Infrastruktur Berbasis Web
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-semibold py-1 transition-colors duration-150 ${
                isActive(link.path)
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden lg:flex p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Cari"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <div className="hidden lg:flex items-center p-1 bg-muted rounded-full border border-border">
            {(['light', 'dark', 'system'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`p-1.5 rounded-full transition-all ${
                  mode === m
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={m === 'light' ? 'Terang' : m === 'dark' ? 'Gelap' : 'Sistem'}
              >
                {m === 'light' ? <Sun className="w-4 h-4" /> : m === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Notification */}
          {isAuthenticated && (
            <button className="hidden lg:flex p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-card" />
            </button>
          )}

          {/* User Menu */}
          {isAuthenticated && user ? (
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-border">
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                    <Avatar name={user.name} size="sm" />
                    <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </div>
                }
                items={userDropdownItems}
                align="right"
              />
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm active:scale-[0.98]"
            >
              Masuk Portal
            </Link>
          )}

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-foreground hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border px-6 py-5 space-y-3 shadow-xl animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-semibold py-2.5 ${
                isActive(link.path) ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <Avatar name={user?.name || ''} size="md" />
                  <div>
                    <p className="font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  icon={LayoutDashboard}
                  onClick={() => { setMobileMenuOpen(false); navigate(role === 'citizen' ? '/dashboard' : '/admin'); }}
                >
                  Dashboard
                </Button>
                <Button variant="danger" fullWidth icon={LogOut} onClick={handleLogout}>
                  Keluar Akun
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm"
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
