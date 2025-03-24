
import pb from '../lib/pocketbase';

/**
 * Check if a user is authenticated
 * @returns Promise resolving to user object or null
 */
export const checkAuth = async () => {
  try {
    if (!pb.authStore.isValid) {
      return null;
    }
    
    return pb.authStore.model;
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
    
    // Récupérer les rôles de l'utilisateur depuis PocketBase
    // Note: Vous devez adapter ceci selon la structure de vos données dans PocketBase
    const { data, error } = await pb
      .collection('user_roles')
      .getList(1, 50, {
        filter: `user_id="${user.id}" && role="${role}"`
      });
      
    if (error) {
      console.error('Error checking role:', error);
      return false;
    }
    
    return data.length > 0;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};
