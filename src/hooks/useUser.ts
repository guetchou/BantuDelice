
import { useEffect, useState } from 'react';
import { User, UserStatus, UserRole } from '@/types/user';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  created_at: string;
  avatar_url?: string;
  status: UserStatus;
  phone?: string;
  last_login?: string;  // Ajout de la propriété last_login optionnelle
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
      // Convertir les mises à jour au format attendu par userService
      const userUpdates = {
        first_name: updates.first_name,
        last_name: updates.last_name,
        role: updates.role,
        status: updates.status,
        phone: updates.phone,
        avatar_url: updates.avatar_url
      };

      const updatedUser = await userService.updateUser(user.id, userUpdates);
      
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
