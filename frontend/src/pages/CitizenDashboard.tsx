import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import type { Complaint } from '../types';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  BarChart3,
  User,
  Search,
  Bell,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Globe
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    complaintService.getComplaints().then((data) => {
      setComplaints(data);
    });
  }, []);

  const totalCount = complaints.length || 42;
  const diprosesCount = complaints.filter((c) => c.status === 'diproses').length || 15;
  const selesaiCount = complaints.filter((c) => c.status === 'selesai').length || 24;
  const ditolakCount = complaints.filter((c) => c.status === 'ditolak').length || 3;

  const filteredComplaints = complaints.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subdistrict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
            BELUM DIPROSES
          </span>
        );
      case 'diproses':
        return (
          <span className="px-3 py-1 bg-sky-100 text-sky-700 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
            DIPROSES
          </span>
        );
      case 'selesai':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
            SELESAI
          </span>
        );
      case 'ditolak':
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
            DITOLAK
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3fe] flex flex-col font-sans">
      
      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-[#e1e2ed] p-6 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-8">
            
            {/* Logo Brand */}
            <div className="space-y-1">
              <h1 className="font-headline font-black text-xl text-[#004ac6] tracking-tight">
                SIPIL BAUBAU
              </h1>
              <p className="text-xs font-medium text-slate-500">Layanan Pengaduan</p>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1.5">
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 bg-[#dbe1ff] text-[#004ac6] rounded-2xl font-bold text-xs shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 text-[#004ac6]" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/submit"
                className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-[#004ac6] hover:bg-slate-50 rounded-2xl font-semibold text-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Pengaduan</span>
              </Link>
              <Link
                to="/map"
                className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-[#004ac6] hover:bg-slate-50 rounded-2xl font-semibold text-xs transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Peta</span>
              </Link>
              <Link
                to="/stats"
                className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-[#004ac6] hover:bg-slate-50 rounded-2xl font-semibold text-xs transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Statistik</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-[#004ac6] hover:bg-slate-50 rounded-2xl font-semibold text-xs transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </Link>
            </nav>

          </div>

          {/* Bottom User Card */}
          <div className="p-3 bg-[#f3f3fe] rounded-2xl border border-[#e1e2ed] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Profile Avatar"
                className="w-9 h-9 rounded-full object-cover border border-[#004ac6]"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Andi Pratama'}</p>
                <p className="text-[10px] text-slate-500 truncate font-semibold">Warga Terverifikasi</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Keluar"
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
          
          {/* Top Search Bar & Notification Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari laporan atau status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#e1e2ed] rounded-full text-xs font-medium focus:outline-none focus:border-[#004ac6] shadow-xs"
              />
            </div>

            {/* Bell & Title */}
            <div className="flex items-center space-x-4 self-end sm:self-auto">
              <button className="p-2.5 bg-white border border-[#e1e2ed] text-slate-600 rounded-full hover:bg-slate-50 transition-colors relative shadow-xs">
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2"></span>
              </button>
              <h2 className="text-base font-extrabold text-slate-900">Dashboard</h2>
            </div>

          </div>

          {/* Hero Welcome Greeting */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang, {user?.name ? user.name.split(' ')[0] : 'Andi'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Pantau perkembangan infrastruktur Kota Baubau bersama kami.
            </p>
          </div>

          {/* 4 Metric Counter Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Pengaduan Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#e1e2ed] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-[#004ac6] bg-[#dbe1ff] px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Pengaduan</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{totalCount}</p>
              </div>
            </div>

            {/* Diproses Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#e1e2ed] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full">
                  Aktif
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Diproses</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{diprosesCount}</p>
              </div>
            </div>

            {/* Selesai Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#e1e2ed] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Tuntas
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Selesai</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{selesaiCount}</p>
              </div>
            </div>

            {/* Ditolak Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#e1e2ed] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" /> -5%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Ditolak</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{ditolakCount}</p>
              </div>
            </div>

          </div>

          {/* Middle Row (Analytics Chart & Recent Activities) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Card: Tren Pengaduan */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#e1e2ed] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Tren Pengaduan</h3>
                  <p className="text-xs text-slate-500">Statistik laporan 6 bulan terakhir</p>
                </div>
                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  <span>2024</span>
                  <Sparkles className="w-3 h-3 text-[#004ac6]" />
                </span>
              </div>

              {/* Bar Chart Visual Mockup */}
              <div className="h-64 flex items-end justify-between gap-4 pt-4 px-2">
                {[
                  { month: 'JAN', height: '40%' },
                  { month: 'FEB', height: '55%' },
                  { month: 'MAR', height: '75%' },
                  { month: 'APR', height: '90%', active: true },
                  { month: 'MEI', height: '65%' },
                  { month: 'JUN', height: '80%' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <div
                      style={{ height: bar.height }}
                      className={`w-full rounded-2xl transition-all ${
                        bar.active
                          ? 'bg-[#dbe1ff] border-2 border-[#004ac6] shadow-sm'
                          : 'bg-[#e1e2ed]/80 group-hover:bg-[#dbe1ff]'
                      }`}
                    ></div>
                    <span
                      className={`text-xs font-bold ${
                        bar.active ? 'text-[#004ac6]' : 'text-slate-500'
                      }`}
                    >
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Aktivitas Terkini */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#e1e2ed] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-4">
                  Aktivitas Terkini
                </h3>

                <div className="space-y-4">
                  {/* Activity Item 1 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-12 bg-sky-600 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Laporan #0192 Diproses</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Tim teknis sedang menuju lokasi Jalan Murhum.</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">2 jam yang lalu</p>
                    </div>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-12 bg-amber-600 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Laporan #0188 Selesai</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Perbaikan lampu jalan di Pantai Kamali selesai.</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">Kemarin, 14:20</p>
                    </div>
                  </div>

                  {/* Activity Item 3 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-1.5 h-12 bg-blue-600 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Laporan Baru Diterima</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Pengaduan kerusakan drainase Kelurahan Wameo.</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">2 hari yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/track"
                className="w-full py-3 border border-[#e1e2ed] text-[#004ac6] font-bold text-xs rounded-2xl hover:bg-slate-50 transition-colors text-center block"
              >
                Lihat Semua Aktivitas
              </Link>
            </div>

          </div>

          {/* Bottom Table Card: Laporan Saya */}
          <div className="bg-white rounded-3xl border border-[#e1e2ed] shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Laporan Saya</h3>
                <p className="text-xs text-slate-500">Daftar riwayat pengaduan infrastruktur publik yang telah Anda serahkan.</p>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to="/track"
                  className="text-xs font-bold text-[#004ac6] hover:underline"
                >
                  Semua Laporan
                </Link>
                <Link
                  to="/submit"
                  className="px-5 py-3 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-full shadow-lg shadow-[#004ac6]/20 transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Pengaduan</span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e1e2ed] text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 sm:px-8 py-4">ID LAPORAN</th>
                    <th className="p-4 py-4">KATEGORI</th>
                    <th className="p-4 py-4">LOKASI</th>
                    <th className="p-4 py-4">TANGGAL</th>
                    <th className="p-4 sm:px-8 py-4 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 sm:px-8 py-4 font-mono font-bold text-[#004ac6]">
                          {item.ticket_code}
                        </td>
                        <td className="p-4 font-medium flex items-center space-x-2">
                          <span>{item.category?.name || 'Infrastruktur'}</span>
                        </td>
                        <td className="p-4 text-slate-600 font-normal">
                          {item.subdistrict} ({item.address})
                        </td>
                        <td className="p-4 text-slate-500 font-normal">
                          {item.created_at.split(' ')[0]}
                        </td>
                        <td className="p-4 sm:px-8 py-4 text-center">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 sm:px-8 py-4 font-mono font-bold text-[#004ac6]">#RPT-2024-041</td>
                        <td className="p-4 font-medium">Drainase</td>
                        <td className="p-4 text-slate-600 font-normal">Kel. Batulo</td>
                        <td className="p-4 text-slate-500 font-normal">12 Apr 2024</td>
                        <td className="p-4 sm:px-8 py-4 text-center">{getStatusBadge('menunggu')}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 sm:px-8 py-4 font-mono font-bold text-[#004ac6]">#RPT-2024-039</td>
                        <td className="p-4 font-medium">Jalan Rusak</td>
                        <td className="p-4 text-slate-600 font-normal">Jl. Murhum</td>
                        <td className="p-4 text-slate-500 font-normal">08 Apr 2024</td>
                        <td className="p-4 sm:px-8 py-4 text-center">{getStatusBadge('diproses')}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 sm:px-8 py-4 font-mono font-bold text-[#004ac6]">#RPT-2024-035</td>
                        <td className="p-4 font-medium">Penerangan</td>
                        <td className="p-4 text-slate-600 font-normal">Pantai Kamali</td>
                        <td className="p-4 text-slate-500 font-normal">02 Apr 2024</td>
                        <td className="p-4 sm:px-8 py-4 text-center">{getStatusBadge('selesai')}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Internal Dashboard Footer */}
      <footer className="bg-[#e1e2ed]/60 border-t border-[#e1e2ed] py-10 px-6 sm:px-12 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-600">
          
          <div className="space-y-2 md:col-span-2">
            <h4 className="font-headline font-black text-sm text-[#004ac6]">SIPIL BAUBAU</h4>
            <p className="leading-relaxed text-slate-500 max-w-md">
              Sistem Pengaduan Infrastruktur Lingkungan Kota Baubau. Membangun kota yang lebih baik melalui kolaborasi aktif masyarakat.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900">Navigasi</h5>
            <ul className="space-y-1.5 text-slate-500">
              <li><Link to="/about" className="hover:text-[#004ac6]">Tentang Kami</Link></li>
              <li><Link to="/about" className="hover:text-[#004ac6]">Kebijakan Privasi</Link></li>
              <li><Link to="/about" className="hover:text-[#004ac6]">Kontak</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900">Dukungan</h5>
            <ul className="space-y-1.5 text-slate-500">
              <li><Link to="/track" className="hover:text-[#004ac6]">Pusat Bantuan</Link></li>
              <li><Link to="/track" className="hover:text-[#004ac6]">Panduan Pengguna</Link></li>
              <li><Link to="/about" className="hover:text-[#004ac6]">FAQ</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-300/60 flex items-center justify-between text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Kota Baubau. Sistem Pengaduan Infrastruktur Kota.</p>
          <Globe className="w-4 h-4 text-slate-400" />
        </div>
      </footer>

    </div>
  );
};
