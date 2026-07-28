import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../config/constants';
import { formatDate } from '../lib/utils';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Silakan login untuk melihat profil.</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

        {/* Avatar + Name */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {user.name[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {ROLE_LABELS[user.role] ?? user.role}
          </div>
        </div>

        {/* Details */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {[
            { label: 'Nama', value: user.name },
            { label: 'Email', value: user.email },
            { label: 'Role', value: ROLE_LABELS[user.role] ?? user.role },
            { label: 'Telepon', value: user.phone || '-' },
            { label: 'Bergabung', value: formatDate(user.created_at) },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <span className="text-sm font-medium">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
