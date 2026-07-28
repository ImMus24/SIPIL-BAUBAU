import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Bell } from 'lucide-react';

export function NotificationPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Notifikasi</h1>

        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <Bell className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">Belum ada notifikasi.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Notifikasi akan muncul ketika ada perkembangan pada laporan Anda.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NotificationPage;
