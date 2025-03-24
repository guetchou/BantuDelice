
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import pb from '../lib/pocketbase';
import { toast } from 'sonner';

// Define user type
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(pb.authStore.model);
  const [isLoading, setIsLoading] = useState(true);

  // Check for user session on component mount
  useEffect(() => {
    setIsLoading(true);
    try {
      // Get session from PocketBase
      setUser(pb.authStore.model);
    } catch (error) {
      console.error('Error getting session:', error);
    } finally {
      setIsLoading(false);
    }

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await pb.collection('users').authWithPassword(email, password);
      toast.success("Connexion réussie !");
    } catch (error) {
      console.error('Error signing in:', error);
      // Let the calling component handle the error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name
      };
      await pb.collection('users').create(data);
      // Automatically sign in after registration
      await pb.collection('users').authWithPassword(email, password);
      toast.success("Inscription réussie !");
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      pb.authStore.clear();
      toast.success("Déconnexion réussie !");
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
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
