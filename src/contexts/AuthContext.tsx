
import React, { createContext, useContext, useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

interface AuthContextType {
  user: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, logout: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    // mise à jour à chaque changement d'auth
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    pb.authStore.clear();
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour l'utiliser facilement
export const useAuth = () => useContext(AuthContext);
