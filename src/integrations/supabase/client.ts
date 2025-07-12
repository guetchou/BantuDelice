
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***' : 'undefined');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Authentication Wrapper Functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
  },
  
  register: async (email: string, password: string, data?: any) => {
    return await supabase.auth.signUp({ 
      email, 
      password, 
      options: { 
        data, 
        emailRedirectTo: window.location.origin 
      } 
    });
  },
  
  logout: async () => {
    return await supabase.auth.signOut();
  },
  
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },
  
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  updateProfile: async (updates: any) => {
    return await supabase.auth.updateUser({
      data: updates
    });
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
  },

  signInWithOtp: async (email: string) => {
    return await supabase.auth.signInWithOtp({ 
      email, 
      options: { 
        emailRedirectTo: window.location.origin 
      } 
    });
  }
};
