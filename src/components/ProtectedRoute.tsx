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
  // 'denied' = server explicitly rejected (403); 'error' = network/function failure
  const [denied, setDenied] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user || !session?.access_token) return;

    let cancelled = false;
    setVerifying(true);
    setVerifyError(null);

    fetch('/api/admin-verify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then(async (res) => {
        const data = (await res.json()) as VerifyResponse;
        if (cancelled) return;
        if (res.ok && data.authorized && data.role && data.permissions) {
          setAdminInfo(buildAdminStaffInfo(data.role, data.permissions, data.fullName));
        } else if (res.status === 403 || res.status === 401) {
          // Explicitly not authorised — sign out to clear the bad session
          void signOut();
          setDenied(true);
        } else {
          // Function deployed but returned unexpected error — show error, don't loop
          setVerifyError(data.message || `Verification failed (${res.status}). Try refreshing.`);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVerifyError('Could not reach the verification service. Check your connection or try again shortly.');
        }
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

  // Only redirect to login when there's no session at all, or when the server explicitly denied access
  if (!user || denied) {
    return <Navigate to="/admin/login" replace />;
  }

  // Network/function error — show message with retry, don't redirect (avoids loop)
  if (verifyError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-400 mb-4">{verifyError}</p>
          <button
            onClick={() => { setVerifyError(null); setAdminInfo(null); }}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm"
          >
            Retry
          </button>
          <button
            onClick={() => signOut()}
            className="ml-3 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (!adminInfo) {
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
