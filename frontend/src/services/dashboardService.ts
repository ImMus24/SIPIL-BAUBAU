import api from './api';
import type {
  DashboardData,
  MapPoint,
  AppNotification,
  ActivityItem,
  CitizenDashboardData,
  AdminDashboardData,
  OfficerDashboardData,
  HeadOfAgencyDashboardData,
} from '../types';

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get('/dashboard');
    return response.data.data;
  },

  async getCitizenDashboard(): Promise<CitizenDashboardData> {
    const response = await api.get('/dashboard/citizen');
    return response.data.data;
  },

  async getOfficerDashboard(): Promise<OfficerDashboardData> {
    const response = await api.get('/dashboard/officer');
    return response.data.data;
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response = await api.get('/dashboard/admin');
    return response.data.data;
  },

  async getHeadDashboard(): Promise<HeadOfAgencyDashboardData> {
    const response = await api.get('/dashboard/head');
    return response.data.data;
  },

  async getMapData(): Promise<MapPoint[]> {
    const response = await api.get('/dashboard/map-data');
    return response.data.data;
  },

  async quickSearch(q: string): Promise<unknown[]> {
    const response = await api.get('/dashboard/search', { params: { q } });
    return response.data.data;
  },

  async getActivities(): Promise<ActivityItem[]> {
    const response = await api.get('/dashboard/activities');
    return response.data.data;
  },

  // Notifications
  async getNotifications(params?: { type?: string; unread_only?: boolean; per_page?: number }): Promise<{
    items: AppNotification[];
    unread_count: number;
    pagination: { current_page: number; last_page: number; per_page: number; total: number };
  }> {
    const response = await api.get('/notifications', { params });
    return response.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  },

  async markNotificationRead(id: number): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await api.post('/notifications/mark-all-read');
  },
};
