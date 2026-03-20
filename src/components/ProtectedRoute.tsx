import { type ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AdminStaffContext,
  buildAdminStaffInfo,
  type AdminPermissions,
} from '../contexts/AdminStaffContext';

interface VerifyResponse {
  authorized: boolean;
  role?: 'owner' | 'staff';
  fullName?: string;
  permissions?: AdminPermissions;
  message?: string;
}

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session, loading, signOut } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [adminInfo, setAdminInfo] = useState<ReturnType<typeof buildAdminStaffInfo> | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (loading || !user || !session?.access_token) return;

    let cancelled = false;
    setVerifying(true);

    fetch('/api/admin-verify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((res) => res.json() as Promise<VerifyResponse>)
      .then((data) => {
        if (cancelled) return;
        if (data.authorized && data.role && data.permissions) {
          setAdminInfo(buildAdminStaffInfo(data.role, data.permissions, data.fullName));
        } else {
          // Not authorised — sign out so they can't retry with the same token
          void signOut();
          setDenied(true);
        }
      })
      .catch(() => {
        if (!cancelled) setDenied(true);
      })
      .finally(() => {
        if (!cancelled) setVerifying(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, session?.access_token, loading]);

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!user || denied) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!adminInfo) {
    // Still waiting for verify result after auth loaded — show spinner
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400">Verifying access...</div>
      </div>
    );
  }

  return (
    <AdminStaffContext.Provider value={adminInfo}>
      {children}
    </AdminStaffContext.Provider>
  );
}
