import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Approval gate is scoped to distributor application_type only.
// Regular B2B clients (missing or non-distributor application_type) are granted
// portal access by authentication alone. Do not infer distributor status from
// pending state or absence from any approval list.
// Default missing/legacy application_type to client/b2b_order, not distributor.

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

  if (!user) {
    return <Navigate to="/portal/login" replace />;
  }

  return <>{children}</>;
}
