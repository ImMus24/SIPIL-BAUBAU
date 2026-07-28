import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export function OfficerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Dashboard Petugas</h1>
        <p className="text-sm text-muted-foreground mb-8">Selamat datang, {user?.name}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Tugas Baru</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Sedang Diproses</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground mt-1">Selesai</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Halaman ini akan menampilkan daftar tugas yang ditugaskan kepada Anda ketika backend telah terintegrasi sepenuhnya.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default OfficerDashboard;
