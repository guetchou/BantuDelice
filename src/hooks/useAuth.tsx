
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import pb from '@/lib/pocketbase';
import { User } from '@/types/user';
import { toast } from 'sonner';

export interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; passwordConfirm: string; name: string; }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<UseAuthReturn | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated when the app loads
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (pb.authStore.isValid) {
          const userData = pb.authStore.model;
          setUser({
            id: userData?.id || '',
            email: userData?.email || '',
            name: userData?.name || '',
            role: userData?.role || 'user',
            created_at: userData?.created || '',
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const auth = await pb.collection('users').authWithPassword(email, password);
      
      setUser({
        id: auth.record.id,
        email: auth.record.email,
        name: auth.record.name,
        role: auth.record.role || 'user',
        created_at: auth.record.created,
      });
      
      toast.success('Connexion réussie');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Échec de la connexion');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; passwordConfirm: string; name: string; }) => {
    try {
      setLoading(true);
      const newUser = await pb.collection('users').create({
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        name: userData.name,
        role: 'user',
      });
      
      // Auto login after registration
      await login(userData.email, userData.password);
      
      toast.success('Inscription réussie');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Échec de l\'inscription');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    toast.info('Déconnexion réussie');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
