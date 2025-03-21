
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user is authenticated
 * @returns Promise resolving to user object or null
 */
export const checkAuth = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Error checking auth:', error);
    return null;
  }
};

/**
 * Get user ID if authenticated
 * @returns Promise resolving to user ID or null
 */
export const getUserId = async (): Promise<string | null> => {
  const user = await checkAuth();
  return user?.id || null;
};

/**
 * Check if the user has a specific role
 * @param role Role to check for
 * @returns Promise resolving to boolean
 */
export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const user = await checkAuth();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', role)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};
