
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Vérifier si l'utilisateur est déjà connecté (stocké dans localStorage)
        const storedUser = localStorage.getItem('admin_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const authenticatedUser = await userService.authenticate(email, password);
      
      if (!authenticatedUser) {
        toast.error("Identifiants invalides");
        return false;
      }
      
      // Vérifier si l'utilisateur est un admin ou superadmin
      if (!userService.isAdmin(authenticatedUser)) {
        toast.error("Vous n'avez pas les droits d'administration");
        return false;
      }

      setUser(authenticatedUser);
      localStorage.setItem('admin_user', JSON.stringify(authenticatedUser));
      toast.success(`Bienvenue, ${authenticatedUser.first_name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erreur lors de la connexion");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    toast.info("Vous avez été déconnecté");
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: userService.isSuperAdmin(user),
    isAdmin: userService.isAdmin(user)
  };
};
