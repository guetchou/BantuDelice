
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { User, UserCreateRequest } from '@/types/user';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin?: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: Error }>;
  updateProfile?: (data: Partial<User>) => Promise<{ success: boolean; error?: Error }>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated on initial load
    const loadUser = async () => {
      try {
        if (pb.authStore.isValid) {
          const userData = pb.authStore.model;
          setUser({
            id: userData?.id,
            email: userData?.email,
            name: userData?.name,
            created: userData?.created,
            role: userData?.role || 'user',
            // Add other properties as needed
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange(() => {
      if (pb.authStore.isValid) {
        const userData = pb.authStore.model;
        setUser({
          id: userData?.id,
          email: userData?.email,
          name: userData?.name,
          created: userData?.created,
          role: userData?.role || 'user',
          // Add other properties as needed
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      // Clean up subscription
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      const userData = pb.authStore.model;
      setUser({
        id: userData?.id,
        email: userData?.email,
        name: userData?.name,
        created: userData?.created,
        role: userData?.role || 'user',
        // Add other properties as needed
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error as Error };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }) => {
    try {
      const data = {
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.password,
        name: userData.name || '',
      };
      
      await pb.collection('users').create(data);
      // Auto login after registration
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error as Error };
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await pb.collection('users').update(user.id, data);
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error as Error };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return {
    user,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    logout,
    register,
    updateProfile
  };
};

export default useAuth;
