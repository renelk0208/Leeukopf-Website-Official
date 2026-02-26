import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseConfigErrorMessage =
  'Authentication service is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.';

const isValidSupabaseUrl = (value: string): boolean => {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const supabaseUrl = isValidSupabaseUrl(rawSupabaseUrl)
  ? rawSupabaseUrl
  : 'https://placeholder.supabase.co';

const supabaseAnonKey = rawSupabaseAnonKey || 'placeholder-key';
export const isSupabaseConfigured = isValidSupabaseUrl(rawSupabaseUrl) && Boolean(rawSupabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    `${supabaseConfigErrorMessage} Supabase features will be degraded until fixed.`
  );
}

// Create a client even if env vars are missing to prevent app crashes
// Features requiring Supabase will fail gracefully
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  parent_category_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrochureRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  country: string;
  contact_number: string;
  category_name: string;
  category_slug: string;
  created_at: string;
}
