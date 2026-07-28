import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Map, BarChart3, User, Bell, LogOut,
  Menu, Home,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { ROLE_LABELS } from '../../config/constants';

type NavItem = { label: string; href: string; icon: React.ReactNode; roles: string[] };

const navItems: NavItem[] = [
  { label: 'Beranda', href: '/', icon: <Home className="w-4 h-4" />, roles: ['citizen', 'officer', 'admin', 'head_of_agency'] },
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['citizen'] },
  { label: 'Dashboard Petugas', href: '/officer', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['officer'] },
  { label: 'Dashboard Admin', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['admin'] },
  { label: 'Dashboard Monitoring', href: '/kepala-dinas', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['head_of_agency'] },
  { label: 'Buat Pengaduan', href: '/submit', icon: <FileText className="w-4 h-4" />, roles: ['citizen', 'admin'] },
  { label: 'Peta Pengaduan', href: '/map', icon: <Map className="w-4 h-4" />, roles: ['citizen', 'officer', 'admin', 'head_of_agency'] },
  { label: 'Statistik', href: '/stats', icon: <BarChart3 className="w-4 h-4" />, roles: ['citizen', 'officer', 'admin', 'head_of_agency'] },
  { label: 'Profil', href: '/profile', icon: <User className="w-4 h-4" />, roles: ['citizen', 'officer', 'admin', 'head_of_agency'] },
  { label: 'Notifikasi', href: '/notifications', icon: <Bell className="w-4 h-4" />, roles: ['citizen', 'officer', 'admin', 'head_of_agency'] },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredItems = navItems.filter(
    (item) => user?.role && item.roles.includes(user.role),
  );

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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              SB
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">SIPIL BAUBAU</p>
              <p className="text-[10px] text-muted-foreground">{user?.role ? ROLE_LABELS[user.role] || user.role : 'Guest'}</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-danger/10 hover:text-danger transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-sm border-b border-border flex items-center gap-3 px-4">
          <button className="md:hidden p-2 rounded-lg hover:bg-accent" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link to="/notifications" className="p-2 rounded-lg hover:bg-accent relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {user?.name?.[0] ?? '?'}
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
