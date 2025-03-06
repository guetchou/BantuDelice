
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'superadmin';
  created_at: string;
  avatar_url?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get the user profile
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            
            // Create a profile if it doesn't exist
            if (error.code === 'PGRST116') {
              const { data: userData } = await supabase.auth.getUser();
              const { data: insertData, error: insertError } = await supabase
                .from('user_profiles')
                .insert({
                  id: user.id,
                  email: userData.user?.email,
                  role: 'user',
                  first_name: userData.user?.user_metadata?.first_name,
                  last_name: userData.user?.user_metadata?.last_name,
                })
                .select()
                .single();
              
              if (insertError) {
                console.error('Error creating user profile:', insertError);
              } else {
                setUser(insertData as UserProfile);
              }
            }
          } else {
            setUser(data as UserProfile);
          }
        }
      } catch (error) {
        console.error('Error in useUser hook:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          getUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profil mis à jour avec succès');
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return { data: null, error };
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };

  return { 
    user, 
    loading, 
    updateProfile,
    isAdmin,
    isSuperAdmin
  };
};
