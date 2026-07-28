import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services/complaintService';
import type { Complaint, ComplaintStatus, Agency, BaubauSubdistrict } from '../types';
import { StatusBadge, UrgencyBadge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Toast } from '../components/ui/Toast';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  FileSpreadsheet,
  Edit,
  Filter
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
  const [loading, setLoading] = useState(true);
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

  // Toast feedback state
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; title: string; message: string }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await complaintService.getComplaints();
      setComplaints(data);
      const agData = await complaintService.getAgencies();
      setAgencies(agData);
    } catch {
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Gagal Memuat Data',
        message: 'Tidak dapat menghubungkan ke server backend API.',
      });
    } finally {
      setLoading(false);
    }
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
      setToast({
        isOpen: true,
        type: 'success',
        title: 'Status Berhasil Diperbarui',
        message: `Laporan #${editingComplaint.ticket_code} telah diperbarui ke status ${newStatus.toUpperCase()}`,
      });
    } catch {
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Gagal Memperbarui Status',
        message: 'Periksa kembali kelengkapan data dan koneksi internet Anda.',
      });
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

    setToast({
      isOpen: true,
      type: 'success',
      title: 'Rekap Data Diexport',
      message: `${filtered.length} baris laporan pengaduan berhasil didownload dalam format CSV.`,
    });
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
      
      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

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
          disabled={loading || filtered.length === 0}
          className="px-5 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-300" />
          <span>Export Rekap Data (CSV)</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="TOTAL PENGADUAN"
            value={total}
            subtitle="Masuk dari 8 Kecamatan"
            icon={Building}
            colorBg="bg-sky-100 dark:bg-sky-950"
            colorIcon="text-sky-700 dark:text-sky-300"
          />
          <StatCard
            title="MENUNGGU VERIFIKASI"
            value={menunggu}
            subtitle="Memerlukan respon Admin"
            icon={Clock}
            colorBg="bg-amber-100 dark:bg-amber-950"
            colorIcon="text-amber-700 dark:text-amber-300"
          />
          <StatCard
            title="DIPROSES OPD"
            value={diproses}
            subtitle="Penanganan tim lapangan"
            icon={AlertTriangle}
            colorBg="bg-blue-100 dark:bg-blue-950"
            colorIcon="text-blue-700 dark:text-blue-300"
          />
          <StatCard
            title="SELESAI DITANGANI"
            value={selesai}
            subtitle="Tuntas dengan bukti foto"
            icon={CheckCircle2}
            colorBg="bg-emerald-100 dark:bg-emerald-950"
            colorIcon="text-emerald-700 dark:text-emerald-300"
          />
        </div>
      )}

      {/* Filter and Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Controls Header */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode tiket, judul, atau alamat lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-600 dark:focus:border-sky-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedSubdistrict}
                onChange={(e) => setSelectedSubdistrict(e.target.value as any)}
                className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">Semua Kecamatan</option>
                {SUBDISTRICTS.map((sub) => (
                  <option key={sub} value={sub}>
                    Kec. {sub}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu Verifikasi</option>
              <option value="diproses">Sedang Diproses</option>
              <option value="selesai">Selesai Ditangani</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <TableSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="Tidak ada data laporan ditemukan"
            description="Tidak ada laporan pengaduan yang sesuai dengan kata kunci pencarian atau filter pilihan Anda."
            actionText="Reset Filter"
            onAction={() => {
              setSearch('');
              setSelectedSubdistrict('all');
              setSelectedStatus('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Kode Tiket</th>
                  <th className="px-6 py-4">Judul & Lokasi</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Penanggung Jawab</th>
                  <th className="px-6 py-4 text-center">Urgensi</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-sky-800 dark:text-sky-400">{item.ticket_code}</td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.address} (Kec. {item.subdistrict})</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {item.category?.name || 'Infrastruktur'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {item.agency?.name || <span className="italic opacity-60">Belum Ditugaskan</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <UrgencyBadge urgency={item.urgency} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal Form Status Update */}
      {editingComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setEditingComplaint(null)}
          title={`Update Status Pengaduan #${editingComplaint.ticket_code}`}
        >
          <form onSubmit={handleSaveStatus} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Ubah Status Laporan
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              >
                <option value="menunggu">Menunggu Verifikasi</option>
                <option value="diproses">Sedang Diproses OPD</option>
                <option value="selesai">Selesai Ditangani</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Penugasan OPD Teknis
              </label>
              <select
                value={newAgencyId}
                onChange={(e) => setNewAgencyId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              >
                {agencies.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Catatan Petugas / Alasan Update
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan catatan progres pengerjaan di lapangan..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Upload Foto Bukti Pengerjaan (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoProof(e.target.files?.[0])}
                className="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-100 file:text-sky-800 dark:file:bg-slate-800 dark:file:text-sky-300"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingComplaint(null)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-extrabold shadow-md disabled:opacity-50"
              >
                {updating ? 'Menyimpan...' : 'Simpan Perubahan Status'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
