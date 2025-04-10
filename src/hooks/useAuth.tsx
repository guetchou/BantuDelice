
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          const userData = pb.authStore.model;
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name || '',
              phone: userData.phone || '',
              role: userData.role || 'user',
              created_at: userData.created_at || new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    pb.authStore.onChange(() => {
      if (pb.authStore.isValid && pb.authStore.model) {
        const userData = pb.authStore.model;
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name || '',
          phone: userData.phone || '',
          role: userData.role || 'user',
          created_at: userData.created_at || new Date().toISOString()
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Register
  const register = async (data: RegisterData) => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        name: data.name || '',
        phone: data.phone || '',
      };
      
      await pb.collection('users').create(userData);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé",
      });
      
      // Auto login
      await login(data.email, data.password);
    } catch (error: any) {
      console.error('Register error:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout
  const logout = () => {
    pb.authStore.clear();
    toast({
      title: "Déconnexion",
      description: "Vous êtes maintenant déconnecté",
    });
  };

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("Vous devez être connecté");
    
    try {
      await pb.collection('users').update(user.id, data);
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour",
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
