import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

interface ColisUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface ColisAuthContextType {
  user: ColisUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<ColisUser>) => void;
}

const ColisAuthContext = createContext<ColisAuthContextType | undefined>(undefined);

export const useColisAuth = () => {
  const context = useContext(ColisAuthContext);
  if (context === undefined) {
    throw new Error('useColisAuth must be used within a ColisAuthProvider');
  }
  return context;
};

interface ColisAuthProviderProps {
  children: React.ReactNode;
}

export const ColisAuthProvider: React.FC<ColisAuthProviderProps> = React.memo(({ children }) => {
  const [user, setUser] = useState<ColisUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialisation mémorisée
  const initializeAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('colis_token');
      const userData = localStorage.getItem('colis_user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      // Nettoyer les données corrompues
      localStorage.removeItem('colis_token');
      localStorage.removeItem('colis_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Fonction de login mémorisée
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Tentative de connexion avec:', { email, password: '[HIDDEN]' });
      
      const apiUrl = `/api/auth/login`; // Using Vite proxy
      console.log('URL de l\'API:', apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('Réponse du serveur:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur serveur:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', { user: data.user, hasToken: !!data.access_token });
      
      localStorage.setItem('colis_token', data.access_token);
      localStorage.setItem('colis_user', JSON.stringify(data.user));
      setUser(data.user);
      
      console.log('Connexion réussie');
      return true;
    } catch (error: unknown) {
      if (error.name === 'AbortError') {
        console.error('Timeout lors de la connexion');
      } else {
        console.error('Login error:', error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction de register mémorisée
  const register = useCallback(async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    address?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Tentative d\'inscription avec:', { ...userData, password: '[HIDDEN]' });
      
      const apiUrl = `/api/auth/register`; // Using Vite proxy
      console.log('URL de l\'API:', apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('Réponse du serveur:', response.status, response.statusText);
      console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur serveur:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', { user: data.user, hasToken: !!data.access_token });
      
      localStorage.setItem('colis_token', data.access_token);
      localStorage.setItem('colis_user', JSON.stringify(data.user));
      setUser(data.user);
      
      console.log('Utilisateur enregistré avec succès');
      return true;
    } catch (error: unknown) {
      if (error.name === 'AbortError') {
        console.error('Timeout lors de l\'inscription');
      } else {
        console.error('Register error:', error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction de logout mémorisée
  const logout = useCallback(() => {
    localStorage.removeItem('colis_token');
    localStorage.removeItem('colis_user');
    setUser(null);
    console.log('Déconnexion réussie');
  }, []);

  // Fonction de mise à jour utilisateur mémorisée
  const updateUser = useCallback((userData: Partial<ColisUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('colis_user', JSON.stringify(updatedUser));
    }
  }, [user]);

  // Valeur du contexte mémorisée
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser
  }), [user, loading, login, register, logout, updateUser]);

  return (
    <ColisAuthContext.Provider value={contextValue}>
      {children}
    </ColisAuthContext.Provider>
  );
});

ColisAuthProvider.displayName = 'ColisAuthProvider'; 