import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, Bell, LogOut, Home, Search, X, ChevronLeft, ChevronRight, ShieldCheck, MapPin,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ROLE_LABELS } from '../../config/constants';
import {
  getCitizenSidebarSections,
  getOfficerSidebarSections,
  getAdminSidebarSections,
  getHeadSidebarSections,
} from '../../config/sidebar';
import type { SidebarSection } from '../../config/sidebar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Dropdown } from '../ui/Dropdown';
import { CommandPalette } from '../ui/CommandPalette';
import { Avatar } from '../ui/Avatar';
import { Tooltip } from '../ui/Tooltip';
import { dashboardService } from '../../services/dashboardService';
import type { AppNotification } from '../../types';
import { formatDateTime } from '../../lib/utils';

const SIDEBAR_WIDTH = 268;
const SIDEBAR_COLLAPSED = 84;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop rail
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isItemActive = useCallback((path: string) => {
    const [p, q] = path.split('?');
    if (q) return location.pathname + location.search === path;
    return location.pathname === p;
  }, [location.pathname, location.search]);

  useEffect(() => {
    setNotifOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Fetch real notifications + unread count
  const fetchNotifications = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        dashboardService.getNotifications({ per_page: 5 }),
        dashboardService.getUnreadCount(),
      ]);
      setNotifications(list.items);
      setUnreadCount(count);
    } catch {
      // Silent — header should never crash on notification fetch failure.
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Refresh the bell when the dropdown opens so badges stay current.
  useEffect(() => {
    if (notifOpen) fetchNotifications();
  }, [notifOpen, fetchNotifications]);

  const getSections = useCallback((): SidebarSection[] => {
    switch (role) {
      case 'officer': return getOfficerSidebarSections();
      case 'admin': return getAdminSidebarSections();
      case 'head_of_agency': return getHeadSidebarSections();
      default: return getCitizenSidebarSections();
    }
  }, [role]);

  const sidebarSections = useMemo(() => getSections(), [getSections]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashRoute = useMemo(() => {
    const map: Record<string, string> = {
      citizen: '/dashboard',
      officer: '/officer',
      admin: '/admin',
      head_of_agency: '/kepala-dinas',
    };
    return map[role ?? 'citizen'] ?? '/dashboard';
  }, [role]);

  const breadcrumbLabel = useMemo(() => {
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard Warga',
      '/officer': 'Dashboard Petugas',
      '/admin': 'Dashboard Admin',
      '/kepala-dinas': 'Dashboard Monitoring',
      '/profile': 'Profil Saya',
      '/notifications': 'Notifikasi',
    };
    return map[location.pathname] ?? 'SIPIL BAUBAU';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Floating Sidebar ── */}
      <motion.aside
        className={cn(
          'fixed z-50 flex flex-col',
          'top-4 bottom-4 left-4 rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-xl overflow-hidden',
          'lg:top-5 lg:bottom-5 lg:left-5',
        )}
        initial={false}
        animate={{
          width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
          x: sidebarOpen ? 0 : -SIDEBAR_WIDTH - 40,
        }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.12 }}
        style={{
          // On mobile, width stays full when drawer opens
          ...(sidebarOpen ? { width: SIDEBAR_WIDTH } : {}),
        }}
        aria-label="Navigasi utama"
      >
        {/* Brand */}
        <div className={cn('flex items-center gap-3 px-4 py-4 border-b border-border', collapsed && !sidebarOpen && 'lg:justify-center lg:px-2')}>
          <Link to={dashRoute} className="flex items-center gap-3 min-w-0 group" onClick={() => setSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-navy flex items-center justify-center text-primary-foreground shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-golden" aria-hidden="true" />
            </div>
            {(sidebarOpen || !collapsed) && (
              <div className="min-w-0">
                <p className="font-heading font-extrabold text-sm leading-tight text-foreground truncate">SIPIL BAUBAU</p>
                <p className="text-[10px] text-muted-foreground truncate">{role ? ROLE_LABELS[role] : 'Guest'}</p>
              </div>
            )}
          </Link>
          {/* Close (mobile) */}
          <button
            className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-5">
          {sidebarSections.map((section, idx) => (
            <div key={idx}>
              {section.title && (sidebarOpen || !collapsed) && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = isItemActive(item.path);
                  const Icon = item.icon;
                  const linkContent = (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'relative flex items-center gap-3 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ring',
                        collapsed && !sidebarOpen ? 'lg:justify-center lg:px-0' : 'px-3',
                        'py-2.5',
                        isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Active indicator pill */}
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-primary-light dark:bg-primary/15 rounded-xl"
                          transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                        />
                      )}
                      <span className="relative z-[1] shrink-0">
                        <Icon className={cn('w-5 h-5', isActive && 'text-primary')} aria-hidden="true" />
                        {item.badge ? (
                          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        ) : null}
                      </span>
                      {(sidebarOpen || !collapsed) && (
                        <span className="relative z-[1] truncate">{item.label}</span>
                      )}
                      {isActive && (sidebarOpen || !collapsed) && (
                        <span className="relative z-[1] ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" aria-hidden="true" />
                      )}
                    </Link>
                  );
                  return collapsed && !sidebarOpen ? (
                    <Tooltip key={item.path} content={item.label} position="right">
                      {linkContent}
                    </Tooltip>
                  ) : (
                    <React.Fragment key={item.path}>{linkContent}</React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className={cn('p-3 border-t border-border space-y-1', collapsed && !sidebarOpen && 'flex flex-col items-center')}>
          <Tooltip content="Beranda Publik" position="right">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors py-2.5',
                collapsed && !sidebarOpen ? 'lg:justify-center lg:px-0' : 'px-3',
              )}
            >
              <Home className="w-5 h-5 shrink-0" aria-hidden="true" />
              {(sidebarOpen || !collapsed) && <span>Beranda Publik</span>}
            </Link>
          </Tooltip>
          <Tooltip content="Keluar Akun" position="right">
            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors py-2.5',
                collapsed && !sidebarOpen ? 'lg:justify-center lg:px-0' : 'px-3',
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
              {(sidebarOpen || !collapsed) && <span>Keluar Akun</span>}
            </button>
          </Tooltip>

          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'hidden lg:flex items-center gap-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors py-2.5 w-full',
              collapsed && 'lg:justify-center lg:px-0',
            )}
            aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span>Ciutkan</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <div className="flex flex-col min-h-screen transition-[padding] duration-300">
        <div className="lg:hidden h-16" />
        <div className="hidden lg:block" style={{ height: 0 }} />

        {/* ── Sticky Header ── */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center gap-3 px-4 lg:px-8 lg:ml-[84px]">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb (desktop) */}
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-sm min-w-0">
            <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span className="text-muted-foreground">Kota Baubau</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-foreground truncate">{breadcrumbLabel}</span>
          </nav>

          {/* Search */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari tiket, judul, atau lokasi...  (Ctrl K)"
              onFocus={(e) => { e.currentTarget.blur(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })); }}
              readOnly
              aria-label="Cari (Ctrl K)"
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/25 focus:border-ring cursor-pointer transition-all"
            />
          </div>

          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            {/* Theme toggle */}
            <ThemeToggle variant="cycle" />

            {/* Notifications dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
                aria-label="Notifikasi"
                aria-expanded={notifOpen}
              >
                <Bell className="w-5 h-5" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[14px] h-4 px-1 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
                    role="menu"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                      <h3 className="font-heading font-bold text-sm text-foreground">Notifikasi</h3>
                      <span className="text-[10px] font-bold bg-danger/10 text-danger px-2 py-0.5 rounded-full">{unreadCount} baru</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" aria-hidden="true" />
                          <p className="text-sm text-muted-foreground">Belum ada notifikasi</p>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const data = (n.data ?? {}) as Record<string, unknown>;
                          const complaintId = typeof data.complaint_id === 'number' ? data.complaint_id : null;
                          return (
                            <button
                              key={n.id}
                              onClick={() => { setNotifOpen(false); navigate(complaintId ? `/complaints/${complaintId}` : '/notifications'); }}
                              className={cn(
                                'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0',
                                !n.is_read && 'bg-primary-light/30 dark:bg-primary/10',
                              )}
                            >
                              <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                              <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                                {n.created_at ? formatDateTime(n.created_at) : ''}
                              </p>
                            </button>
                          );
                        })
                      )}
                    </div>
                    <button
                      onClick={() => { setNotifOpen(false); navigate('/notifications'); }}
                      className="w-full py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary-light/50 dark:hover:bg-primary/10 transition-colors border-t border-border"
                    >
                      Lihat Semua Notifikasi
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <Dropdown
                showChevron={false}
                align="right"
                trigger={
                  <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                    <Avatar name={user?.name || 'User'} size="sm" />
                    <span className="hidden lg:block text-sm font-semibold text-foreground max-w-[120px] truncate">
                      {user?.name}
                    </span>
                  </div>
                }
                items={[
                  { label: 'Dashboard', icon: <Home className="w-4 h-4" />, onClick: () => navigate(dashRoute) },
                  { label: 'Profil Saya', icon: <Home className="w-4 h-4" />, onClick: () => navigate('/profile') },
                  { label: 'Notifikasi', icon: <Bell className="w-4 h-4" />, onClick: () => navigate('/notifications') },
                  { label: 'Keluar', icon: <LogOut className="w-4 h-4" />, onClick: handleLogout, variant: 'danger', divider: true },
                ]}
              />
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 lg:ml-[84px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] w-full">
          <motion.div
            key={location.pathname + location.search}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
