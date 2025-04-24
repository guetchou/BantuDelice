
import { useEffect, useState } from 'react';

export interface UserProfile {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'user' | 'admin' | 'restaurant_owner' | 'driver';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  status?: "active" | "inactive" | "pending";
  last_login?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    const fetchUser = async () => {
      try {
        // Dans une app réelle, on ferait un appel API ici
        // Pour l'instant, on simule un délai et on retourne des données fictives
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userData: UserProfile = {
          id: '123',
          email: 'user@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
          avatar_url: 'https://ui-avatars.com/api/?name=John+Doe',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          phone: '+237 612345678',
          status: 'active',
          last_login: new Date().toISOString()
        };
        
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchUser();
  }, []);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, ...data };
      });
      
      return true;
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, updateUserProfile };
};
