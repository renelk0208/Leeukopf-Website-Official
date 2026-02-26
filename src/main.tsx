import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import MetaPixelTracker from './components/MetaPixelTracker.tsx';
import GoogleAnalytics from './components/GoogleAnalytics.tsx';
import CanonicalTag from './components/CanonicalTag.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import './index.css';

if (typeof window !== 'undefined' && import.meta.env.VITE_ENABLE_PWA !== 'true') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister()))
      );
    });
  }

  if ('caches' in window) {
    void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <MetaPixelTracker />
        <GoogleAnalytics />
        <CanonicalTag />
        <CartProvider>
          <AuthProvider>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/*" element={<App />} />
            </Routes>
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
