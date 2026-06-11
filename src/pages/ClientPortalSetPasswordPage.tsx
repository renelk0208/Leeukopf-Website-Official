import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function getAuthHashType(): string {
  if (typeof window === 'undefined') return '';
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return (hashParams.get('type') || '').toLowerCase();
}

function clearAuthHash() {
  if (typeof window !== 'undefined' && window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

export default function ClientPortalSetPasswordPage() {
  const navigate = useNavigate();
  const { user, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const hashType = useMemo(() => getAuthHashType(), []);
  const canSetPassword = hashType === 'invite' || hashType === 'recovery' || !!user;

  useEffect(() => {
    if (!loading && !user && (hashType === 'invite' || hashType === 'recovery')) {
      setError('This setup link is invalid or expired. Please request a new invite link.');
    }
  }, [hashType, loading, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!canSetPassword) {
      setError('Please open the password setup link from your invite email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);

    try {
      await updatePassword(password);
      clearAuthHash();
      setSuccess('Password saved successfully. Redirecting to your portal...');

      setTimeout(() => {
        navigate('/portal');
      }, 900);
    } catch (saveError: unknown) {
      if (saveError instanceof Error && saveError.message) {
        setError(saveError.message);
      } else {
        setError('Unable to save password. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-xl rounded-2xl border border-grey-card bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-grey-secondary">Loading account setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl rounded-2xl border border-grey-card bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-grey-primary">Set your portal password</h1>
        <p className="mt-1 text-sm text-grey-secondary">
          Create a password once so you can sign in faster in the future.
        </p>

        <div className="mt-4 rounded-md border border-primary-100 bg-primary-50 px-3 py-2 text-sm text-grey-primary">
          Email: <span className="font-semibold">{user?.email ?? 'Not available'}</span>
        </div>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="portal-new-password" className="mb-1 block text-sm font-medium text-grey-primary">
              New password
            </label>
            <input
              id="portal-new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary focus:border-primary focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="portal-confirm-password" className="mb-1 block text-sm font-medium text-grey-primary">
              Confirm password
            </label>
            <input
              id="portal-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary focus:border-primary focus:outline-none"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !canSetPassword}
            className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save password'}
          </button>
        </form>

        <div className="mt-5 text-sm">
          <Link to="/portal/login" className="font-medium text-primary hover:text-primary-700">
            Back to portal login
          </Link>
        </div>
      </div>
    </div>
  );
}
