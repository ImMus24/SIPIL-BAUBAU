# SIPIL BAUBAU

**Sistem Pengaduan Infrastruktur Berbasis Web dengan Pemetaan Lokasi GIS dan Monitoring Penanganan Laporan Real-Time**
*Kota Baubau, Sulawesi Tenggara, Indonesia*

---

![SIPIL BAUBAU Banner](https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200)

## 📌 Tentang Aplikasi

**SIPIL BAUBAU** adalah aplikasi Smart Government berbasis web yang dirancang khusus untuk Pemerintah Kota Baubau dalam memfasilitasi pelaporan kerusakan infrastruktur publik (seperti jalan berlubang, lampu PJU padam, drainase tersumbat, penumpukan sampah, dan kerusakan fasilitas umum) di **8 Kecamatan se-Kota Baubau**:
1. Kecamatan Wolio
2. Kecamatan Betoambari
3. Kecamatan Murhum
4. Kecamatan Kokalukuna
5. Kecamatan Lea-Lea
6. Kecamatan Sorawolio
7. Kecamatan Bungi
8. Kecamatan Batupoaro

Sistem ini dilengkapi pemetaan lokasi presisi berbasis **GIS (Leaflet & OpenStreetMap)**, integrasi penugasan **Organisasi Perangkat Daerah (OPD)** terkait (Dinas PUPR, Dinas PERKIM, DLH, Dishub), serta pelacakan kode tiket transparan real-time.

---

## 🛠️ Teknologi & Arsitektur

### Backend (REST API)
- **Framework**: Laravel 12 (PHP 8.3+)
- **Database**: SQLite (Development) / MySQL (Production)
- **Autentikasi**: Laravel Sanctum (Token-based SPA & API Auth)
- **Arsitektur**: Clean Architecture, Repository Pattern, Service Layer, API Resources, Eloquent ORM

### Frontend (SPA)
- **Framework**: React 18/19 + TypeScript + Vite
- **Desain UI**: Tailwind CSS + Material 3 / GovTech Civic Aesthetics
- **Pemetaan GIS**: Leaflet + React-Leaflet + OpenStreetMap
- **Grafik & Analisis**: ApexCharts + React-ApexCharts
- **State & Data Fetching**: Axios + React Context API
- **Icon**: Lucide React Icons

---

## 📁 Struktur Folder Proyek

```text
SIPIL-BAUBAU/
├── backend/                  # REST API Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # AuthController, ComplaintController, StatController
│   │   │   └── Middleware/
│   │   ├── Models/           # Complaint, Category, Agency, User, StatusLog
│   │   ├── Services/         # Business logic layer
│   │   └── Repositories/     # Data access layer
│   ├── database/
│   │   ├── migrations/       # Eloquent database migrations
│   │   └── seeders/          # Kota Baubau initial seed data
│   └── routes/
│       └── api.php           # REST API v1 endpoints
│
└── frontend/                 # React + Vite + TypeScript SPA
    ├── src/
    │   ├── components/       # Reusable UI, Layout, & GIS Map components
    │   │   ├── layout/       # Navbar & Footer
    │   │   ├── map/          # BaubauMap Leaflet component
    │   │   └── ui/           # Badge, StatCard, Modal
    │   ├── context/          # AuthContext provider
    │   ├── pages/            # HomePage, MapPage, SubmitPage, TrackPage, StatsPage, AdminDashboard
    │   ├── services/         # API Client & Mock fallback
    │   └── types/            # TypeScript interfaces & enums
    └── tailwind.config.js    # Civic Emerald & Gold theme
```

---

## 🔑 Fitur Utama

### 🏢 Portal Publik (Warga Masyarakat)
1. **Peta Sebaran GIS Interaktif**: Visualisasi marker status pengaduan di wilayah Kota Baubau.
2. **Formulir Pengaduan Presisi**: Pilihan lokasi pin-point di peta, upload foto bukti kerusakan, dan pemilihan kategori.
3. **Cek Status Laporan (Kode Tiket)**: Pencarian cepat dengan kode unik (contoh: `SIPIL-2026-8A91`) beserta timeline pengerjaan OPD.
4. **Statistik Transparansi**: Grafik ApexCharts capaian penanganan dan persentase laporan per kecamatan.

### 🛡️ Portal Admin Master & OPD Lapangan
1. **Executive Dashboard**: Counter metrik real-time (Menunggu, Diproses, Selesai, Ditolak).
2. **Kelola Status & OPD**: Verifikasi laporan, penugasan Dinas (PUPR/PERKIM/DLH/Dishub), dan upload foto bukti penanganan selesai.
3. **Ekspor Data CSV/Excel**: Rekapitulasi laporan pengaduan untuk keperluan evaluasi dinas.

---

## 🚀 Panduan Instalasi & Jalankan Proyek

### 1. Requirements
- **PHP**: ^8.2 / ^8.3
- **Composer**: ^2.0
- **Node.js**: ^20.0 / ^24.0
- **npm**: ^10.0 / ^11.0

### 2. Jalankan Backend (Laravel 12 API)
```bash
cd backend
composer install
php artisan migrate --seed
php artisan serve
```
*Server API berjalan di `http://127.0.0.1:8000`*

### 3. Jalankan Frontend (React Vite TS)
```bash
cd frontend
npm install
npm run dev
```
*Aplikasi Frontend berjalan di `http://localhost:5173`*

---

## 👤 Akun Uji Coba (Demo Credentials)

| Peran (Role) | Email | Kata Sandi | Wewenang |
| :--- | :--- | :--- | :--- |
| **Admin Super** | `admin@baubaukota.go.id` | `password123` | Master pengelolaan & ekspor data |
| **Petugas OPD (PUPR)** | `officer.pupr@baubaukota.go.id` | `password123` | Update status & bukti foto pengerjaan |
| **Warga Masyarakat** | `warga@gmail.com` | `password123` | Riwayat laporan & pelacakan |

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 **Pemerintah Kota Baubau, Sulawesi Tenggara, Indonesia**.
*SIPIL BAUBAU - Sistem Pengaduan Infrastruktur Berbasis Web.*
