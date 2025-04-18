
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean; // Ajouté pour résoudre l'erreur dans Header.tsx
  login: (email: string, password: string) => Promise<{success: boolean}>;
  logout: () => void;
  register: (userData: any) => Promise<{success: boolean}>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({success: false}),
  logout: () => {},
  register: async () => ({success: false}),
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    if (pb.authStore.isValid) {
      const authData = pb.authStore.model;
      
      if (authData) {
        setUser({
          id: authData.id,
          email: authData.email,
          name: authData.name || '',
          phone: authData.phone,
          role: authData.role || 'user',
          created_at: authData.created,
          avatar_url: authData.avatar_url,
          first_name: authData.first_name,
          last_name: authData.last_name,
          status: authData.status,
        });
      }
    }
    
    setLoading(false);
    
    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (model) {
        setUser({
          id: model.id,
          email: model.email,
          name: model.name || '',
          phone: model.phone,
          role: model.role || 'user',
          created_at: model.created,
          avatar_url: model.avatar_url,
          first_name: model.first_name,
          last_name: model.last_name,
          status: model.status,
        });
      } else {
        setUser(null);
      }
    });
    
    return () => {
      // Clean up the subscription
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      setUser({
        id: authData.record.id,
        email: authData.record.email,
        name: authData.record.name || '',
        phone: authData.record.phone,
        role: authData.record.role || 'user',
        created_at: authData.record.created,
        avatar_url: authData.record.avatar_url,
        first_name: authData.record.first_name,
        last_name: authData.record.last_name,
        status: authData.record.status,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const register = async (userData: any) => {
    try {
      const data = {
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.password,
        name: userData.name,
        phone: userData.phone,
      };
      
      await pb.collection('users').create(data);
      
      // Auto login after registration
      await login(userData.email, userData.password);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isLoading: loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
