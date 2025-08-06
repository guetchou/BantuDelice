
import { useState, useEffect } from 'react';
import apiService from '@/services/api';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface SavedLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_favorite: boolean;
  type: 'home' | 'work' | 'other';
  created_at: string;
}

export function useTaxiLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [recentLocations, setRecentLocations] = useState<SavedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedLocations();
      fetchRecentLocations();
    }
  }, [user]);

  const fetchSavedLocations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Dans un vrai environnement, nous interrogerions Supabase
      // Mais pour la démo, nous utilisons des données simulées
      const mockLocations: SavedLocation[] = [
        {
          id: '1',
          user_id: user.id,
          name: 'Maison',
          address: '123 Boulevard de la Liberté, Brazzaville',
          latitude: -4.2634,
          longitude: 15.2429,
          is_favorite: true,
          type: 'home',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: user.id,
          name: 'Bureau',
          address: '45 Avenue de l\'Indépendance, Brazzaville',
          latitude: -4.2733,
          longitude: 15.2464,
          is_favorite: true,
          type: 'work',
          created_at: new Date().toISOString()
        }
      ];
      
      setSavedLocations(mockLocations);
    } catch (error) {
      console.error('Erreur lors de la récupération des emplacements enregistrés:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentLocations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Données simulées pour les emplacements récents
      const mockRecentLocations: SavedLocation[] = [
        {
          id: '3',
          user_id: user.id,
          name: 'Aéroport international',
          address: 'Aéroport Maya-Maya, Brazzaville',
          latitude: -4.2515,
          longitude: 15.2534,
          is_favorite: false,
          type: 'other',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          user_id: user.id,
          name: 'Centre commercial',
          address: 'Grand Marché de Bacongo, Brazzaville',
          latitude: -4.2867,
          longitude: 15.2446,
          is_favorite: false,
          type: 'other',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setRecentLocations(mockRecentLocations);
    } catch (error) {
      console.error('Erreur lors de la récupération des emplacements récents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLocation = async (location: Omit<SavedLocation, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return null;
    
    try {
      const newLocation: SavedLocation = {
        id: Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        ...location,
        created_at: new Date().toISOString()
      };
      
      // Dans un vrai environnement, nous l'enregistrerions dans Supabase
      setSavedLocations(prev => [...prev, newLocation]);
      toast.success('Emplacement enregistré');
      
      return newLocation;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'emplacement:', error);
      toast.error("Impossible d'enregistrer l'emplacement");
      return null;
    }
  };

  const updateLocation = async (id: string, updates: Partial<Omit<SavedLocation, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user) return false;
    
    try {
      // Dans un vrai environnement, nous mettrions à jour Supabase
      setSavedLocations(prev => 
        prev.map(loc => loc.id === id ? { ...loc, ...updates } : loc)
      );
      
      toast.success('Emplacement mis à jour');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'emplacement:', error);
      toast.error("Impossible de mettre à jour l'emplacement");
      return false;
    }
  };

  const deleteLocation = async (id: string) => {
    if (!user) return false;
    
    try {
      // Dans un vrai environnement, nous supprimerions de Supabase
      setSavedLocations(prev => prev.filter(loc => loc.id !== id));
      
      toast.success('Emplacement supprimé');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'emplacement:', error);
      toast.error("Impossible de supprimer l'emplacement");
      return false;
    }
  };

  return {
    savedLocations,
    recentLocations,
    isLoading,
    saveLocation,
    updateLocation,
    deleteLocation,
    refreshLocations: () => {
      fetchSavedLocations();
      fetchRecentLocations();
    }
  };
}
