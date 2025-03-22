
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'superadmin' | 'restaurant_owner' | 'driver';
  created_at: string;
  avatar_url?: string;
  status: string;
  phone?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Vérifier si l'utilisateur est déjà connecté
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser) as User;
          setUser(userData as UserProfile);
        }
      } catch (error) {
        console.error('Error in useUser hook:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const updatedUser = await userService.updateUser(user.id, updates);
      
      if (!updatedUser) {
        throw new Error('Failed to update profile');
      }

      setUser(prev => prev ? { ...prev, ...updatedUser } as UserProfile : null);
      
      // Mettre à jour également l'utilisateur dans le localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({ ...userData, ...updatedUser }));
      }
      
      toast.success('Profil mis à jour avec succès');
      return { data: updatedUser, error: null };
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

  const isRestaurantOwner = () => {
    return user?.role === 'restaurant_owner';
  };

  const isDriver = () => {
    return user?.role === 'driver';
  };

  return { 
    user, 
    loading, 
    updateProfile,
    isAdmin,
    isSuperAdmin,
    isRestaurantOwner,
    isDriver
  };
};
