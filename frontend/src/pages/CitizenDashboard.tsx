import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import type { Complaint } from '../types';
import { StatusBadge, UrgencyBadge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { FilePlus, Building, Clock, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    complaintService.getComplaints().then((data) => {
      setComplaints(data);
    });
  }, []);

  const total = complaints.length;
  const selesai = complaints.filter((c) => c.status === 'selesai').length;
  const diproses = complaints.filter((c) => c.status === 'diproses').length;
  const menunggu = complaints.filter((c) => c.status === 'menunggu').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Dashboard Pengaduan Warga Kota Baubau</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Selamat Datang, {user?.name || 'Warga Baubau'}</h1>
          <p className="text-xs text-slate-300">
            Kelola dan pantau seluruh laporan infrastruktur yang telah Anda kumpulkan.
          </p>
        </div>

        <Link
          to="/submit"
          className="px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <FilePlus className="w-4 h-4 text-amber-300" />
          <span>Buat Laporan Baru</span>
        </Link>
      </div>

      {/* Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pengaduan Anda"
          value={total}
          icon={Building}
          colorBg="bg-slate-100"
          colorIcon="text-slate-800"
        />
        <StatCard
          title="Selesai Ditangani"
          value={selesai}
          icon={CheckCircle2}
          colorBg="bg-emerald-50"
          colorIcon="text-emerald-600"
        />
        <StatCard
          title="Sedang Diproses"
          value={diproses}
          icon={Clock}
          colorBg="bg-blue-50"
          colorIcon="text-blue-600"
        />
        <StatCard
          title="Verifikasi Menunggu"
          value={menunggu}
          icon={Clock}
          colorBg="bg-amber-50"
          colorIcon="text-amber-600"
        />
      </div>

      {/* Complaints Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">Daftar Pengaduan Infrastruktur Saya</h3>
          <span className="text-xs text-slate-500 font-semibold">{complaints.length} Laporan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Kode Tiket</th>
                <th className="p-4">Judul Pengaduan</th>
                <th className="p-4">Kecamatan</th>
                <th className="p-4">Tingkat Urgensi</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {complaints.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-800">{item.ticket_code}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{item.address}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{item.subdistrict}</td>
                  <td className="p-4"><UrgencyBadge urgency={item.urgency} /></td>
                  <td className="p-4"><StatusBadge status={item.status} size="sm" /></td>
                  <td className="p-4 text-slate-500">{item.created_at.split(' ')[0]}</td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/track?ticket=${item.ticket_code}`}
                      className="p-2 text-teal-700 hover:bg-teal-50 rounded-xl transition-colors inline-flex items-center space-x-1 font-bold"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Pantau</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
