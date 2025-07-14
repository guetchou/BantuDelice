
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'restaurant_owner' | 'delivery_driver' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface ExtendedUserProfile extends UserProfile {
  // Additional properties if needed
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (profile) {
            setUser({
              id: profile.id,
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              email: authUser.email || '',
              phone: profile.phone,
              avatar_url: profile.avatar_url,
              role: profile.role || 'customer',
              created_at: profile.created_at,
              updated_at: profile.updated_at
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading };
}
