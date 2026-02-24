import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, signIn, signUp, requestPasswordReset, updatePassword } = useAuth();
  const [isRecoveryMode, setIsRecoveryMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return hashParams.get('type') === 'recovery';
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetShortcut, setShowResetShortcut] = useState(false);

  const getErrorMessage = (err: unknown, context: 'signin' | 'signup' | 'recovery' | 'forgot-password') => {
    const raw = err instanceof Error ? err.message : '';
    const normalized = raw.toLowerCase();

    if (normalized.includes('rate limit')) {
      if (context === 'signup') {
        return 'Too many account creation attempts. If this admin email already exists, use password reset instead.';
      }

      if (context === 'forgot-password') {
        return 'Too many reset requests right now. Wait a minute and try again.';
      }

      return 'Too many attempts right now. Wait a minute and try again.';
    }

    if (context === 'signup' && normalized.includes('user already registered')) {
      return 'This admin email already exists. Use sign in or password reset.';
    }

    if (context === 'signin') {
      return 'Invalid email or password';
    }

    if (context === 'recovery') {
      return raw || 'Error updating password';
    }

    if (context === 'forgot-password') {
      return raw || 'Unable to send password reset email';
    }

    return raw || 'Something went wrong. Please try again.';
  };

  useEffect(() => {
    if (user && !isRecoveryMode) {
      navigate('/admin');
    }
  }, [user, isRecoveryMode, navigate]);

  const clearRecoveryHash = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');
    setShowResetShortcut(false);

    if (!email.trim()) {
      setError('Enter your email address first');
      return;
    }

    setLoading(true);

    try {
      await requestPasswordReset(email.trim());
      setSuccess('Password reset email sent. Check your inbox for the recovery link.');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'forgot-password'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowResetShortcut(false);
    setLoading(true);

    try {
      if (isRecoveryMode) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        await updatePassword(password);
        clearRecoveryHash();
        setIsRecoveryMode(false);
        setPassword('');
        setConfirmPassword('');
        setSuccess('Password updated successfully. You can now sign in.');
      } else if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await signUp(email, password);
        setSuccess('Account created successfully! You can now sign in.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        await signIn(email, password);
      }
    } catch (err: unknown) {
      if (isRecoveryMode) {
        setError(getErrorMessage(err, 'recovery'));
      } else if (isSignUp) {
        setError(getErrorMessage(err, 'signup'));
        setShowResetShortcut(true);
      } else {
        setError(getErrorMessage(err, 'signin'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              <Lock className="text-cyan-400" size={40} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            {isRecoveryMode ? 'Reset Admin Password' : (isSignUp ? 'Create Admin Account' : 'Admin Login')}
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {isRecoveryMode
              ? 'Enter your new password to complete recovery'
              : (isSignUp ? 'Register to manage your website' : 'Sign in to manage your website')}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isRecoveryMode && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="admin@leeukopf.com"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                {isRecoveryMode ? 'New Password' : 'Password'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRecoveryMode || isSignUp ? 'new-password' : 'current-password'}
                className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder={isRecoveryMode ? 'At least 6 characters' : (isSignUp ? 'At least 6 characters' : 'Enter your password')}
                required
              />
            </div>

            {(isSignUp || isRecoveryMode) && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (isRecoveryMode ? 'Updating Password...' : (isSignUp ? 'Creating Account...' : 'Signing In...'))
                : (isRecoveryMode ? 'Update Password' : (isSignUp ? 'Create Account' : 'Sign In'))}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {!isRecoveryMode && (
              <>
                {!isSignUp && (
                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Forgot password?
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setSuccess('');
                    setShowResetShortcut(false);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>

                {showResetShortcut && isSignUp && (
                  <button
                    onClick={handleForgotPassword}
                    disabled={loading || !email.trim()}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send password reset instead
                  </button>
                )}
              </>
            )}
            <div>
              <button
                onClick={() => window.location.href = '/'}
                className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                ← Back to Website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
