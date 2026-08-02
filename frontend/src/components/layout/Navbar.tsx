import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck, LogOut, Menu, X, LayoutDashboard, Bell, Search, Home,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CommandPalette } from '../ui/CommandPalette';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { path: '/track', label: 'Lacak Status' },
    { path: '/faq', label: 'FAQ' },
    { path: '/about', label: 'Tentang' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashRoute = (() => {
    const routes: Record<string, string> = {
      citizen: '/dashboard',
      officer: '/officer',
      admin: '/admin',
      head_of_agency: '/kepala-dinas',
    };
    return routes[role ?? 'citizen'] ?? '/dashboard';
  })();

  const userDropdownItems = user
    ? [
        {
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          onClick: () => navigate(dashRoute),
        },
        {
          label: 'Profil',
          icon: <Home className="w-4 h-4" />,
          onClick: () => navigate('/profile'),
          divider: true,
        },
        {
          label: 'Notifikasi',
          icon: <Bell className="w-4 h-4" />,
          onClick: () => navigate('/notifications'),
        },
        {
          label: 'Keluar',
          icon: <LogOut className="w-4 h-4" />,
          onClick: handleLogout,
          variant: 'danger' as const,
        },
      ]
    : [];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-card/90 shadow-lg backdrop-blur-xl border-b border-border'
            : 'bg-card/70 backdrop-blur-md border-b border-transparent',
        )}
        aria-label="Navigasi utama"
      >
        <div className="flex items-center justify-between px-4 sm:px-8 max-w-[1440px] mx-auto h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-navy flex items-center justify-center text-primary-foreground shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-golden" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-foreground tracking-tight">SIPIL BAUBAU</span>
                <span className="bg-golden text-golden-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
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
                className={cn(
                  'relative text-sm font-semibold py-1 transition-colors duration-150',
                  isActive(link.path)
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-golden rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search → Command palette */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              className="hidden lg:flex items-center gap-2 p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Cari (Ctrl+K)"
              aria-label="Cari (Ctrl+K)"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              <kbd className="hidden xl:inline text-[10px] font-semibold px-1.5 py-0.5 rounded border border-border bg-muted">Ctrl K</kbd>
            </button>

            {/* Theme Toggle */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {/* Notification */}
            {isAuthenticated && (
              <Link to="/notifications" className="hidden lg:flex p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
                <Bell className="w-5 h-5" aria-hidden="true" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-card animate-pulse-dot" />
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-border">
                <Dropdown
                  showChevron={false}
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
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm shadow-primary/20 active:scale-[0.98]"
              >
                Masuk Portal
              </Link>
            )}

            {/* Mobile Hamburger */}
            <div className="lg:hidden flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                icon={mobileMenuOpen ? X : Menu}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={mobileMenuOpen}
              >
              </Button>
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
                className={cn(
                  'block text-base font-semibold py-2.5',
                  isActive(link.path) ? 'text-primary font-bold' : 'text-muted-foreground',
                )}
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
                  <Button variant="outline" fullWidth icon={LayoutDashboard} onClick={() => { setMobileMenuOpen(false); navigate(dashRoute); }}>
                    Dashboard
                  </Button>
                  <Button variant="danger" fullWidth icon={LogOut} onClick={handleLogout}>
                    Keluar Akun
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm"
                  >
                    Masuk Portal
                  </Link>
                  <div className="flex items-center justify-center">
                    <ThemeToggle variant="cycle" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <CommandPalette />
    </>
  );
};
