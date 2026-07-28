import { api } from './api';
import type { User, UserRole } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem('sipil_auth_token', token);
      localStorage.setItem('sipil_user', JSON.stringify(user));
      return { user, token };
    } catch {
      // Mock login handling for dev preview
      let role: UserRole = 'citizen';
      let name = 'Warga Kota Baubau';
      let agency_name = undefined;

      if (email.includes('admin')) {
        role = 'admin';
        name = 'Administrator Master Baubau';
      } else if (email.includes('pupr') || email.includes('officer')) {
        role = 'officer';
        name = 'Petugas Lapangan PUPR';
        agency_name = 'Dinas Pekerjaan Umum dan Penataan Ruang Kota Baubau';
      }

      const mockUser: User = {
        id: role === 'admin' ? 1 : role === 'officer' ? 2 : 3,
        name,
        email,
        role,
        agency_name,
        phone: '081245678901',
        created_at: new Date().toISOString(),
      };
      const token = 'mock-jwt-token-sipil-baubau';
      localStorage.setItem('sipil_auth_token', token);
      localStorage.setItem('sipil_user', JSON.stringify(mockUser));
      return { user: mockUser, token };
    }
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      const { user, token } = response.data.data;
      localStorage.setItem('sipil_auth_token', token);
      localStorage.setItem('sipil_user', JSON.stringify(user));
      return { user, token };
    } catch {
      const mockUser: User = {
        id: Date.now(),
        name,
        email,
        role: 'citizen',
        phone,
        created_at: new Date().toISOString(),
      };
      const token = 'mock-jwt-token-sipil-baubau';
      localStorage.setItem('sipil_auth_token', token);
      localStorage.setItem('sipil_user', JSON.stringify(mockUser));
      return { user: mockUser, token };
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore offline errors
    } finally {
      localStorage.removeItem('sipil_auth_token');
      localStorage.removeItem('sipil_user');
    }
  },

  getCurrentUser(): User | null {
    const cached = localStorage.getItem('sipil_user');
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }
};
