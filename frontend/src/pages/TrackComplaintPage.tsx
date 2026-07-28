import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import type { Complaint } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { BaubauMap } from '../components/map/BaubauMap';
import { Search, AlertTriangle } from 'lucide-react';

export const TrackComplaintPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ticketFromUrl = searchParams.get('ticket') || '';

  const [ticketInput, setTicketInput] = useState(ticketFromUrl);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTicket = async (code: string) => {
    if (!code) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await complaintService.getComplaintByTicket(code);
      setComplaint(res);
    } catch {
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketFromUrl) {
      setTicketInput(ticketFromUrl);
      fetchTicket(ticketFromUrl);
    }
  }, [ticketFromUrl]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTicket(ticketInput.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-sky-950/80 text-teal-800 dark:text-sky-300 border border-teal-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider">
          <Search className="w-4 h-4 text-teal-600 dark:text-sky-400" />
          <span>Monitoring Transparan Kota Baubau</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Cek Status & Progress Laporan</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Masukkan Kode Tiket Pengaduan (contoh: <span className="font-mono font-bold text-teal-700 dark:text-sky-400">SIPIL-2026-8A91</span>) untuk memantau pengerjaan oleh Dinas terkait.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
        <input
          type="text"
          required
          placeholder="Masukkan Kode Tiket (SIPIL-2026-XXXX)"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          className="flex-1 px-4 py-3 text-sm font-mono font-bold text-slate-800 dark:text-white bg-transparent focus:outline-none uppercase"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center space-x-2"
        >
          {loading ? <span>Mencari...</span> : <><Search className="w-4 h-4" /><span>Lacak Status</span></>}
        </button>
      </form>

      {/* Results View */}
      {searched && (
        <>
          {!complaint ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Kode Tiket Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Pastikan Anda memasukkan kode tiket dengan benar. Silakan periksa kembali tanda terima pengaduan Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Status Header Card */}
              <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      {complaint.ticket_code}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">{complaint.title}</h2>
                  </div>
                  <StatusBadge status={complaint.status} size="lg" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Kecamatan & Alamat</p>
                    <p className="font-bold text-white mt-0.5">{complaint.subdistrict}</p>
                    <p className="text-slate-400 truncate">{complaint.address}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-slate-400">OPD Penanggung Jawab</p>
                    <p className="font-bold text-teal-300 dark:text-sky-300 mt-0.5">{complaint.agency?.name || 'Dinas PUPR / PERKIM Kota Baubau'}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Tanggal Pengaduan</p>
                    <p className="font-bold text-white mt-0.5">{complaint.created_at}</p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b dark:border-slate-800 pb-3">
                  Riwayat Progres & Timeline Penanganan
                </h3>

                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-8 my-4">
                  {complaint.status_logs && complaint.status_logs.map((log) => (
                    <div key={log.id} className="relative group">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-teal-600 dark:bg-sky-500 border-2 border-white dark:border-slate-900 ring-4 ring-teal-50 dark:ring-sky-950"></div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">{log.status}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.created_at}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                          {log.notes}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold">Oleh: {log.updated_by}</p>
                        
                        {log.photo_proof && (
                          <div className="mt-2">
                            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mb-1">Bukti Foto Penanganan Selesai:</p>
                            <img
                              src={log.photo_proof}
                              alt="Bukti Selesai"
                              className="w-48 h-32 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map GIS Location Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Lokasi Titik Laporan di Peta Baubau</h4>
                <BaubauMap
                  complaints={[complaint]}
                  height="300px"
                />
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
};
