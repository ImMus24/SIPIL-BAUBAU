# SIPIL BAUBAU - Backend API (Clean Architecture)

Sistem Pengaduan Infrastruktur Berbasis Web Kota Baubau dengan Pemetaan Lokasi dan Monitoring Penanganan Laporan.

## 🏛️ Architecture Overview

The backend is built following **Clean Architecture**, **SOLID Principles**, and **Laravel Best Practices**:

- **Controllers (`app/Http/Controllers/Api/V1`)**: Handle HTTP requests, delegation, authorization, and response formatting (maximum size < 100 lines).
- **Service Layer (`app/Services`)**: Houses domain business logic, transactions, events, and file uploads.
- **Repository Pattern (`app/Contracts`, `app/Repositories`)**: Abstraction layer for database access and optimized queries.
- **DTOs (`app/DTOs`)**: Immutable data containers transferring type-safe payloads between layers.
- **Enums (`app/Enums`)**: Backed Enums (`UserRole`, `ComplaintStatus`, `UrgencyLevel`) enforcing domain constraints.
- **API Resources (`app/Http/Resources`)**: Standardized JSON envelopes for API responses.
- **Policies (`app/Policies`)**: Role-Based Access Control (RBAC) authorization.
- **Events & Listeners (`app/Events`, `app/Listeners`)**: Queue-ready asynchronous events.
- **Audit Logging (`app/Models/AuditLog`)**: Detailed security logging for sensitive actions.

---

## 🚀 Key API Endpoints (V1)

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - Sanctum token login
- `GET /api/v1/auth/me` - Authenticated user profile
- `POST /api/v1/auth/logout` - Revoke all active tokens

### Complaints
- `GET /api/v1/complaints` - List complaints (filtered by status, category, subdistrict, search)
- `POST /api/v1/complaints` - Submit new complaint with file attachments
- `GET /api/v1/complaints/ticket/{ticket_code}` - Public complaint lookup by ticket code
- `POST /api/v1/complaints/{id}/status` - Update status (Admin, Officer, Head of Agency)
- `GET /api/v1/complaints/my-reports` - Citizen personal reports history

### Public Data
- `GET /api/v1/categories` - List infrastructure categories
- `GET /api/v1/agencies` - List OPD technical agencies
- `GET /api/v1/stats/summary` - Aggregated system statistics

---

## 🧪 Testing

Run automated PHPUnit test suite:
```bash
php artisan test
```

Security Audit:
```bash
composer audit
```
