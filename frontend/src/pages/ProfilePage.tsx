import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { ROLE_LABELS } from '../config/constants';
import { formatDate } from '../lib/utils';
import { User, Mail, Phone, Calendar, ShieldCheck, BadgeCheck, MapPin, Building2 } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <User className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
            <p className="text-muted-foreground">Silakan login untuk melihat profil.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const roleColors: Record<string, string> = {
    citizen: 'bg-primary-light text-primary border-primary/20 dark:bg-primary/10',
    officer: 'bg-info-bg text-info border-info-border',
    admin: 'bg-warning-bg text-warning border-warning-border',
    head_of_agency: 'bg-danger-bg text-danger border-danger-border',
  };

  const details = [
    { label: 'Nama Lengkap', value: user.name, icon: User },
    { label: 'Email', value: user.email, icon: Mail },
    { label: 'Role', value: ROLE_LABELS[user.role] ?? user.role, icon: ShieldCheck },
    { label: 'Telepon', value: user.phone || '-', icon: Phone },
    { label: 'Terdaftar Sejak', value: formatDate(user.created_at), icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-navy p-8 text-white shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-golden/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-heading font-black text-3xl ring-1 ring-white/30 shadow-lg">
                {user.name[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-golden flex items-center justify-center shadow-md">
                <BadgeCheck className="w-5 h-5 text-golden-foreground" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-2xl font-black tracking-tight truncate">{user.name}</h1>
              <p className="text-white/70 text-sm mt-0.5 truncate">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleColors[user.role] ?? 'bg-white/10 text-white border-white/20'}`}>
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
                {user.agency_name && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                    <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {user.agency_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <Card variant="bordered">
          <Card.Header>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" aria-hidden="true" />
              <h2 className="font-heading text-lg font-bold text-foreground">Data Profil</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="divide-y divide-border rounded-2xl overflow-hidden border border-border">
              {details.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center justify-between gap-4 px-5 py-4 bg-card hover:bg-muted/40 transition-colors">
                    <span className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {f.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground text-right truncate">{f.value}</span>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* Info banner */}
        <div className="p-4 rounded-2xl bg-info-bg border border-info-border flex items-start gap-3">
          <MapPin className="w-5 h-5 text-info shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-foreground/80">
            Data profil Anda digunakan untuk keperluan verifikasi laporan. Untuk perubahan data, silakan hubungi administrator di{' '}
            <span className="font-semibold text-primary">pengaduan@baubaukota.go.id</span>.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
