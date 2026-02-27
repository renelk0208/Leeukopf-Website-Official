import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const APPROVAL_CACHE_KEY = 'leeukopf.portal.approval-cache.v1';
const APPROVAL_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

type ApprovalState = 'checking' | 'approved' | 'pending' | 'error';

type ApprovalCacheRecord = {
  email: string;
  approvedAt: number;
};

function readApprovalCache(email: string): boolean {
  if (typeof window === 'undefined' || !email) return false;

  try {
    const raw = window.localStorage.getItem(APPROVAL_CACHE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as ApprovalCacheRecord;
    if (parsed.email !== email.toLowerCase()) return false;

    const isFresh = Date.now() - parsed.approvedAt <= APPROVAL_CACHE_TTL_MS;
    return isFresh;
  } catch {
    return false;
  }
}

function writeApprovalCache(email: string) {
  if (typeof window === 'undefined' || !email) return;

  const payload: ApprovalCacheRecord = {
    email: email.toLowerCase(),
    approvedAt: Date.now(),
  };

  window.localStorage.setItem(APPROVAL_CACHE_KEY, JSON.stringify(payload));
}

function clearApprovalCache() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(APPROVAL_CACHE_KEY);
}

interface ClientPortalProtectedRouteProps {
  children: ReactNode;
}

export default function ClientPortalProtectedRoute({ children }: ClientPortalProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [approvalState, setApprovalState] = useState<ApprovalState>('checking');
  const [retrySeed, setRetrySeed] = useState(0);

  useEffect(() => {
    const email = user?.email?.trim().toLowerCase() ?? '';

    if (!email) {
      setApprovalState('pending');
      clearApprovalCache();
      return;
    }

    let active = true;

    const checkApproval = async () => {
      setApprovalState('checking');

      try {
        const result = await supabase
          .from('approved_clients')
          .select('email')
          .ilike('email', email)
          .maybeSingle();

        if (!active) return;

        if (result.error) {
          throw result.error;
        }

        if (result.data) {
          writeApprovalCache(email);
          setApprovalState('approved');
          return;
        }

        clearApprovalCache();
        setApprovalState('pending');
      } catch (error) {
        console.error('Portal approval check failed:', error);

        if (readApprovalCache(email)) {
          setApprovalState('approved');
          return;
        }

        setApprovalState('error');
      }
    };

    void checkApproval();

    return () => {
      active = false;
    };
  }, [retrySeed, user?.email]);

  if (loading || approvalState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-grey-secondary">Loading portal...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/portal/login" replace />;
  }

  if (approvalState === 'pending') {
    const pendingEmail = user.email ? `?email=${encodeURIComponent(user.email)}` : '';
    return <Navigate to={`/portal/pending-approval${pendingEmail}`} replace />;
  }

  if (approvalState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-xl rounded-2xl border border-grey-card bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-grey-primary">We’re having trouble verifying portal access</h1>
          <p className="mt-2 text-sm text-grey-secondary">
            Your account is signed in, but approval check is temporarily unavailable. Please retry now.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRetrySeed((prev) => prev + 1)}
              className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90"
            >
              Retry access check
            </button>
            <button
              type="button"
              onClick={() => window.location.assign('/portal/login')}
              className="rounded-md border border-grey-card px-4 py-2 font-semibold text-grey-primary hover:bg-gray-50"
            >
              Return to portal login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
