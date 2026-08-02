import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useComplaintByTicket } from '../hooks/queries';
import { cn, getStatusColor } from '../lib/utils';
import { STATUS_LABELS, URGENCY_OPTIONS } from '../config/constants';

const statusStepOrder = ['menunggu', 'diproses', 'selesai'];

export function ComplaintDetailPage() {
  const { ticket_code } = useParams<{ ticket_code: string }>();
  const navigate = useNavigate();
  const { data: complaint, isLoading, isError, error } = useComplaintByTicket(ticket_code ?? null);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-8 w-72 bg-muted rounded" />
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-warning mb-4" />
        <h2 className="text-xl font-semibold mb-2">Laporan Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error ? error.message : 'Kode tiket tidak valid atau laporan telah dihapus.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/track')} className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted transition-all text-sm">
            Coba Lagi
          </button>
          <Link to="/" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusStepOrder.indexOf(complaint.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Beranda</Link>
          <span>/</span>
          <Link to="/track" className="hover:text-foreground">Lacak</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{complaint.ticket_code}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono text-muted-foreground mb-1">{complaint.ticket_code}</p>
          <h1 className="text-2xl font-bold">{complaint.title}</h1>
        </div>
        <span className={cn(
          'px-3 py-1 rounded-full text-xs font-medium',
          getStatusColor(complaint.status) === 'warning' && 'bg-warning/10 text-warning',
          getStatusColor(complaint.status) === 'info' && 'bg-blue-500/10 text-blue-500',
          getStatusColor(complaint.status) === 'success' && 'bg-success/10 text-success',
          getStatusColor(complaint.status) === 'danger' && 'bg-danger/10 text-danger',
        )}>
          {STATUS_LABELS[complaint.status]}
        </span>
      </div>

      {/* Status Timeline */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold mb-4">Status Penanganan</h3>
        <div className="flex items-start gap-0">
          {statusStepOrder.map((step, i) => {
            const isDone = currentStepIndex >= i;
            const isCurrent = currentStepIndex === i;
            return (
              <div key={step} className="flex-1 relative">
                <div className="flex items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 shrink-0',
                    isDone ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    isCurrent && 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                  )}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  {i < statusStepOrder.length - 1 && (
                    <div className={cn(
                      'h-0.5 flex-1 mt-4',
                      currentStepIndex > i ? 'bg-primary' : 'bg-muted'
                    )} />
                  )}
                </div>
                <p className={cn(
                  'text-xs mt-2',
                  isDone ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}>
                  {STATUS_LABELS[step]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Pelapor</p>
          <p className="font-medium">{complaint.reporter_name}</p>
          {complaint.reporter_phone && <p className="text-sm text-muted-foreground">{complaint.reporter_phone}</p>}
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Kategori</p>
          <p className="font-medium">{complaint.category?.name ?? '-'}</p>
          {complaint.agency?.name && <p className="text-sm text-muted-foreground">{complaint.agency.name}</p>}
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Lokasi</p>
          <p className="font-medium">{complaint.subdistrict}</p>
          <p className="text-sm text-muted-foreground">{complaint.address}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Tingkat Urgensi</p>
          <p className={cn(
            'font-medium',
            complaint.urgency === 'tinggi' || complaint.urgency === 'darurat' ? 'text-danger' :
            complaint.urgency === 'sedang' ? 'text-warning' : ''
          )}>
            {URGENCY_OPTIONS.find(u => u.value === complaint.urgency)?.label ?? complaint.urgency}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold mb-3">Deskripsi Laporan</h3>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{complaint.description}</p>
      </div>

      {/* Timeline */}
      {complaint.status_logs && complaint.status_logs.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold mb-4">Riwayat Penanganan</h3>
          <div className="space-y-4">
            {complaint.status_logs.map((log, i) => (
              <div key={log.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2" />
                  {i < complaint.status_logs!.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{STATUS_LABELS[log.status]}</span>
                    <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString('id-ID')}</span>
                  </div>
                  {log.notes && <p className="text-sm text-muted-foreground">{log.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Reason */}
      {complaint.status === 'ditolak' && complaint.rejection_reason && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-danger mb-2">Alasan Penolakan</h3>
          <p className="text-sm text-danger/80">{complaint.rejection_reason}</p>
        </div>
      )}

      {/* Attachments */}
      {complaint.attachments && complaint.attachments.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold mb-4">Lampiran</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {complaint.attachments.map((att) => (
              <a
                key={att.id}
                href={att.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-video rounded-lg bg-muted overflow-hidden hover:opacity-80 transition-opacity"
              >
                {att.file_type.startsWith('image/') ? (
                  <img src={att.file_path} alt="Lampiran" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    {att.file_type}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex gap-3">
        <Link
          to="/submit"
          className="flex-1 text-center px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
        >
          Buat Laporan Baru
        </Link>
        <Link
          to="/"
          className="px-5 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}

export default ComplaintDetailPage;
