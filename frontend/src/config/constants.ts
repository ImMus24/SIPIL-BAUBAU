export const APP_NAME = 'SIPIL BAUBAU';
export const APP_DESCRIPTION = 'Sistem Pengaduan Infrastruktur Berbasis Web dengan Pemetaan Lokasi dan Monitoring Penanganan Laporan';
export const APP_VERSION = '2.0.0';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 15000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sipil_auth_token',
  USER: 'sipil_user',
  THEME_MODE: 'sipil-baubau-theme-mode',
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50],
} as const;

export const ROUTES = {
  HOME: '/',
  MAP: '/map',
  SUBMIT: '/submit',
  TRACK: '/track',
  STATS: '/stats',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const;

export const SUBDISTRICTS = [
  'Wolio', 'Betoambari', 'Murhum', 'Kokalukuna',
  'Lea-Lea', 'Sorawolio', 'Bungi', 'Batupoaro',
] as const;

export const URGENCY_OPTIONS = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
  { value: 'darurat', label: 'Darurat' },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  officer: 'Petugas',
  citizen: 'Warga',
  head_of_agency: 'Kepala Dinas',
};
