import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ClientPortalProtectedRouteProps {
  children: ReactNode;
}

export default function ClientPortalProtectedRoute({ children }: ClientPortalProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-grey-secondary">Loading portal...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/portal/login" replace />;
}
