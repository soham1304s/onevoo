import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import CoreAppShell from './components/layout/Shell';
import { initializeViewportDiagnostics } from './utils/viewportMonitor';

// Direct load for Home to ensure instant rendering
import Home from './components/Home';

// Lazy load auxiliary pages & Enterprise Studio Modules
const CreativeOSStudio = lazy(() => import('./components/Studio/CreativeOSStudio'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const BookingPage = lazy(() => import('./components/BookingPage'));
const BookingConfirmation = lazy(() => import('./components/BookingConfirmation'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const OpportunitiesPage = lazy(() => import('./components/OpportunitiesPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const AuthPage = lazy(() => import('./components/AuthPage'));
const VerifiedRoute = lazy(() => import('./components/VerifiedRoute'));
const EnterpriseConsole = lazy(() => import('./components/EnterpriseConsole'));
const AdminReelModeration = lazy(() => import('./components/AdminReelModeration'));
const DashboardShell = lazy(() => import('./components/layout/DashboardShell'));

import { ThemeProvider } from './context/ThemeContext';
import { ComingSoonProvider } from './context/ComingSoonContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  useEffect(() => {
    const cleanup = initializeViewportDiagnostics((alert) => {
      if (alert.status === 'CRITICAL_ASPECT') {
        console.warn('[Onevoo Viewport Diagnostic]', alert.message, alert.payload);
      }
    });
    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <ComingSoonProvider>
              <Router>
                <ScrollToTop />
                <CoreAppShell>
                  <Navbar />
                <div className="wv-root" style={{ flex: 1 }}>
                  <Suspense fallback={
                    <div className="page-loader">
                      <div className="page-loader-spinner"></div>
                      <div className="mono">Loading Onevoo Creative OS...</div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<DashboardShell />} />
                      <Route path="/dashboard/creator" element={<DashboardShell initialRole="CREATOR" />} />
                      <Route path="/dashboard/brand" element={<DashboardShell initialRole="BRAND" />} />
                      <Route path="/dashboard/manager" element={<DashboardShell initialRole="MANAGER" />} />
                      <Route path="/dashboard/vendor" element={<DashboardShell initialRole="VENDOR" />} />
                      <Route path="/dashboard/admin" element={<VerifiedRoute allowedRoles={["ADMIN"]}><DashboardShell initialRole="ADMIN" /></VerifiedRoute>} />
                      <Route path="/studio" element={<CreativeOSStudio />} />
                      <Route path="/enterprise-hub" element={<EnterpriseConsole />} />
                      <Route path="/admin/reels" element={
                        <VerifiedRoute allowedRoles={["ADMIN"]}>
                          <div className="sec wrap" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
                            <AdminReelModeration />
                          </div>
                        </VerifiedRoute>
                      } />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/book-demo" element={<BookingPage />} />
                      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/opportunities" element={<VerifiedRoute><OpportunitiesPage /></VerifiedRoute>} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </div>
                <Footer />
                <BackToTopButton />
              </CoreAppShell>
            </Router>
          </ComingSoonProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
  );
}

export default App;