
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types/user';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  logout: () => void;
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
        // Add other properties as needed
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error as Error };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};

export default useAuth;
