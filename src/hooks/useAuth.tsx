
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define user type
interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for user session on component mount
  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true);
      try {
        // Get session from Supabase/mock
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
        } else if (data?.user) {
          setUser(data.user as User);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getInitialSession();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else if (data?.user) {
        setUser(data.user as User);
        toast.success('Signed in successfully');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed up successfully! Please check your email for confirmation.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        setUser(null);
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('An error occurred during sign out');
    }
  };

  // Create auth context value
  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  // Provide auth context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
