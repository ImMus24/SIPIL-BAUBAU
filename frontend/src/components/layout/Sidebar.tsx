import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  type LucideIcon,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  onLogout: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ sections, onLogout, className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <aside
      className={clsx(
        'fixed left-0 top-20 h-[calc(100vh-5rem)] bg-card border-r border-border flex flex-col transition-all duration-300 z-30',
        'lg:block', // desktop always visible
        collapsed ? 'w-[72px]' : 'w-[260px]',
        mobileOpen ? 'block shadow-2xl' : 'hidden', // mobile toggle
        className
      )}
    >
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[-1] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Toggle */}
      <button
        data-sidebar-toggle
        onClick={() => {
          if (isMobile) setMobileOpen(!mobileOpen);
          else setCollapsed(!collapsed);
        }}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm z-10"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {sections.map((section, idx) => (
          <div key={idx}>
            {section.title && !collapsed && (
              <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                      isActive
                        ? 'bg-primary-light text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <div className="relative">
                      <Icon className={clsx('w-5 h-5 shrink-0', isActive && 'text-primary')} />
                      {item.badge && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to="/"
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <Home className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Beranda Publik</span>}
        </Link>
        <button
          onClick={onLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-bg transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Keluar Akun</span>}
        </button>
      </div>
    </aside>
  );
};
