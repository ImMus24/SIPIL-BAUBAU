import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type {
  Complaint,
  ComplaintDetail,
  ComplaintFilter,
  ComplaintFileCategory,
  ComplaintComment,
  ComplaintFile,
  Category,
  Agency,
  StatSummary,
} from '../types';

// Query keys
export const complaintKeys = {
  all: ['complaints'] as const,
  list: (filters?: ComplaintFilter) => ['complaints', 'list', filters] as const,
  detail: (ticketCode: string) => ['complaints', ticketCode] as const,
  detailById: (id: number) => ['complaints', 'detail', id] as const,
  myReports: (userId?: number) => ['complaints', 'my-reports', userId] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
};

export const agencyKeys = {
  all: ['agencies'] as const,
};

export const statKeys = {
  summary: ['stats', 'summary'] as const,
};

// --- Categories ---
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data as Category[];
    },
    staleTime: 60 * 60 * 1000, // 1 hour — cached on backend too
  });
}

// --- Agencies ---
export function useAgencies() {
  return useQuery({
    queryKey: agencyKeys.all,
    queryFn: async () => {
      const res = await api.get('/agencies');
      return res.data.data as Agency[];
    },
    staleTime: 60 * 60 * 1000,
  });
}

// --- Complaints ---
export function useComplaints(filters?: ComplaintFilter) {
  return useQuery({
    queryKey: complaintKeys.list(filters),
    queryFn: async () => {
      const res = await api.get('/complaints', { params: filters });
      return res.data.data as Complaint[];
    },
  });
}

export function useComplaintByTicket(ticketCode: string | null) {
  return useQuery({
    queryKey: complaintKeys.detail(ticketCode ?? ''),
    queryFn: async () => {
      const res = await api.get(`/complaints/ticket/${ticketCode}`);
      return res.data.data as Complaint;
    },
    enabled: !!ticketCode,
    retry: false,
  });
}

/** Central detail query for /complaints/{id} */
export function useComplaintDetail(id: number | null) {
  return useQuery({
    queryKey: complaintKeys.detailById(id ?? 0),
    queryFn: async () => {
      const res = await api.get(`/complaints/${id}`);
      return res.data.data as ComplaintDetail;
    },
    enabled: !!id,
    retry: false,
    staleTime: 30 * 1000,
  });
}

export function useAddComplaintComment(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      const res = await api.post(`/complaints/${id}/comments`, { body });
      return res.data.data as ComplaintComment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.detailById(id) });
    },
  });
}

export function useUploadComplaintFile(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, category }: { file: File; category: ComplaintFileCategory }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      const res = await api.post(`/complaints/${id}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data as ComplaintFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.detailById(id) });
    },
  });
}

export function useMyReports(userId?: number) {
  return useQuery({
    queryKey: complaintKeys.myReports(userId),
    queryFn: async () => {
      const res = await api.get('/complaints/my-reports');
      return res.data.data as Complaint[];
    },
    enabled: !!userId,
  });
}

// --- Stats ---
export function useStatsSummary() {
  return useQuery({
    queryKey: statKeys.summary,
    queryFn: async () => {
      const res = await api.get('/stats/summary');
      return res.data.data as StatSummary;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// --- Mutations ---
export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data as Complaint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all });
    },
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
      agency_id,
      photo_proof,
    }: {
      id: number;
      status: string;
      notes: string;
      agency_id?: number;
      photo_proof?: File;
    }) => {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('notes', notes);
      if (agency_id) formData.append('agency_id', String(agency_id));
      if (photo_proof) formData.append('photo_proof', photo_proof);

      const res = await api.post(`/complaints/${id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data as Complaint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all });
    },
  });
}
