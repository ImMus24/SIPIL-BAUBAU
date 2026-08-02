import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Map, LayoutDashboard, BarChart3, CornerDownLeft, Command, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  path: string;
  keywords?: string[];
  roles?: string[];
}

const ALL_ITEMS: CommandItem[] = [
  { id: 'home', label: 'Beranda', description: 'Halaman utama publik', icon: Map, path: '/' },
  { id: 'map', label: 'Peta Interaktif', description: 'Sebaran laporan infrastruktur', icon: Map, path: '/map' },
  { id: 'submit', label: 'Buat Pengaduan', description: 'Laporkan kerusakan infrastruktur', icon: FileText, path: '/submit' },
  { id: 'track', label: 'Lacak Laporan', description: 'Cek status via kode tiket', icon: Search, path: '/track' },
  { id: 'stats', label: 'Statistik', description: 'Data pengaduan Kota Baubau', icon: BarChart3, path: '/stats' },
  { id: 'about', label: 'Tentang', description: 'Informasi SIPIL BAUBAU', icon: Map, path: '/about' },
  { id: 'faq', label: 'FAQ', description: 'Pertanyaan yang sering diajukan', icon: Map, path: '/faq' },
  { id: 'login', label: 'Masuk Portal', description: 'Login sebagai warga/petugas', icon: Map, path: '/login' },
  { id: 'register', label: 'Daftar Akun', description: 'Buat akun baru', icon: Map, path: '/register' },
];

const ROLE_ITEMS: Record<string, CommandItem[]> = {
  citizen: [
    { id: 'citizen-dash', label: 'Dashboard Warga', description: 'Ringkasan pengaduan Anda', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'citizen-notif', label: 'Notifikasi', description: 'Pemberitahuan terbaru', icon: Map, path: '/notifications' },
    { id: 'citizen-profile', label: 'Profil Saya', description: 'Kelola data akun', icon: Map, path: '/profile' },
  ],
  officer: [
    { id: 'officer-dash', label: 'Dashboard Petugas', description: 'Tugas dan kinerja Anda', icon: LayoutDashboard, path: '/officer' },
    { id: 'officer-notif', label: 'Notifikasi', description: 'Pemberitahuan terbaru', icon: Map, path: '/notifications' },
    { id: 'officer-profile', label: 'Profil Saya', description: 'Kelola data akun', icon: Map, path: '/profile' },
  ],
  admin: [
    { id: 'admin-dash', label: 'Dashboard Admin', description: 'Verifikasi & kelola laporan', icon: LayoutDashboard, path: '/admin' },
    { id: 'admin-verif', label: 'Antrian Verifikasi', description: 'Laporan menunggu verifikasi', icon: Map, path: '/admin?tab=verifikasi' },
    { id: 'admin-users', label: 'Kelola Pengguna', description: 'Manajemen akun pengguna', icon: Map, path: '/admin?tab=pengguna' },
    { id: 'admin-audit', label: 'Audit Log', description: 'Rekam jejak sistem', icon: Map, path: '/admin?tab=audit' },
    { id: 'admin-notif', label: 'Notifikasi', description: 'Pemberitahuan terbaru', icon: Map, path: '/notifications' },
  ],
  head_of_agency: [
    { id: 'head-dash', label: 'Dashboard Kepala Dinas', description: 'Monitoring eksekutif', icon: LayoutDashboard, path: '/kepala-dinas' },
    { id: 'head-analytics', label: 'Analitik', description: 'Tren dan performa', icon: Map, path: '/kepala-dinas?tab=analitik' },
    { id: 'head-notif', label: 'Notifikasi', description: 'Pemberitahuan terbaru', icon: Map, path: '/notifications' },
  ],
};

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = useMemo(() => {
    const base = [...ALL_ITEMS];
    if (role && ROLE_ITEMS[role]) base.unshift(...ROLE_ITEMS[role]);
    const q = query.toLowerCase().trim();
    if (!q) return base.slice(0, 12);
    return base
      .filter((item) =>
        item.label.toLowerCase().includes(q) ||
        (item.description ?? '').toLowerCase().includes(q) ||
        (item.keywords ?? []).some((k) => k.includes(q)),
      )
      .slice(0, 12);
  }, [query, role]);

  const run = (item: CommandItem) => {
    setOpen(false);
    navigate(item.path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian cepat"
            className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, items.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
              if (e.key === 'Enter' && items[highlighted]) run(items[highlighted]);
            }}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
                placeholder="Cari halaman, menu, atau fitur..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                aria-label="Cari halaman"
              />
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors" aria-label="Tutup pencarian">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[40vh] overflow-y-auto p-2" role="listbox">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Tidak ada hasil untuk "{query}"
                </p>
              ) : (
                items.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = idx === highlighted;
                  return (
                    <button
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => run(item)}
                      onMouseEnter={() => setHighlighted(idx)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
                        isActive ? 'bg-primary-light/60 dark:bg-primary/15' : 'hover:bg-muted/60',
                      )}
                    >
                      <div className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                      )}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-semibold truncate', isActive ? 'text-primary' : 'text-foreground')}>
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        )}
                      </div>
                      <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-muted/30 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Command className="w-3 h-3" /> K untuk membuka</span>
              <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> pilih</span>
              <span className="flex items-center gap-1">↑↓ navigasi</span>
              <span className="flex items-center gap-1">ESC tutup</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
