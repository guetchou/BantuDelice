
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch the user profile from the profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          setUser({
            id: user.id,
            email: user.email,
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
            phone: data?.phone || '',
            avatar_url: data?.avatar_url || '',
            address: data?.address || '',
            role: data?.role || 'customer',
            status: data?.status || 'active',
            last_login: user.last_sign_in_at || '',
            created_at: user.created_at || '',
            updated_at: data?.updated_at || '',
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  return { user, loading, error };
};

export default useUser;
