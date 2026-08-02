import api from './api';
import type {
  Complaint, ComplaintDetail, ComplaintFilter, StatSummary, Category, Agency,
  ComplaintComment, ComplaintFile, ComplaintFileCategory,
} from '../types';

/**
 * Real API service for complaints.
 * No mock data fallback. Every function hits the real backend.
 */
export const complaintService = {
  async getComplaints(filter?: ComplaintFilter): Promise<Complaint[]> {
    const response = await api.get('/complaints', { params: filter });
    return response.data.data;
  },

  async getComplaintByTicket(ticketCode: string): Promise<Complaint | null> {
    const response = await api.get(`/complaints/ticket/${ticketCode}`);
    return response.data.data;
  },

  /** Central detail endpoint — rich payload with comments, activity, files, related. */
  async getComplaintById(id: number): Promise<ComplaintDetail> {
    const response = await api.get(`/complaints/${id}`);
    return response.data.data;
  },

  async addComment(id: number, body: string): Promise<ComplaintComment> {
    const response = await api.post(`/complaints/${id}/comments`, { body });
    return response.data.data;
  },

  async uploadComplaintFile(
    id: number,
    file: File,
    category: ComplaintFileCategory = 'support',
  ): Promise<ComplaintFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    const response = await api.post(`/complaints/${id}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async createComplaint(payload: Record<string, unknown> & { photos?: File[] }): Promise<Complaint> {
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
  },

  async updateComplaintStatus(
    id: number,
    status: string,
    notes: string,
    agency_id?: number,
    photo_proof?: File,
    photos?: Record<string, File>, // { before: File, during: File, after: File }
  ): Promise<Complaint> {
    const formData = new FormData();
    formData.append('status', status);
    formData.append('notes', notes);
    if (agency_id) formData.append('agency_id', String(agency_id));
    if (photo_proof) formData.append('photo_proof', photo_proof);
    if (photos) {
      Object.entries(photos).forEach(([key, file]) => {
        formData.append(`photos[${key}]`, file);
      });
    }

    const response = await api.post(`/complaints/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.data;
  },

  async getAgencies(): Promise<Agency[]> {
    const response = await api.get('/agencies');
    return response.data.data;
  },

  async getStatsSummary(): Promise<StatSummary> {
    const response = await api.get('/stats/summary');
    return response.data.data;
  },
};
