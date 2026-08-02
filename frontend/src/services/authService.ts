import api from './api';
import type { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && (response.data.success === true || response.data.status === 'success') && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('sipil_auth_token', token);
        localStorage.setItem('sipil_user', JSON.stringify(user));
        return { user, token };
      }
      throw new Error('Email atau kata sandi salah.');
    } catch (error: any) {
      localStorage.removeItem('sipil_auth_token');
      localStorage.removeItem('sipil_user');
      
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        'Email atau kata sandi salah.';
      throw new Error(message);
    }
  },

  async register(name: string, email: string, password: string, phone?: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      
      if (response.data && (response.data.success === true || response.data.status === 'success') && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('sipil_auth_token', token);
        localStorage.setItem('sipil_user', JSON.stringify(user));
        return { user, token };
      }
      throw new Error('Gagal mendaftarkan akun.');
    } catch (error: any) {
      localStorage.removeItem('sipil_auth_token');
      localStorage.removeItem('sipil_user');
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network failures on logout
    } finally {
      localStorage.removeItem('sipil_auth_token');
      localStorage.removeItem('sipil_user');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, email: string, password: string, passwordConfirmation: string): Promise<void> {
    await api.post('/auth/reset-password', { token, email, password, password_confirmation: passwordConfirmation });
  },

  async fetchCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('sipil_auth_token');
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      if (response.data && (response.data.success === true || response.data.status === 'success') && response.data.data) {
        const user = response.data.data;
        localStorage.setItem('sipil_user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch {
      localStorage.removeItem('sipil_auth_token');
      localStorage.removeItem('sipil_user');
      return null;
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
