import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { queryClient } from './lib/query-client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const MapPage = lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })));
const SubmitComplaintPage = lazy(() => import('./pages/SubmitComplaintPage').then(m => ({ default: m.SubmitComplaintPage })));
const TrackComplaintPage = lazy(() => import('./pages/TrackComplaintPage').then(m => ({ default: m.TrackComplaintPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then(m => ({ default: m.StatsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const ComplaintDetailPage = lazy(() => import('./pages/ComplaintDetailPage').then(m => ({ default: m.ComplaintDetailPage })));

// Dashboard pages
const CitizenDashboard = lazy(() => import('./pages/dashboards/CitizenDashboard').then(m => ({ default: m.CitizenDashboard })));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const OfficerDashboard = lazy(() => import('./pages/dashboards/OfficerDashboard').then(m => ({ default: m.OfficerDashboard })));
const KepalaDinasDashboard = lazy(() => import('./pages/dashboards/KepalaDinasDashboard').then(m => ({ default: m.KepalaDinasDashboard })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const NotificationPage = lazy(() => import('./pages/NotificationPage').then(m => ({ default: m.NotificationPage })));

// Error pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ForbiddenPage = lazy(() => import('./pages/ForbiddenPage').then(m => ({ default: m.ForbiddenPage })));

// Loading
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />
        <div className="absolute inset-1 rounded-xl border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">Memuat halaman…</p>
    </div>
  </div>
);

// Animated route wrapper for public pages
const AnimatedOutlet: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

// Layouts
const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-background font-body transition-colors duration-200">
    <Navbar />
    <main className="flex-1">
      <Suspense fallback={<PageLoader />}>
        <AnimatedOutlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

// Route guards
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    const redirectMap: Record<string, string> = {
      citizen: '/dashboard',
      officer: '/officer',
      admin: '/admin',
      head_of_agency: '/kepala-dinas',
    };
    return <Navigate to={redirectMap[role ?? 'citizen'] ?? '/dashboard'} replace />;
  }
  return <>{children}</>;
};

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};

// Route /dashboard: tampilkan CitizenDashboard untuk citizen,
// redirect role lain ke halaman dashboard masing-masing.
const CitizenDashboardRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'officer') return <Navigate to="/officer" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'head_of_agency') return <Navigate to="/kepala-dinas" replace />;
  // citizen (atau role tidak dikenali) tampilkan halaman warga
  return (
    <Suspense fallback={<PageLoader />}>
      <CitizenDashboard />
    </Suspense>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/submit" element={<SubmitComplaintPage />} />
                    <Route path="/track" element={<TrackComplaintPage />} />
                    <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
                    <Route path="/complaint/:ticket_code" element={<ComplaintDetailPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                  </Route>

                  {/* /dashboard: citizen lihat dashboard warga, role lain diredirect */}
                  <Route path="/dashboard" element={<CitizenDashboardRoute />} />

                  {/* Protected: officer */}
                  <Route path="/officer" element={
                    <ProtectedRoute allowedRoles={['officer']}><OfficerDashboard /></ProtectedRoute>
                  } />

                  {/* Protected: admin only */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
                  } />

                  {/* Protected: head_of_agency only */}
                  <Route path="/kepala-dinas" element={
                    <ProtectedRoute allowedRoles={['head_of_agency']}><KepalaDinasDashboard /></ProtectedRoute>
                  } />

                  {/* Protected: profile + notifications */}
                  <Route path="/profile" element={
                    <ProtectedRoute allowedRoles={['citizen', 'officer', 'admin', 'head_of_agency']}><ProfilePage /></ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute allowedRoles={['citizen', 'officer', 'admin', 'head_of_agency']}><NotificationPage /></ProtectedRoute>
                  } />

                  {/* Error routes */}
                  <Route path="/403" element={<ForbiddenPage />} />
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
