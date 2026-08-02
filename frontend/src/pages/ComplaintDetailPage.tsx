import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RefreshCw, Home, AlertTriangle, Share2, MapPin } from 'lucide-react';
import { useComplaintDetail, useAddComplaintComment, useAgencies } from '../hooks/queries';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, UrgencyBadge, Badge } from '../components/ui/Badge';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Skeleton } from '../components/dashboard/LoadingSkeleton';
import { ComplaintInfoCard } from '../components/complaint/ComplaintInfoCard';
import { PhotoGallery } from '../components/complaint/PhotoGallery';
import { DetailTimeline } from '../components/complaint/DetailTimeline';
import { CommentSection } from '../components/complaint/CommentSection';
import { ActivityFeed } from '../components/complaint/ActivityFeed';
import { RelatedComplaints } from '../components/complaint/RelatedComplaints';
import { StatusPanel } from '../components/complaint/StatusPanel';
import { MapPanel } from '../components/complaint/MapPanel';
import { NotificationHistory } from '../components/complaint/NotificationHistory';
import { DetailActionPanel } from '../components/complaint/DetailActionPanel';
import { BaubauMap } from '../components/map/BaubauMap';
import { useToast } from '../components/ui/Toast';
import { complaintService } from '../services/complaintService';
import { formatDateTime, generateInitials } from '../lib/utils';
import { cn } from '../lib/utils';
import type { Complaint, ComplaintFileCategory } from '../types';

export function ComplaintDetailPage() {
  const { id, ticket_code } = useParams<{ id: string; ticket_code: string }>();
  const complaintId = id ? Number(id) : null;
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const { data: complaint, isLoading, isError, error, refetch, isFetching } = useComplaintDetail(complaintId);
  const commentMutation = useAddComplaintComment(complaintId ?? 0);
  const { data: agencies } = useAgencies();

  const [copiedTicket, setCopiedTicket] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Legacy /complaint/:ticket_code → resolve to /complaints/:id
  useEffect(() => {
    if (!id && ticket_code) {
      (async () => {
        try {
          const found = await complaintService.getComplaintByTicket(ticket_code);
          if (found) {
            navigate(`/complaints/${found.id}`, { replace: true });
          }
        } catch {
          // leave the error state to render
        }
      })();
    }
  }, [id, ticket_code, navigate]);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const copyTicket = async () => {
    if (!complaint) return;
    try {
      await navigator.clipboard.writeText(complaint.ticket_code);
      setCopiedTicket(true);
      toast.success('Tiket disalin', 'Kode tiket disalin ke clipboard.');
      setTimeout(() => setCopiedTicket(false), 2000);
    } catch {
      toast.error('Gagal menyalin', 'Tidak dapat mengakses clipboard.');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success('Tautan disalin', 'Tautan halaman disalin ke clipboard.');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error('Gagal menyalin', 'Tidak dapat mengakses clipboard.');
    }
  };

  const handleComment = async (body: string) => {
    if (!complaint) return;
    await commentMutation.mutateAsync(body);
    toast.success('Komentar terkirim', 'Komentar berhasil ditambahkan.');
    refetch();
  };

  const handleFileUpload = async (category: ComplaintFileCategory, file: File) => {
    if (!complaint) return;
    try {
      await complaintService.uploadComplaintFile(complaint.id, file, category);
      toast.success('Berkas diunggah', 'Foto berhasil diunggah.');
      refetch();
    } catch {
      toast.error('Gagal mengunggah', 'Pastikan berkas valid dan berukuran maksimal 15 MB.');
    }
  };

  // ─── Loading skeleton ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-10 w-3/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
              <Skeleton className="h-72" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-56" />
              <Skeleton className="h-72" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────
  if (isError || !complaint) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-danger/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-warning/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center max-w-lg mx-auto animate-fade-in-up">
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-danger to-warning opacity-10 rotate-6" />
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-danger to-warning opacity-10 -rotate-6" />
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-danger to-warning flex items-center justify-center shadow-2xl shadow-danger/20">
              <AlertTriangle className="w-14 h-14 text-white" aria-hidden="true" />
            </div>
          </div>
          <h1 className="font-heading text-2xl font-black text-foreground mb-2">Laporan Tidak Ditemukan</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            {error instanceof Error ? error.message : 'Laporan tidak tersedia atau Anda tidak memiliki akses.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-all"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Coba Lagi
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all"
            >
              <Home className="w-4 h-4" aria-hidden="true" /> Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const role = user?.role ?? 'citizen';
  const isOfficer = role === 'officer';
  const isAdmin = role === 'admin';
  const canOfficerAct = isOfficer && (!complaint.agency_id || complaint.agency_id === user?.agency_id);
  const canUpload = isAdmin || canOfficerAct;

  // Map points: current + related (for nearby markers)
  const mapPoints: Complaint[] = [
    complaint as Complaint,
    ...(complaint.related ?? []).filter((r) => r.latitude && r.longitude),
  ];

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl border border-border hover:bg-muted transition-colors shrink-0"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <Breadcrumb
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Laporan', href: '/map' },
                { label: 'Detail', href: undefined },
              ]}
            />
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={copyLink}
              className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
              aria-label="Salin tautan"
              title="Salin tautan"
            >
              {copiedLink ? <Check className="w-4 h-4 text-success" aria-hidden="true" /> : <Share2 className="w-4 h-4" aria-hidden="true" />}
            </button>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
              aria-label="Muat ulang"
              title="Muat ulang"
            >
              <RefreshCw className={cn('w-4 h-4', isFetching && 'animate-spin')} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-border bg-card shadow-lg overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-golden to-success" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    onClick={copyTicket}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-lg border border-primary/20 hover:bg-primary/15 transition-colors"
                    title="Salin kode tiket"
                  >
                    {complaint.ticket_code}
                    {copiedTicket ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
                  </button>
                  <StatusBadge status={complaint.status} size="md" />
                  <UrgencyBadge urgency={complaint.urgency} size="md" />
                  {complaint.category && <Badge variant="primary" size="md">{complaint.category.name}</Badge>}
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                  {complaint.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-black">
                      {generateInitials(complaint.reporter_name)}
                    </span>
                    {complaint.reporter_name}
                  </span>
                  <span>•</span>
                  <span>Diajukan {formatDateTime(complaint.created_at)}</span>
                  {complaint.current_officer && (
                    <>
                      <span>•</span>
                      <span>Petugas: <span className="font-semibold text-foreground">{complaint.current_officer}</span></span>
                    </>
                  )}
                </div>
              </div>

              {/* ETA chip */}
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Selesai</p>
                <p className={cn(
                  'text-sm font-black mt-1 px-3 py-1.5 rounded-xl border',
                  complaint.sla.status === 'overdue' && 'text-danger bg-danger-bg border-danger-border',
                  complaint.sla.status === 'on_track' && 'text-info bg-info-bg border-info-border',
                  complaint.sla.status === 'selesai' && 'text-success bg-success-bg border-success-border',
                  complaint.sla.status === 'unknown' && 'text-muted-foreground bg-muted border-border',
                )}>
                  {complaint.sla.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Two-column body ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT — 2/3 */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            <ComplaintInfoCard complaint={complaint} />

            <PhotoGallery
              files={complaint.files ?? []}
              canUpload={canUpload}
              onUpload={handleFileUpload}
            />

            {/* Real map with markers */}
            <div className="space-y-2">
              <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2 px-1">
                <span className="p-1.5 rounded-lg bg-danger-bg text-danger">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </span>
                Peta Lokasi
              </h2>
              <BaubauMap
                complaints={mapPoints}
                selectedLat={complaint.latitude}
                selectedLng={complaint.longitude}
                height="360px"
                showLegend={false}
                enableClustering={false}
              />
              <MapPanel complaint={complaint} nearby={complaint.related ?? []} />
            </div>

            <DetailTimeline statusLogs={complaint.status_logs ?? []} activityLogs={complaint.activity_logs ?? []} />

            <div id="komentar-section">
              <CommentSection
                comments={complaint.comments ?? []}
                onSubmit={handleComment}
                disabled={!user}
              />
            </div>

            <ActivityFeed logs={complaint.activity_logs ?? []} />
            <NotificationHistory notifications={complaint.notifications ?? []} />
            <RelatedComplaints complaints={complaint.related ?? []} />
          </div>

          {/* RIGHT — 1/3 sticky */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <StatusPanel complaint={complaint} />
            <DetailActionPanel
              complaint={complaint}
              agencies={agencies ?? []}
              onDataChanged={() => refetch()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetailPage;
