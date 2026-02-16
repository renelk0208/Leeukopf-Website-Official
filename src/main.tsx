import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import MetaPixelTracker from './components/MetaPixelTracker.tsx';
import GoogleAnalytics from './components/GoogleAnalytics.tsx';
import CanonicalTag from './components/CanonicalTag.tsx';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/admin/login" />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <MetaPixelTracker />
        <GoogleAnalytics />
        <CanonicalTag />
        <AuthProvider>
          <CartProvider>
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
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
