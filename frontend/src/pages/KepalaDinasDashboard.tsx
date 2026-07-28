import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export function KepalaDinasDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Dashboard Monitoring</h1>
        <p className="text-sm text-muted-foreground mb-8">Selamat datang, {user?.name}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Laporan', value: '0' },
            { label: 'Diproses', value: '0' },
            { label: 'Selesai', value: '0' },
            { label: 'Tingkat Penyelesaian', value: '0%' },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Halaman ini akan menampilkan grafik performa dan laporan bulanan ketika backend telah terintegrasi sepenuhnya.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default KepalaDinasDashboard;
