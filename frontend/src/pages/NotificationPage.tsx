import { useEffect, useState, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Skeleton } from '../components/dashboard/LoadingSkeleton';
import { ErrorState } from '../components/dashboard/ErrorState';
import { dashboardService } from '../services/dashboardService';
import { CheckCircle2, Bell, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AppNotification } from '../types';

export function NotificationPage() {
  const [data, setData] = useState<{ items: AppNotification[]; unread_count: number; pagination: { current_page: number; last_page: number; per_page: number; total: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getNotifications({ per_page: 50 });
      setData(res);
    } catch {
      setError('Gagal memuat notifikasi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await dashboardService.markAllNotificationsRead();
      fetchNotifications();
    } catch { /* ignore */ }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await dashboardService.markNotificationRead(id);
      fetchNotifications();
    } catch { /* ignore */ }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Breadcrumb items={[{ label: 'Notifikasi', href: '/notifications' }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-black text-foreground">Notifikasi</h1>
            <p className="text-sm text-muted-foreground">
              {data ? `${data.unread_count} belum dibaca dari ${data.pagination.total}` : 'Memuat...'}
            </p>
          </div>
          {data && data.unread_count > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <Skeleton className="h-4 w-3/5 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <ErrorState title="Gagal Memuat Notifikasi" message={error} onRetry={fetchNotifications} variant="fullscreen" />
        )}

        {!loading && !error && data && data.items.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">Belum Ada Notifikasi</h3>
            <p className="text-sm text-muted-foreground">
              Notifikasi akan muncul ketika ada perkembangan pada laporan Anda.
            </p>
          </div>
        )}

        {!loading && !error && data && data.items.length > 0 && (
          <div className="space-y-2">
            {data.items.map((n) => (
              <div
                key={n.id}
                className={`bg-card border border-border rounded-xl p-5 transition-colors hover:bg-muted/50 ${!n.is_read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <h4 className="font-semibold text-foreground text-sm truncate">{n.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Tandai dibaca"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {typeof (n.data as Record<string, unknown> | undefined)?.complaint_id === 'number' && (
                      <Link
                        to={`/complaints/${(n.data as Record<string, unknown>).complaint_id as number}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Lihat detail"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && data && data.pagination.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="text-sm text-muted-foreground">
              Halaman {data.pagination.current_page} dari {data.pagination.last_page}
            </span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default NotificationPage;
