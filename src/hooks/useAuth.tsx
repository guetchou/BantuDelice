
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import pb from '@/lib/pocketbase';
import { authService } from '@/services/pocketbaseService';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
  register: (email: string, password: string, userData: Record<string, any>) => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(pb.authStore.model);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial authentication state
    setUser(pb.authStore.model);
    setLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.login(email, password);
      if (error) {
        toast("Échec de connexion", {
          description: "Vérifiez vos identifiants et réessayez.",
        });
        return { success: false, error };
      }
      
      setUser(data.record);
      toast("Connexion réussie", {
        description: "Bienvenue dans votre espace."
      });
      return { success: true };
    } catch (error) {
      toast("Erreur de connexion", {
        description: "Une erreur inattendue s'est produite.",
      });
      return { success: false, error };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast("Déconnexion réussie");
  };

  const register = async (email: string, password: string, userData: Record<string, any>) => {
    try {
      const { data, error } = await authService.register(email, password, userData);
      if (error) {
        toast("Échec d'inscription", {
          description: "Vérifiez vos données et réessayez.",
        });
        return { success: false, error };
      }
      
      toast("Inscription réussie", {
        description: "Vous pouvez maintenant vous connecter.",
      });
      return { success: true };
    } catch (error) {
      toast("Erreur d'inscription", {
        description: "Une erreur inattendue s'est produite.",
      });
      return { success: false, error };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
