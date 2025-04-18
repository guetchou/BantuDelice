
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
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
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
      };
      
      await pb.collection('users').create(data);
      
      // Auto login after registration
      await login(email, password);
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
