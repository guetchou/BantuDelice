
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export const useUser = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.user_metadata?.first_name || '',
        last_name: authUser.user_metadata?.last_name || '',
        phone: authUser.user_metadata?.phone || ''
      });
    } else {
      setUser(null);
    }
  }, [authUser]);

  return { user };
};
