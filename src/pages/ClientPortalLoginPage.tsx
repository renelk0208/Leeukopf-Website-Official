import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ClientPortalLoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (isSignUpMode) {
        const normalizedEmail = email.trim().toLowerCase();
        await signUp(normalizedEmail, password);
        navigate(`/portal/pending-approval?email=${encodeURIComponent(normalizedEmail)}`);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (submitError: unknown) {
      if (submitError instanceof Error && submitError.message) {
        setError(submitError.message);
      } else {
        setError(isSignUpMode ? 'Account creation failed. Please try again.' : 'Authentication failed. Please try again.');
      }
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

    setLoading(true);
    setError('');
    setInfo('');

    try {
      await signInWithMagicLink(normalizedEmail, '/portal', false);
      setInfo('Secure login link sent. Open your email and click the link to sign in.');
    } catch (magicLinkError: unknown) {
      if (magicLinkError instanceof Error && magicLinkError.message) {
        setError(magicLinkError.message);
      } else {
        setError('Could not send login link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
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
          Client flow: 1) Register your company, 2) create portal account here, 3) wait for approval, 4) order stock after approval.
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
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary focus:border-primary focus:outline-none"
              placeholder="Enter password"
            />
          </div>

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
