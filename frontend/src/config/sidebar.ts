import {
  LayoutDashboard,
  FileText,
  Map,
  BarChart3,
  Bell,
  User,
  Settings,
  ClipboardCheck,
  Users,
  Building2,
  ShieldCheck,
  FileSpreadsheet,
  Activity,
  ListChecks,
  MapPin,
  TrendingUp,
  Award,
  Download,
  PieChart,
  type LucideIcon,
} from 'lucide-react';

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export function getCitizenSidebarSections(badge?: number): SidebarSection[] {
  return [
    {
      title: 'Menu Utama',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Buat Pengaduan', icon: FileText, path: '/submit' },
        { label: 'Pengaduan Saya', icon: ClipboardCheck, path: '/track' },
        { label: 'Peta', icon: Map, path: '/map' },
        { label: 'Statistik', icon: BarChart3, path: '/stats' },
      ],
    },
    {
      title: 'Lainnya',
      items: [
        { label: 'Notifikasi', icon: Bell, path: '/notifications', badge },
        { label: 'Profil', icon: User, path: '/profile' },
      ],
    },
  ];
}

export function getOfficerSidebarSections(badge?: number): SidebarSection[] {
  return [
    {
      title: 'Menu Utama',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/officer' },
        { label: 'Tugas Saya', icon: ListChecks, path: '/officer' },
        { label: 'Peta Tugas', icon: MapPin, path: '/map' },
        { label: 'Riwayat', icon: Activity, path: '/track' },
      ],
    },
    {
      title: 'Lainnya',
      items: [
        { label: 'Notifikasi', icon: Bell, path: '/notifications', badge },
        { label: 'Profil', icon: User, path: '/profile' },
      ],
    },
  ];
}

export function getAdminSidebarSections(badge?: number): SidebarSection[] {
  return [
    {
      title: 'Administrasi',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { label: 'Verifikasi', icon: ClipboardCheck, path: '/admin?tab=verifikasi' },
        { label: 'Kelola Laporan', icon: FileSpreadsheet, path: '/track' },
        { label: 'Kelola Pengguna', icon: Users, path: '/admin?tab=pengguna' },
        { label: 'Petugas', icon: ShieldCheck, path: '/admin?tab=petugas' },
      ],
    },
    {
      title: 'Master Data',
      items: [
        { label: 'Kategori', icon: Building2, path: '/admin?tab=kategori' },
        { label: 'Wilayah', icon: MapPin, path: '/admin?tab=wilayah' },
      ],
    },
    {
      title: 'Analitik',
      items: [
        { label: 'Peta', icon: Map, path: '/map' },
        { label: 'Statistik', icon: BarChart3, path: '/stats' },
        { label: 'Laporan', icon: PieChart, path: '/admin?tab=laporan' },
        { label: 'Audit Log', icon: Activity, path: '/admin?tab=audit' },
      ],
    },
    {
      title: 'Lainnya',
      items: [
        { label: 'Notifikasi', icon: Bell, path: '/notifications', badge },
        { label: 'Profil', icon: User, path: '/profile' },
        { label: 'Pengaturan', icon: Settings, path: '/admin?tab=pengaturan' },
      ],
    },
  ];
}

export function getHeadSidebarSections(badge?: number): SidebarSection[] {
  return [
    {
      title: 'Menu Utama',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/kepala-dinas' },
        { label: 'Analitik', icon: TrendingUp, path: '/kepala-dinas?tab=analitik' },
        { label: 'Peta', icon: Map, path: '/map' },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        { label: 'KPI', icon: Award, path: '/kepala-dinas?tab=kpi' },
        { label: 'Laporan', icon: FileSpreadsheet, path: '/kepala-dinas?tab=laporan' },
        { label: 'Performa Petugas', icon: Users, path: '/kepala-dinas?tab=performa' },
      ],
    },
    {
      title: 'Export',
      items: [
        { label: 'Download Laporan', icon: Download, path: '/kepala-dinas?tab=export' },
      ],
    },
    {
      title: 'Lainnya',
      items: [
        { label: 'Notifikasi', icon: Bell, path: '/notifications', badge },
        { label: 'Profil', icon: User, path: '/profile' },
      ],
    },
  ];
}
