export type UserRole = 'admin' | 'officer' | 'citizen' | 'head_of_agency';

export type ComplaintStatus = 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

export type UrgencyLevel = 'rendah' | 'sedang' | 'tinggi' | 'darurat';

export type BaubauSubdistrict =
  | 'Wolio'
  | 'Betoambari'
  | 'Murhum'
  | 'Kokalukuna'
  | 'Lea-Lea'
  | 'Sorawolio'
  | 'Bungi'
  | 'Batupoaro';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  agency_id?: number | null;
  agency_name?: string | null;
  phone?: string;
  avatar?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Agency {
  id: number;
  code: string;
  name: string;
  description: string;
  contact_email: string;
  phone: string;
}

export interface Attachment {
  id: number;
  complaint_id: number;
  file_path: string;
  file_type: string;
  file_size?: number;
}

export interface ComplaintStatusLog {
  id: number;
  complaint_id: number;
  status: ComplaintStatus;
  notes: string;
  updated_by: string;
  photo_proof?: string | null;
  created_at: string;
}

export interface Complaint {
  id: number;
  ticket_code: string;
  title: string;
  description: string;
  category_id: number;
  category?: Category;
  agency_id?: number | null;
  agency?: Agency | null;
  user_id?: number | null;
  user?: User | null;
  reporter_name: string;
  reporter_phone: string;
  reporter_email?: string;
  address: string;
  subdistrict: BaubauSubdistrict;
  latitude: number;
  longitude: number;
  urgency: UrgencyLevel;
  status: ComplaintStatus;
  rejection_reason?: string | null;
  estimated_completion_date?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  attachments?: Attachment[];
  status_logs?: ComplaintStatusLog[];
}

export interface ComplaintFilter {
  search?: string;
  status?: ComplaintStatus | 'all';
  category_id?: number | 'all';
  subdistrict?: BaubauSubdistrict | 'all';
  urgency?: UrgencyLevel | 'all';
}

export interface StatSummary {
  total: number;
  menunggu: number;
  diproses: number;
  selesai: number;
  ditolak: number;
  completion_rate: number;
}

export interface SubdistrictStat {
  subdistrict: BaubauSubdistrict;
  count: number;
  resolved: number;
}

export interface CategoryStat {
  category_name: string;
  count: number;
}

// Notification
export interface AppNotification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

export interface ActivityItem {
  id: number;
  complaint_id: number;
  ticket_code: string;
  title: string;
  category_name: string;
  status: string;
  notes: string;
  updated_by: string;
  created_at: string;
}

// Dashboard Types
export interface MonthlyTrend {
  month: string;
  label: string;
  total: number;
  resolved: number;
}

export interface AgencyPerformance {
  agency_name: string;
  total: number;
  resolved: number;
  completion_rate: number;
}

export interface TodaysTasks {
  new_today: number;
  in_progress: number;
  completed_today: number;
}

export interface AgencyStats {
  menunggu: number;
  diproses: number;
  selesai: number;
  ditolak: number;
}

export interface UserSummary {
  total: number;
  officers: number;
  citizens: number;
}

export interface OfficerRanking {
  officer_name: string;
  officer_id: number;
  agency_name: string;
  total_handled: number;
  completed: number;
}

export interface YearlyTrend {
  year: string;
  total: number;
  resolved: number;
}

export interface TopOfficer {
  officer_name: string;
  officer_id: number;
  agency_name: string;
  total_handled: number;
  completed: number;
}

export interface AuditLogItem {
  id: number;
  user_id: number;
  user?: { id: number; name: string };
  action: string;
  description: string;
  created_at: string;
}

export interface SatisfactionData {
  completion_rate: number;
  total_completed: number;
  total_reports: number;
}

export interface TimelineItem {
  complaint_id: number;
  ticket_code: string;
  title: string;
  status: string;
  notes: string;
  updated_by: string;
  created_at: string;
}

export interface PerformanceDay {
  date: string;
  label: string;
  completed: number;
  new: number;
}

export interface AssignmentHistoryItem {
  id: number;
  ticket_code: string;
  title: string;
  status: ComplaintStatus;
  category_name: string;
  completed_at?: string | null;
  created_at: string;
}

export interface ComplaintAnalytics {
  by_category: CategoryStat[];
  by_subdistrict: SubdistrictStat[];
  by_urgency: Record<string, number>;
}

// Dashboard data interfaces
export interface CitizenDashboardData {
  stats: StatSummary;
  my_reports: Complaint[];
  user_complaints: Complaint[];
  timeline: TimelineItem[];
  notifications_count: number;
  satisfaction: SatisfactionData;
}

export interface AdminDashboardData {
  stats: StatSummary;
  recent_reports: Complaint[];
  monthly_trend: MonthlyTrend[];
  active_officers: number;
  agency_performance: AgencyPerformance[];
  user_summary: UserSummary;
  verification_queue: Complaint[];
  top_categories: CategoryStat[];
  top_subdistricts: SubdistrictStat[];
  officer_ranking: OfficerRanking[];
  audit_log: AuditLogItem[];
  complaint_analytics: ComplaintAnalytics;
}

export interface OfficerDashboardData {
  stats_agency: AgencyStats;
  todays_tasks: TodaysTasks;
  assigned_tasks: Complaint[];
  recent_activity: Record<string, unknown>[];
  avg_resolution_time: number;
  priority_complaints: Complaint[];
  performance_chart: PerformanceDay[];
  assignment_history: AssignmentHistoryItem[];
}

export interface HeadOfAgencyDashboardData {
  stats: StatSummary;
  monthly_trend: MonthlyTrend[];
  agency_performance: AgencyPerformance[];
  recent_reports: Complaint[];
  avg_resolution_time: number;
  top_officers: TopOfficer[];
  top_categories: CategoryStat[];
  yearly_trend: YearlyTrend[];
  district_performance: SubdistrictStat[];
  satisfaction_rate: number;
}

export interface MapPoint {
  id: number;
  ticket_code: string;
  title: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  subdistrict: BaubauSubdistrict;
  urgency: UrgencyLevel;
  created_at: string;
}

export type DashboardData = CitizenDashboardData | AdminDashboardData | OfficerDashboardData | HeadOfAgencyDashboardData;
