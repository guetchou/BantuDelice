
import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frwviexczcdkpusrhjdc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyd3ZpZXhjemNka3B1c3JoamRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMTU4MzEsImV4cCI6MjA1MTY5MTgzMX0.5345HC0DtubYgEttdirmp3Od8BP1ea1TQv5EaUG7Ujc';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Add helper functions for common operations
export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return supabase.auth.getUser();
};

export const getSession = async () => {
  return supabase.auth.getSession();
};

export default supabase;
