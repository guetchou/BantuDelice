
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';

export const useUser = () => {
  const [user, setUser] = useState(pb.authStore.model);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'état initial de l'authentification
    setUser(pb.authStore.model);
    setLoading(false);

    // S'inscrire aux changements d'état d'authentification
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
};

export default useUser;
