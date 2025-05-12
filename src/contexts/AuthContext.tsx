
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: object) => Promise<any>;
  signOut: () => Promise<any>;
  logout: () => Promise<any>; // Alias for signOut
  loading: boolean;
  isLoading: boolean; // Added missing property
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => ({}),
  logout: async () => ({}), // Alias for signOut
  loading: true,
  isLoading: true, // Added missing property
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, userData?: object) => {
    return supabase.auth.signUp({ 
      email, 
      password, 
      options: userData ? { data: userData } : undefined 
    });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };
  
  // Alias for signOut to maintain compatibility
  const logout = signOut;

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    logout,
    loading,
    isLoading: loading, // Set isLoading to the same value as loading
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
