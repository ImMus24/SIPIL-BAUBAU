import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import type { Complaint, ComplaintStatus, Agency, BaubauSubdistrict } from '../types';
import { StatusBadge, UrgencyBadge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  FileSpreadsheet,
  Edit
} from 'lucide-react';

const SUBDISTRICTS: BaubauSubdistrict[] = [
  'Wolio',
  'Betoambari',
  'Murhum',
  'Kokalukuna',
  'Lea-Lea',
  'Sorawolio',
  'Bungi',
  'Batupoaro',
];

export const AdminDashboard: React.FC = () => {
  const { role } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<BaubauSubdistrict | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');

  // Modal State for Status Update
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('diproses');
  const [newAgencyId, setNewAgencyId] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [photoProof, setPhotoProof] = useState<File | undefined>(undefined);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    const data = await complaintService.getComplaints();
    setComplaints(data);
    const agData = await complaintService.getAgencies();
    setAgencies(agData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (item: Complaint) => {
    setEditingComplaint(item);
    setNewStatus(item.status);
    setNewAgencyId(item.agency_id || 1);
    setNotes('');
    setPhotoProof(undefined);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComplaint) return;
    setUpdating(true);
    try {
      await complaintService.updateComplaintStatus(
        editingComplaint.id,
        newStatus,
        notes || `Status diperbarui menjadi ${newStatus}`,
        newAgencyId,
        photoProof
      );
      await loadData();
      setEditingComplaint(null);
    } catch {
      alert('Gagal memperbarui status pengaduan.');
    } finally {
      setUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Kode Tiket', 'Judul', 'Kategori', 'Kecamatan', 'Alamat', 'Urgensi', 'Status', 'Tanggal'];
    const rows = filtered.map((c) => [
      c.ticket_code,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category?.name || '',
      c.subdistrict,
      `"${c.address.replace(/"/g, '""')}"`,
      c.urgency,
      c.status,
      c.created_at,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIPIL_BAUBAU_Pengaduan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = complaints.filter((c) => {
    if (selectedSubdistrict !== 'all' && c.subdistrict !== selectedSubdistrict) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.ticket_code.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total = complaints.length;
  const menunggu = complaints.filter((c) => c.status === 'menunggu').length;
  const diproses = complaints.filter((c) => c.status === 'diproses').length;
  const selesai = complaints.filter((c) => c.status === 'selesai').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Admin */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Master Admin & OPD Penanganan Infrastruktur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {role === 'admin' ? 'Dashboard Administrator Utama' : 'Dashboard Petugas OPD Lapangan'}
          </h1>
          <p className="text-xs text-slate-300">
            Pemerintah Kota Baubau • Penugasan Dinas, Verifikasi Laporan & Update Bukti Selesai
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-5 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-300" />
          <span>Export Rekap Data (CSV)</span>
        </button>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Masuk"
          value={total}
          icon={Building}
          colorBg="bg-slate-100 dark:bg-slate-800"
          colorIcon="text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Butuh Verifikasi"
          value={menunggu}
          icon={AlertTriangle}
          colorBg="bg-amber-50 dark:bg-amber-950/80"
          colorIcon="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Sedang Diproses OPD"
          value={diproses}
          icon={Clock}
          colorBg="bg-blue-50 dark:bg-blue-950/80"
          colorIcon="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Selesai Ditangani"
          value={selesai}
          icon={CheckCircle2}
          colorBg="bg-emerald-50 dark:bg-emerald-950/80"
          colorIcon="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Data Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4">
        
        {/* Table Filters Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari Kode Tiket, Judul, Alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          <div>
            <select
              value={selectedSubdistrict}
              onChange={(e) => setSelectedSubdistrict(e.target.value as BaubauSubdistrict | 'all')}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
            >
              <option value="all">Semua Kecamatan Baubau</option>
              {SUBDISTRICTS.map((sub) => (
                <option key={sub} value={sub}>Kecamatan {sub}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus | 'all')}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
            >
              <option value="all">Semua Status Penanganan</option>
              <option value="menunggu">Menunggu Verifikasi</option>
              <option value="diproses">Sedang Diproses OPD</option>
              <option value="selesai">Selesai Ditangani</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Kode Tiket</th>
                <th className="p-4">Judul & Alamat</th>
                <th className="p-4">Pelapor</th>
                <th className="p-4">Wilayah</th>
                <th className="p-4">OPD Penanggung Jawab</th>
                <th className="p-4">Urgensi</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Kelola Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-800 dark:text-sky-400">{item.ticket_code}</td>
                  <td className="p-4 max-w-xs">
                    <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{item.address}</p>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">{item.reporter_name}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{item.subdistrict}</td>
                  <td className="p-4 text-teal-800 dark:text-sky-400 font-bold">
                    {item.agency?.code || 'PUPR'}
                  </td>
                  <td className="p-4"><UrgencyBadge urgency={item.urgency} /></td>
                  <td className="p-4"><StatusBadge status={item.status} size="sm" /></td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                    >
                      <Edit className="w-3.5 h-3.5 text-teal-400 dark:text-amber-300" />
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Edit Status Modal Dialog */}
      {editingComplaint && (
        <Modal
          isOpen={!!editingComplaint}
          onClose={() => setEditingComplaint(null)}
          title={`Update Status Penanganan: ${editingComplaint.ticket_code}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
            <div>
              <p className="font-bold text-slate-800 dark:text-white text-sm">{editingComplaint.title}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Lokasi: {editingComplaint.address} ({editingComplaint.subdistrict})</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Status Penanganan Baru *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                >
                  <option value="menunggu">Menunggu Verifikasi</option>
                  <option value="diproses">Sedang Diproses Lapangan</option>
                  <option value="selesai">Selesai Ditangani</option>
                  <option value="ditolak">Tolak Laporan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Tugaskan OPD Penanggung Jawab *</label>
                <select
                  value={newAgencyId}
                  onChange={(e) => setNewAgencyId(Number(e.target.value))}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                >
                  {agencies.map((ag) => (
                    <option key={ag.id} value={ag.id}>{ag.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Catatan Teknisi / Alasan Verifikasi *</label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan catatan teknisi, progres pengerjaan di lapangan, atau alasan jika ditolak..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              ></textarea>
            </div>

            {newStatus === 'selesai' && (
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Foto Bukti Penanganan Selesai (Opsional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoProof(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-slate-700 dark:text-slate-300"
                />
              </div>
            )}

            <div className="pt-3 border-t dark:border-slate-700 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingComplaint(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold rounded-xl shadow-md"
              >
                {updating ? 'Menyimpan...' : 'Simpan Status Penanganan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
