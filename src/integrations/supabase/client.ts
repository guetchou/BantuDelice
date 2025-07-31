
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication Wrapper Functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return await supabase.auth.signInWithOtp({ 
      email, 
      options: { 
        emailRedirectTo: window.location.origin 
      } 
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
  }
};

export default supabase;
