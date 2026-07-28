import type { Complaint, Category, Agency, StatSummary, SubdistrictStat, CategoryStat } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Jalan & Jembatan', slug: 'jalan-jembatan', icon: 'Road', description: 'Kerusakan badan jalan, lubang, aspal terkelupas, jembatan rusak' },
  { id: 2, name: 'Drainase & Banjir', slug: 'drainase-banjir', icon: 'Waves', description: 'Saluran air tersumbat, tanggul jebol, genangan air jalan' },
  { id: 3, name: 'Penerangan Jalan (PJU)', slug: 'pju', icon: 'Lightbulb', description: 'Lampu jalan padam, tiang PJU miring/roboh, kabel terputus' },
  { id: 4, name: 'Kebersihan & Sampah', slug: 'kebersihan-sampah', icon: 'Trash2', description: 'Penumpukan sampah liar, TPS meluap, pohon tumbang' },
  { id: 5, name: 'Fasilitas & Bangunan Publik', slug: 'fasilitas-publik', icon: 'Building2', description: 'Taman kota rusak, trotoar rusak, halte bus tidak layak' },
  { id: 6, name: 'Rambu & Perhubungan', slug: 'rambu-perhubungan', icon: 'Signpost', description: 'Rambu lalu lintas rusak, traffic light padam, cermin tikungan' },
];

export const MOCK_AGENCIES: Agency[] = [
  { id: 1, code: 'PUPR', name: 'Dinas Pekerjaan Umum dan Penataan Ruang Kota Baubau', description: 'Penanganan infrastruktur jalan, jembatan, dan tata ruang', contact_email: 'dinaspupr@baubaukota.go.id', phone: '(0402) 2821101' },
  { id: 2, code: 'PERKIM', name: 'Dinas Perumahan dan Kawasan Permukiman Kota Baubau', description: 'Penanganan penerangan jalan umum dan drainase permukiman', contact_email: 'disperkim@baubaukota.go.id', phone: '(0402) 2821102' },
  { id: 3, code: 'DLH', name: 'Dinas Lingkungan Hidup Kota Baubau', description: 'Pengelolaan kebersihan, pembersihan tempat sampah, dan pertamanan', contact_email: 'dlh@baubaukota.go.id', phone: '(0402) 2821103' },
  { id: 4, code: 'DISHUB', name: 'Dinas Perhubungan Kota Baubau', description: 'Pengelolaan rambu-rambu lalu lintas dan markah jalan', contact_email: 'dishub@baubaukota.go.id', phone: '(0402) 2821104' },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    ticket_code: 'SIPIL-2026-8A91',
    title: 'Jalan Berlubang Parah di Depan Benteng Keraton Wolio',
    description: 'Terdapat lubang sedalam 15 cm di jalur utama dekat gerbang Benteng Keraton. Sangat membahayakan pengendara sepeda motor saat malam hari.',
    category_id: 1,
    category: MOCK_CATEGORIES[0],
    agency_id: 1,
    agency: MOCK_AGENCIES[0],
    user_id: 3,
    reporter_name: 'La Ode Ahmad',
    reporter_phone: '081245678901',
    reporter_email: 'laode.ahmad@gmail.com',
    address: 'Jl. Sultan Murhum No. 45, Wolio',
    subdistrict: 'Wolio',
    latitude: -5.4642,
    longitude: 122.6035,
    urgency: 'tinggi',
    status: 'diproses',
    created_at: '2026-07-25 09:30:00',
    updated_at: '2026-07-26 14:15:00',
    attachments: [
      { id: 101, complaint_id: 1, file_path: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800', file_type: 'image/jpeg' }
    ],
    status_logs: [
      { id: 1, complaint_id: 1, status: 'menunggu', notes: 'Laporan berhasil disubmit oleh warga.', updated_by: 'Sistem', created_at: '2026-07-25 09:30:00' },
      { id: 2, complaint_id: 1, status: 'diproses', notes: 'Laporan diverifikasi Admin dan ditugaskan ke Tim Lapangan Bina Marga Dinas PUPR Kota Baubau.', updated_by: 'Admin Super', created_at: '2026-07-26 14:15:00' }
    ]
  },
  {
    id: 2,
    ticket_code: 'SIPIL-2026-8A92',
    title: 'Lampu PJU Padam Sepanjang Jalur Pantai Kamali',
    description: 'Deretan 5 tiang lampu jalan utama Pantai Kamali mati total sejak 3 hari lalu. Suasana menjadi gelap dan rawan kejahatan.',
    category_id: 3,
    category: MOCK_CATEGORIES[2],
    agency_id: 2,
    agency: MOCK_AGENCIES[1],
    user_id: 4,
    reporter_name: 'Wa Ode Rosmiati',
    reporter_phone: '085298765432',
    reporter_email: 'rosmiati@gmail.com',
    address: 'Kawasan Wisata Pantai Kamali, Betoambari',
    subdistrict: 'Betoambari',
    latitude: -5.4688,
    longitude: 122.6012,
    urgency: 'sedang',
    status: 'selesai',
    completed_at: '2026-07-27 16:00:00',
    created_at: '2026-07-23 18:45:00',
    updated_at: '2026-07-27 16:00:00',
    attachments: [
      { id: 102, complaint_id: 2, file_path: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800', file_type: 'image/jpeg' }
    ],
    status_logs: [
      { id: 3, complaint_id: 2, status: 'menunggu', notes: 'Laporan telah masuk.', updated_by: 'Sistem', created_at: '2026-07-23 18:45:00' },
      { id: 4, complaint_id: 2, status: 'diproses', notes: 'Dinas Perkim Kota Baubau menurunkan teknisi perbaikan kabel PJU.', updated_by: 'Petugas PERKIM', created_at: '2026-07-24 10:00:00' },
      { id: 5, complaint_id: 2, status: 'selesai', notes: 'Penggantian bohlam LED 100W dan perbaikan sekring otomatis selesai dikerjakan.', updated_by: 'Petugas PERKIM', photo_proof: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800', created_at: '2026-07-27 16:00:00' }
    ]
  },
  {
    id: 3,
    ticket_code: 'SIPIL-2026-8A93',
    title: 'Drainase Tersumbat Sampah Menyebabkan Meluap ke Jalan Murhum',
    description: 'Saluran pembuangan air di sekitar pertokoan Murhum tersumbat endapan lumpur dan sampah plastik, meluap setiap kali hujan deras.',
    category_id: 2,
    category: MOCK_CATEGORIES[1],
    agency_id: 1,
    agency: MOCK_AGENCIES[0],
    user_id: 5,
    reporter_name: 'Muhammad Fadel',
    reporter_phone: '082134567890',
    reporter_email: 'fadel.baubau@gmail.com',
    address: 'Jl. Palagimata Komp. Kantor Walikota, Murhum',
    subdistrict: 'Murhum',
    latitude: -5.4755,
    longitude: 122.6105,
    urgency: 'darurat',
    status: 'menunggu',
    created_at: '2026-07-28 07:15:00',
    updated_at: '2026-07-28 07:15:00',
    attachments: [
      { id: 103, complaint_id: 3, file_path: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', file_type: 'image/jpeg' }
    ],
    status_logs: [
      { id: 6, complaint_id: 3, status: 'menunggu', notes: 'Laporan baru disubmit dan menunggu verifikasi Admin OPD.', updated_by: 'Sistem', created_at: '2026-07-28 07:15:00' }
    ]
  },
  {
    id: 4,
    ticket_code: 'SIPIL-2026-8A94',
    title: 'Penumpukan Sampah Liar di Pinggir Jalan Kokalukuna',
    description: 'Sampah rumah tangga menumpuk dan menimbulkan bau tidak sedap di tepi jalan raya pelabuhan Kokalukuna.',
    category_id: 4,
    category: MOCK_CATEGORIES[3],
    agency_id: 3,
    agency: MOCK_AGENCIES[2],
    user_id: null,
    reporter_name: 'Anonym Warga',
    reporter_phone: '081399887766',
    address: 'Jl. Pelabuhan Sembilan, Kokalukuna',
    subdistrict: 'Kokalukuna',
    latitude: -5.4410,
    longitude: 122.6250,
    urgency: 'sedang',
    status: 'diproses',
    created_at: '2026-07-26 11:20:00',
    updated_at: '2026-07-27 08:30:00',
    attachments: [
      { id: 104, complaint_id: 4, file_path: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800', file_type: 'image/jpeg' }
    ],
    status_logs: [
      { id: 7, complaint_id: 4, status: 'menunggu', notes: 'Disubmit via form publik.', updated_by: 'Sistem', created_at: '2026-07-26 11:20:00' },
      { id: 8, complaint_id: 4, status: 'diproses', notes: 'Armada Truk Pengangkut DLH Kota Baubau dijadwalkan meluncur.', updated_by: 'Admin DLH', created_at: '2026-07-27 08:30:00' }
    ]
  },
  {
    id: 5,
    ticket_code: 'SIPIL-2026-8A95',
    title: 'Rambu Dilarang Parkir Roboh di Simpang Lea-Lea',
    description: 'Tiang besi rambu lalu lintas patah akibat ditabrak kendaraan tak dikenal.',
    category_id: 6,
    category: MOCK_CATEGORIES[5],
    agency_id: 4,
    agency: MOCK_AGENCIES[3],
    user_id: 6,
    reporter_name: 'La Rahmad',
    reporter_phone: '085311223344',
    address: 'Jl. Raya Palabusa, Lea-Lea',
    subdistrict: 'Lea-Lea',
    latitude: -5.4120,
    longitude: 122.6450,
    urgency: 'rendah',
    status: 'selesai',
    completed_at: '2026-07-25 15:30:00',
    created_at: '2026-07-21 14:10:00',
    updated_at: '2026-07-25 15:30:00',
    attachments: [],
    status_logs: [
      { id: 9, complaint_id: 5, status: 'menunggu', notes: 'Laporan masuk.', updated_by: 'Sistem', created_at: '2026-07-21 14:10:00' },
      { id: 10, complaint_id: 5, status: 'selesai', notes: 'Dishub Baubau memasang kembali fondasi rambu baru.', updated_by: 'Petugas Dishub', created_at: '2026-07-25 15:30:00' }
    ]
  }
];

export const MOCK_STAT_SUMMARY: StatSummary = {
  total: 148,
  menunggu: 18,
  diproses: 34,
  selesai: 88,
  ditolak: 8,
  completion_rate: 65.2,
};

export const MOCK_SUBDISTRICT_STATS: SubdistrictStat[] = [
  { subdistrict: 'Wolio', count: 42, resolved: 28 },
  { subdistrict: 'Betoambari', count: 28, resolved: 19 },
  { subdistrict: 'Murhum', count: 24, resolved: 14 },
  { subdistrict: 'Kokalukuna', count: 18, resolved: 11 },
  { subdistrict: 'Batupoaro', count: 15, resolved: 9 },
  { subdistrict: 'Lea-Lea', count: 9, resolved: 4 },
  { subdistrict: 'Sorawolio', count: 7, resolved: 2 },
  { subdistrict: 'Bungi', count: 5, resolved: 1 },
];

export const MOCK_CATEGORY_STATS: CategoryStat[] = [
  { category_name: 'Jalan & Jembatan', count: 58 },
  { category_name: 'Penerangan Jalan (PJU)', count: 34 },
  { category_name: 'Drainase & Banjir', count: 26 },
  { category_name: 'Kebersihan & Sampah', count: 18 },
  { category_name: 'Fasilitas & Bangunan', count: 8 },
  { category_name: 'Rambu & Perhubungan', count: 4 },
];
