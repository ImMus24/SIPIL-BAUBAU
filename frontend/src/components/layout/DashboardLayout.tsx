import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from './Sidebar';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  role: 'citizen' | 'admin' | 'officer';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle, role }) => {
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const citizenSections = [
    {
      title: 'Utama',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Buat Laporan', icon: FileText, path: '/submit' },
        { label: 'Cek Status', icon: MapPin, path: '/track' },
        { label: 'Statistik', icon: BarChart3, path: '/stats' },
      ],
    },
    {
      title: 'Bantuan',
      items: [
        { label: 'FAQ & Tentang', icon: HelpCircle, path: '/about' },
        { label: 'Pengaturan', icon: Settings, path: '/settings' },
      ],
    },
  ];

  const adminSections = [
    {
      title: 'Utama',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { label: 'Semua Laporan', icon: FileText, path: '/admin/reports', badge: 12 },
        { label: 'Peta', icon: MapPin, path: '/map' },
        { label: 'Statistik', icon: BarChart3, path: '/stats' },
      ],
    },
    {
      title: 'Manajemen',
      items: [
        { label: 'Pengguna', icon: Users, path: '/admin/users' },
        { label: 'Pengaturan', icon: Settings, path: '/admin/settings' },
      ],
    },
  ];

  const sections = role === 'citizen' ? citizenSections : adminSections;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="fixed top-20 left-0 right-0 z-20 h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 transition-all lg:ml-[260px]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const sidebarToggle = document.querySelector('[data-sidebar-toggle]') as HTMLButtonElement;
              sidebarToggle?.click();
            }}
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Buka menu sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme quick toggle */}
          <div className="hidden sm:flex items-center p-1 bg-muted rounded-full border border-border">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`p-1.5 rounded-full transition-all ${
                  mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {m === 'light' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {/* Notification */}
          <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-card" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <Avatar name={user?.name || ''} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role === 'citizen' ? 'Warga' : role === 'admin' ? 'Admin' : 'Petugas'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar sections={sections} onLogout={handleLogout} />

      {/* Main Content */}
      <main
        className="pt-36 min-h-screen transition-all duration-300 lg:ml-[260px]">
        <div className="px-4 sm:px-8 pb-12 max-w-container">
          {children}
        </div>
      </main>
    </div>
  );
};
