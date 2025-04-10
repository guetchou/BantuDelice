
import React, { createContext, useContext, useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types/user';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  register: (userData: { email: string; password: string; passwordConfirm: string; name?: string }) => Promise<{ success: boolean; error?: Error }>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  logout: () => {}, 
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false })
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    const loadUser = async () => {
      try {
        if (pb.authStore.isValid) {
          const userData = pb.authStore.model;
          setUser({
            id: userData?.id,
            email: userData?.email,
            name: userData?.name,
            // Add more properties as needed
          });
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
          name: model.name,
          // Add more properties as needed
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
          name: userData.name,
          // Add more properties as needed
        });
      }
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Buntudelice !",
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Échec de connexion",
        description: "Veuillez vérifier vos identifiants.",
        variant: "destructive",
      });
      return { success: false, error: error as Error };
    }
  };

  const register = async (userData: { email: string; password: string; passwordConfirm: string; name?: string }) => {
    try {
      await pb.collection('users').create(userData);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      // Auto login after registration
      await login(userData.email, userData.password);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Échec d'inscription",
        description: "Un problème est survenu lors de la création de votre compte.",
        variant: "destructive",
      });
      return { success: false, error: error as Error };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur Buntudelice !",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      logout, 
      isLoading,
      isAuthenticated: !!user,
      login,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
