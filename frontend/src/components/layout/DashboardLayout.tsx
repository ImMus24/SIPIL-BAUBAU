import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu, Bell, LogOut, Sun, Moon, Home, Search, X,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ROLE_LABELS } from '../../config/constants';
import {
  getCitizenSidebarSections,
  getOfficerSidebarSections,
  getAdminSidebarSections,
  getHeadSidebarSections,
} from '../../config/sidebar';
import type { SidebarSection } from '../../config/sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, role } = useAuth();
  const { isDark, setMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const getSections = (): SidebarSection[] => {
    switch (role) {
      case 'officer': return getOfficerSidebarSections();
      case 'admin': return getAdminSidebarSections();
      case 'head_of_agency': return getHeadSidebarSections();
      default: return getCitizenSidebarSections();
    }
  };

  const sidebarSections = getSections();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}>
        {/* Brand */}
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-primary-foreground font-bold text-xs shadow-sm">
              SB
            </div>
            <div>
              <p className="font-heading font-semibold text-sm leading-tight">SIPIL BAUBAU</p>
              <p className="text-[10px] text-muted-foreground">{role ? ROLE_LABELS[role] : 'Guest'}</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {sidebarSections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname + location.search === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        'hover:bg-accent hover:text-foreground',
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground',
                      )}
                    >
                      <div className="relative">
                        <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
                        {item.badge ? (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                      <span className="truncate">{item.label}</span>
                      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Home className="w-5 h-5 shrink-0" />
            <span>Beranda Publik</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center gap-3 px-4 lg:px-6">
          <button className="md:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari tiket, judul, atau lokasi..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-accent border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setMode(isDark ? 'light' : 'dark')}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <Link to="/notifications" className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-background" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-accent transition-colors ml-1"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                  {user?.name?.[0] ?? '?'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-foreground leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                </div>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{role ? ROLE_LABELS[role] : ''}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                      Profil Saya
                    </Link>
                    <Link to="/notifications" onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                      Notifikasi
                    </Link>
                    <hr className="my-1 border-border" />
                    <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors">
                      Keluar Akun
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Search bar mobile */}
        {searchOpen && (
          <div className="sm:hidden p-3 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Cari tiket, judul..."
                className="w-full h-10 pl-9 pr-10 rounded-xl bg-accent border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
