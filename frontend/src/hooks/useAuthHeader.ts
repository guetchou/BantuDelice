
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';

export const useAuthHeader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model);
    }
    
    setIsLoading(false);

    // Subscribe to auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    pb.authStore.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user, 
    handleLogout
  };
};
