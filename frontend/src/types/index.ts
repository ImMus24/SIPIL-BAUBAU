export type UserRole = 'admin' | 'officer' | 'citizen';

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
