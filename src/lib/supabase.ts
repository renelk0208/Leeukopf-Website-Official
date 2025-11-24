import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - some features will be disabled');
}

// Create a client even if env vars are missing to prevent app crashes
// Features requiring Supabase will fail gracefully
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
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
