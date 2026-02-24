import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

const FALLBACK_SITE_URL = 'https://leeukopf.com';

const getAuthRedirectBaseUrl = (): string => {
  const configuredSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { origin, hostname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return FALLBACK_SITE_URL;
    }

    return origin.replace(/\/$/, '');
  }

  return FALLBACK_SITE_URL;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string, redirectPath?: string, shouldCreateUser?: boolean) => Promise<void>;
  requestPasswordReset: (email: string, redirectPath?: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle potential Supabase initialization errors gracefully
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase auth error:', error.message);
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Set to null to allow app to continue without auth
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    try {
      const authStateChange = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Safely access subscription from the response
      if (authStateChange?.data?.subscription) {
        const { data: { subscription } } = authStateChange;
        return () => {
          try {
            subscription.unsubscribe();
          } catch (error) {
            console.error('Error unsubscribing from auth changes:', error);
          }
        };
      } else {
        console.warn('Auth state change subscription not available');
        return () => {}; // Return empty cleanup function
      }
    } catch (error) {
      console.error('Failed to set up auth state listener:', error);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithMagicLink = async (
    email: string,
    redirectPath = '/portal',
    shouldCreateUser = false
  ) => {
    try {
      const baseUrl = getAuthRedirectBaseUrl();
      const normalizedPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
      const redirectTo = `${baseUrl}${normalizedPath}`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Magic link sign-in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string, redirectPath = '/admin/login') => {
    try {
      const normalizedPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
      const redirectTo = `${getAuthRedirectBaseUrl()}${normalizedPath}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithMagicLink, requestPasswordReset, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
