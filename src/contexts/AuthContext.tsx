import React, { createContext, useContext, useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

interface AuthContextType {
  user: any;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    // mise à jour à chaque changement d'auth
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour l'utiliser facilement
export const useAuth = () => useContext(AuthContext);
