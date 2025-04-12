
import React, { createContext, useContext, useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types/user';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  register: (userData: { email: string; password: string; passwordConfirm: string; name?: string }) => Promise<{ success: boolean; error?: Error }>;
  updateProfile?: (data: Partial<User>) => Promise<{ success: boolean; error?: Error }>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  logout: () => {}, 
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false })
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const loadUser = async () => {
      try {
        if (pb.authStore.isValid) {
          const userData = pb.authStore.model;
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name || '',
              role: userData.role || 'user',
              created_at: userData.created || '',
              // Optional fields
              avatar_url: userData.avatar_url,
              first_name: userData.first_name,
              last_name: userData.last_name,
              status: userData.status || 'active',
              last_login: userData.last_login,
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (model) {
        setUser({
          id: model.id,
          email: model.email,
          name: model.name || '',
          role: model.role || 'user',
          created_at: model.created || '',
          // Optional fields
          avatar_url: model.avatar_url,
          first_name: model.first_name,
          last_name: model.last_name,
          status: model.status || 'active',
          last_login: model.last_login,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      // Cleanup subscription
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      const userData = pb.authStore.model;
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name || '',
          role: userData.role || 'user',
          created_at: userData.created || '',
          // Optional fields
          avatar_url: userData.avatar_url,
          first_name: userData.first_name,
          last_name: userData.last_name,
          status: userData.status || 'active',
          last_login: userData.last_login,
        });
      }
      toast.success("Connexion réussie", {
        description: "Bienvenue sur Buntudelice !",
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Échec de connexion", {
        description: "Veuillez vérifier vos identifiants.",
      });
      return { success: false, error: error as Error };
    }
  };

  const register = async (userData: { email: string; password: string; passwordConfirm: string; name?: string }) => {
    try {
      await pb.collection('users').create({
        ...userData,
        role: 'user',
      });
      toast.success("Inscription réussie", {
        description: "Votre compte a été créé avec succès.",
      });
      // Auto login after registration
      await login(userData.email, userData.password);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Échec d'inscription", {
        description: "Un problème est survenu lors de la création de votre compte.",
      });
      return { success: false, error: error as Error };
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await pb.collection('users').update(user.id, data);
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast.success("Profil mis à jour", {
        description: "Vos informations ont été mises à jour avec succès.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error("Erreur de mise à jour", {
        description: "Un problème est survenu lors de la mise à jour de votre profil.",
      });
      return { success: false, error: error as Error };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    toast.info("Déconnexion réussie", {
      description: "À bientôt sur Buntudelice !",
    });
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      logout, 
      isLoading,
      isAuthenticated: !!user,
      isAdmin,
      login,
      register,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
