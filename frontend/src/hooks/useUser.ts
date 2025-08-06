import { useState, useEffect } from 'react';
import { useColisAuth } from '@/context/ColisAuthContext';
import { User, UserProfile, ExtendedUserProfile } from '@/types/globalTypes';

export const useUser = () => {
  const { user: authUser } = useColisAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        first_name: authUser.name || '',
        last_name: '',
        phone: authUser.phone || ''
      });
    } else {
      setUser(null);
    }
  }, [authUser]);

  return { user };
};
