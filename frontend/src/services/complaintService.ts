import { api } from './api';
import type { Complaint, ComplaintFilter, StatSummary, Category, Agency } from '../types';
import { MOCK_COMPLAINTS, MOCK_CATEGORIES, MOCK_AGENCIES } from './mockData';

let localComplaints = [...MOCK_COMPLAINTS];

export const complaintService = {
  async getComplaints(filter?: ComplaintFilter): Promise<Complaint[]> {
    try {
      const response = await api.get('/complaints', { params: filter });
      return response.data.data;
    } catch {
      let filtered = [...localComplaints];
      if (filter) {
        if (filter.status && filter.status !== 'all') {
          filtered = filtered.filter((c) => c.status === filter.status);
        }
        if (filter.category_id && filter.category_id !== 'all') {
          filtered = filtered.filter((c) => c.category_id === Number(filter.category_id));
        }
        if (filter.subdistrict && filter.subdistrict !== 'all') {
          filtered = filtered.filter((c) => c.subdistrict === filter.subdistrict);
        }
        if (filter.urgency && filter.urgency !== 'all') {
          filtered = filtered.filter((c) => c.urgency === filter.urgency);
        }
        if (filter.search) {
          const q = filter.search.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.title.toLowerCase().includes(q) ||
              c.ticket_code.toLowerCase().includes(q) ||
              c.address.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q)
          );
        }
      }
      return filtered;
    }
  },

  async getComplaintByTicket(ticketCode: string): Promise<Complaint | null> {
    try {
      const response = await api.get(`/complaints/ticket/${ticketCode}`);
      return response.data.data;
    } catch {
      const found = localComplaints.find((c) => c.ticket_code.toUpperCase() === ticketCode.toUpperCase());
      return found || null;
    }
  },

  async createComplaint(payload: Partial<Complaint> & { photos?: File[] }): Promise<Complaint> {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        if (key !== 'photos' && val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });
      if (payload.photos) {
        payload.photos.forEach((file) => formData.append('attachments[]', file));
      }

      const response = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch {
      const newTicketCode = `SIPIL-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const category = MOCK_CATEGORIES.find((c) => c.id === Number(payload.category_id)) || MOCK_CATEGORIES[0];

      const newComplaint: Complaint = {
        id: localComplaints.length + 1,
        ticket_code: newTicketCode,
        title: payload.title || 'Laporan Pengaduan Baru',
        description: payload.description || '',
        category_id: Number(payload.category_id) || 1,
        category,
        reporter_name: payload.reporter_name || 'Masyarakat Baubau',
        reporter_phone: payload.reporter_phone || '',
        reporter_email: payload.reporter_email,
        address: payload.address || 'Kota Baubau',
        subdistrict: payload.subdistrict || 'Wolio',
        latitude: payload.latitude || -5.4642,
        longitude: payload.longitude || 122.6035,
        urgency: payload.urgency || 'sedang',
        status: 'menunggu',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        attachments: payload.photos ? payload.photos.map((p, idx) => ({
          id: Date.now() + idx,
          complaint_id: localComplaints.length + 1,
          file_path: URL.createObjectURL(p),
          file_type: p.type
        })) : [],
        status_logs: [
          {
            id: Date.now(),
            complaint_id: localComplaints.length + 1,
            status: 'menunggu',
            notes: 'Laporan berhasil terdaftar dalam sistem.',
            updated_by: 'Sistem',
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        ]
      };

      localComplaints.unshift(newComplaint);
      return newComplaint;
    }
  },

  async updateComplaintStatus(
    id: number,
    status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak',
    notes: string,
    agency_id?: number,
    photo_proof?: File
  ): Promise<Complaint> {
    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('notes', notes);
      if (agency_id) formData.append('agency_id', String(agency_id));
      if (photo_proof) formData.append('photo_proof', photo_proof);

      const response = await api.post(`/complaints/${id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch {
      const target = localComplaints.find((c) => c.id === id);
      if (!target) throw new Error('Laporan tidak ditemukan');

      target.status = status;
      if (agency_id) {
        target.agency_id = agency_id;
        target.agency = MOCK_AGENCIES.find((a) => a.id === agency_id) || null;
      }
      if (status === 'selesai') {
        target.completed_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      }

      const newLog = {
        id: Date.now(),
        complaint_id: target.id,
        status,
        notes,
        updated_by: 'Petugas OPD / Admin',
        photo_proof: photo_proof ? URL.createObjectURL(photo_proof) : null,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      target.status_logs = target.status_logs || [];
      target.status_logs.push(newLog);
      target.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

      return { ...target };
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/categories');
      return response.data.data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  async getAgencies(): Promise<Agency[]> {
    try {
      const response = await api.get('/agencies');
      return response.data.data;
    } catch {
      return MOCK_AGENCIES;
    }
  },

  async getStatsSummary(): Promise<StatSummary> {
    try {
      const response = await api.get('/stats/summary');
      return response.data.data;
    } catch {
      return {
        total: localComplaints.length,
        menunggu: localComplaints.filter(c => c.status === 'menunggu').length,
        diproses: localComplaints.filter(c => c.status === 'diproses').length,
        selesai: localComplaints.filter(c => c.status === 'selesai').length,
        ditolak: localComplaints.filter(c => c.status === 'ditolak').length,
        completion_rate: Math.round((localComplaints.filter(c => c.status === 'selesai').length / localComplaints.length) * 100)
      };
    }
  }
};
