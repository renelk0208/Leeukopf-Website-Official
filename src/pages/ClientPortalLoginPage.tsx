import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

const PORTAL_REMEMBER_EMAIL_KEY = 'leeukopf.portal.rememberedEmail';

function getAuthHashType(): string {
  if (typeof window === 'undefined') return '';
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return (hashParams.get('type') || '').toLowerCase();
}

export default function ClientPortalLoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithMagicLink, requestPasswordReset } = useAuth();
  const [showRegistrationGate, setShowRegistrationGate] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const mapAuthError = (authError: unknown, fallback: string) => {
    const raw = authError instanceof Error ? authError.message : '';
    const normalized = raw.toLowerCase();

    if (normalized.includes('not configured') || normalized.includes('placeholder.supabase.co')) {
      return 'Portal authentication is not configured in this deployment. Please contact support immediately.';
    }

    if (normalized.includes('failed to fetch') || normalized.includes('network')) {
      return 'Authentication service is unreachable right now. Check your internet connection and try again.';
    }

    if (normalized.includes('redirect') && normalized.includes('not allowed')) {
      return 'Portal login link configuration is incomplete. Please contact support to update the auth redirect URLs.';
    }

    if (normalized.includes('email rate limit exceeded')) {
      return 'Too many email requests were sent. Wait about a minute and try again.';
    }

    if (normalized.includes('email provider is disabled')) {
      return 'Email login is currently unavailable due to email provider configuration. Please contact support.';
    }

    if (normalized.includes('rate limit')) {
      return 'Too many email requests right now. Wait about a minute and try again, or ask admin to generate a manual invite link.';
    }

    return raw || fallback;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rememberedEmail = window.localStorage.getItem(PORTAL_REMEMBER_EMAIL_KEY) ?? '';
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const authHashType = getAuthHashType();
    if (authHashType === 'recovery' || authHashType === 'invite') {
      const targetUrl = `/portal/set-password${window.location.search}${window.location.hash}`;
      window.location.replace(targetUrl);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [navigate, user]);

  const persistRememberedEmail = (normalizedEmail: string) => {
    if (typeof window === 'undefined') return;

    if (rememberMe) {
      window.localStorage.setItem(PORTAL_REMEMBER_EMAIL_KEY, normalizedEmail);
      return;
    }

    window.localStorage.removeItem(PORTAL_REMEMBER_EMAIL_KEY);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setInfo('');

    if (!isSupabaseConfigured) {
      setError('Portal login is temporarily unavailable due to backend configuration. Please contact support.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUpMode) {
        const normalizedEmail = email.trim().toLowerCase();
        await signUp(normalizedEmail, password);
        persistRememberedEmail(normalizedEmail);
        navigate(`/portal/pending-approval?email=${encodeURIComponent(normalizedEmail)}`);
      } else {
        const normalizedEmail = email.trim().toLowerCase();
        await signIn(normalizedEmail, password);
        persistRememberedEmail(normalizedEmail);
      }
    } catch (submitError: unknown) {
      setError(
        mapAuthError(
          submitError,
          isSignUpMode ? 'Account creation failed. Please try again.' : 'Authentication failed. Please try again.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Enter your email first.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Portal login is temporarily unavailable due to backend configuration. Please contact support.');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');

    try {
      let lastError: unknown = null;
      for (const redirectPath of ['/portal', '/portal/login']) {
        try {
          await signInWithMagicLink(normalizedEmail, redirectPath, false);
          setInfo('Secure login link sent. Open your email and click the link to sign in.');
          return;
        } catch (magicLinkError: unknown) {
          lastError = magicLinkError;

          const message =
            magicLinkError instanceof Error ? magicLinkError.message.toLowerCase() : '';
          const isRedirectConfigIssue =
            message.includes('redirect') || message.includes('not allowed') || message.includes('invalid redirect');

          if (!isRedirectConfigIssue) {
            throw magicLinkError;
          }
        }
      }

      throw lastError ?? new Error('Could not send login link.');
    } catch (magicLinkError: unknown) {
      setError(mapAuthError(magicLinkError, 'Could not send login link. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Enter your email first.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Portal login is temporarily unavailable due to backend configuration. Please contact support.');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');

    try {
      let lastError: unknown = null;
      for (const redirectPath of ['/portal/set-password', '/portal/login']) {
        try {
          await requestPasswordReset(normalizedEmail, redirectPath);
          setInfo('Password reset email sent. Use the link in your inbox to set a new password.');
          return;
        } catch (resetError: unknown) {
          lastError = resetError;

          const message = resetError instanceof Error ? resetError.message.toLowerCase() : '';
          const isRedirectConfigIssue =
            message.includes('redirect') || message.includes('not allowed') || message.includes('invalid redirect');

          if (!isRedirectConfigIssue) {
            throw resetError;
          }
        }
      }

      throw lastError ?? new Error('Could not send password reset email.');
    } catch (resetError: unknown) {
      setError(mapAuthError(resetError, 'Could not send password reset email. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      {showRegistrationGate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-grey-card bg-white p-6 shadow-xl sm:p-8">
            <h2 className="text-2xl font-bold text-grey-primary">Portal Access Requirements</h2>
            <p className="mt-3 text-sm text-grey-secondary">
              To access the B2B portal, your client registration form must be completed and submitted.
            </p>
            <p className="mt-2 text-sm text-grey-secondary">
              New registrations are reviewed by Leeukopf before portal access is approved.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/client-registration"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90"
              >
                Complete Registration Form
              </Link>
              <button
                type="button"
                onClick={() => setShowRegistrationGate(false)}
                className="inline-flex items-center justify-center rounded-md border border-grey-card px-4 py-2 font-semibold text-grey-primary transition hover:bg-gray-50"
              >
                I have already submitted
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-xl rounded-2xl border border-grey-card bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold text-grey-primary">Leeukopf Client Portal</h1>
          <p className="mt-1 text-sm text-grey-secondary">Secure access for approved clients.</p>
        </div>
        <h2 className="text-2xl font-bold text-grey-primary">{isSignUpMode ? 'Create account' : 'Sign in'}</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          {isSignUpMode
            ? 'Create your login first. Your account is activated only after admin approval.'
            : 'Use your approved client email and password.'}
        </p>
        <div className="mt-4 rounded-md border border-primary-100 bg-primary-50 px-3 py-2 text-sm text-grey-primary">
          <p className="font-semibold">Client flow:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>Register your company.</li>
            <li>Create your portal account here.</li>
            <li>Wait for approval from Leeukopf.</li>
            <li>Order stock after approval.</li>
          </ul>
        </div>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}
        {info ? (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="portal-email" className="mb-1 block text-sm font-medium text-grey-primary">
              Email
            </label>
            <input
              id="portal-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary focus:border-primary focus:outline-none"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label htmlFor="portal-password" className="mb-1 block text-sm font-medium text-grey-primary">
              Password
            </label>
            <input
              id="portal-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete={isSignUpMode ? 'new-password' : 'current-password'}
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary focus:border-primary focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-grey-secondary">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-grey-card text-primary focus:ring-primary"
            />
            Remember my email
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isSignUpMode ? 'Create account' : 'Sign in'}
          </button>

          {!isSignUpMode ? (
            <button
              type="button"
              onClick={() => void handleMagicLink()}
              disabled={loading}
              className="w-full rounded-md border border-primary-200 px-4 py-2 font-semibold text-primary transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'First login? Email me a secure sign-in link'}
            </button>
          ) : null}

          {!isSignUpMode ? (
            <button
              type="button"
              onClick={() => void handleForgotPassword()}
              disabled={loading}
              className="w-full rounded-md border border-primary-200 px-4 py-2 font-semibold text-primary transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'Forgot password? Send reset email'}
            </button>
          ) : null}
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <button
            type="button"
            onClick={() => {
              setIsSignUpMode((prev) => !prev);
              setError('');
            }}
            className="font-medium text-primary hover:text-primary-700"
          >
            {isSignUpMode ? 'Already have an account? Sign in' : 'New client? Create account'}
          </button>
          <Link to="/portal/register" className="font-medium text-primary hover:text-primary-700">
            Submit company registration
          </Link>
        </div>
      </div>
    </div>
  );
}
