
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created?: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Convert PocketBase user model to our User type
    const convertPbUser = (pbUser: any): User | null => {
      if (!pbUser) return null;
      
      return {
        id: pbUser.id,
        email: pbUser.email || '',
        name: pbUser.name || pbUser.username || '',
        avatar: pbUser.avatar,
        created: pbUser.created,
        role: pbUser.role
      };
    };

    // Check initial auth state
    setUser(convertPbUser(pb.authStore.model));
    setIsLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(convertPbUser(model));
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    pb.authStore.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
};

export default useAuth;
