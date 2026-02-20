import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import { useAuth } from '../contexts/AuthContext';

export default function ClientPortalLoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        await signUp(email.trim(), password);
        setSuccess('Account created. Check your email if confirmation is required, then sign in.');
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        await signIn(email.trim(), password);
      }
    } catch (submitError: unknown) {
      if (submitError instanceof Error && submitError.message) {
        setError(submitError.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate
      title="Client Portal"
      subtitle="Sign in to view previous orders, saved details, and reorder quickly."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Client Portal' },
      ]}
    >
      <div className="mx-auto max-w-xl rounded-2xl border border-grey-card bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-grey-primary">{isSignUp ? 'Create account' : 'Sign in'}</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          {isSignUp ? 'Create portal access for your company email.' : 'Use your registered client email and password.'}
        </p>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>
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

          {isSignUp ? (
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
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary focus:border-primary focus:outline-none"
                placeholder="Repeat password"
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <button
            type="button"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              setError('');
              setSuccess('');
            }}
            className="font-medium text-primary hover:text-primary-700"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
          <Link to="/client-registration" className="text-grey-secondary hover:text-primary">
            New here? Register client details
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}
