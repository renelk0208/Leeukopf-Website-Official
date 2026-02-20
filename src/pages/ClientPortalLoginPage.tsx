import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ClientPortalLoginPage() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [navigate, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email.trim(), password);
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
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl rounded-2xl border border-grey-card bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold text-grey-primary">Leeukopf Client Portal</h1>
          <p className="mt-1 text-sm text-grey-secondary">Secure access for approved clients.</p>
        </div>
        <h2 className="text-2xl font-bold text-grey-primary">Sign in</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          Use your invited client email and password.
        </p>
        <div className="mt-4 rounded-md border border-primary-100 bg-primary-50 px-3 py-2 text-sm text-grey-primary">
          Portal access is invite-only. After registration review, your company receives an email invitation to activate login.
        </div>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
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
            {loading ? 'Please wait...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-5 text-sm">
          <Link to="/client-registration" className="font-medium text-primary hover:text-primary-700">
            Need access? Submit client registration
          </Link>
        </div>
      </div>
    </div>
  );
}
