import React, { useEffect, useState } from 'react';
import { BaubauMap } from '../components/map/BaubauMap';
import { complaintService } from '../services/complaintService';
import type { Complaint, BaubauSubdistrict, ComplaintStatus, Category } from '../types';
import { StatusBadge, UrgencyBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const MapPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<BaubauSubdistrict | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    complaintService.getComplaints().then(setComplaints);
    complaintService.getCategories().then(setCategories);
  }, []);

  const filteredComplaints = complaints.filter((item) => {
    if (selectedSubdistrict !== 'all' && item.subdistrict !== selectedSubdistrict) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>GIS Pemetaan Interaktif Kota Baubau</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Peta Sebaran Laporan Infrastruktur</h1>
          <p className="text-xs text-slate-500">
            Menampilkan lokasi titik pengaduan masyarakat di 8 Kecamatan se-Kota Baubau
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200">
            Total Titik: {filteredComplaints.length} Laporan
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Filter Kecamatan</label>
          <select
            value={selectedSubdistrict}
            onChange={(e) => setSelectedSubdistrict(e.target.value as BaubauSubdistrict | 'all')}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Semua Kecamatan (8 Wilayah)</option>
            {SUBDISTRICTS.map((sub) => (
              <option key={sub} value={sub}>Kecamatan {sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Filter Status Penanganan</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus | 'all')}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Semua Status Penanganan</option>
            <option value="menunggu">Menunggu Verifikasi</option>
            <option value="diproses">Sedang Diproses</option>
            <option value="selesai">Selesai Ditangani</option>
            <option value="ditolak">Laporan Ditolak</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Filter Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Semua Kategori Infrastruktur</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Display */}
      <BaubauMap
        complaints={filteredComplaints}
        height="620px"
        selectedSubdistrict={selectedSubdistrict}
        onSelectComplaint={(c) => setSelectedComplaint(c)}
      />

      {/* Complaint Detail Popup Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Detail Laporan: ${selectedComplaint.ticket_code}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <StatusBadge status={selectedComplaint.status} size="lg" />
              <UrgencyBadge urgency={selectedComplaint.urgency} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedComplaint.title}</h3>
              <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                Kecamatan {selectedComplaint.subdistrict} • {selectedComplaint.address}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-slate-700 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
              <div>
                <p className="font-bold text-slate-800 mb-2">Foto Bukti Kerusakan:</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedComplaint.attachments.map((att) => (
                    <img
                      key={att.id}
                      src={att.file_path}
                      alt="Foto bukti"
                      className="rounded-xl border border-slate-200 w-full h-32 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t flex items-center justify-between">
              <span className="text-slate-400">Dilaporkan: {selectedComplaint.created_at}</span>
              <Link
                to={`/track?ticket=${selectedComplaint.ticket_code}`}
                className="px-4 py-2 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-colors inline-flex items-center space-x-1"
              >
                <span>Lacak Timeline Laporan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
