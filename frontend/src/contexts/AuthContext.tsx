
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: object) => Promise<any>;
  signOut: () => Promise<any>;
  logout: () => Promise<any>;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => ({}),
  logout: async () => ({}),
  loading: false,
  isLoading: false,
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

const LOCAL_USER_KEY = 'buntudelice_local_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Authentification locale fictive (mot de passe = "password")
    if (password === 'password') {
      const user = { email };
      setUser(user);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      return { user };
    } else {
      throw new Error('Identifiants invalides');
    }
  };

  const signUp = async (email: string, password: string, userData?: object) => {
    // Inscription locale fictive (accepte tout)
    const user = { email };
    setUser(user);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return { user };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    return {};
  };

  const logout = signOut;

  const value = {
    user,
    session: null,
    signIn,
    signUp,
    signOut,
    logout,
    loading,
    isLoading: loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
