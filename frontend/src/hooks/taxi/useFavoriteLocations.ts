
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface FavoriteLocation {
  id: string;
  userId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  icon?: string;
  useCount: number;
  lastUsed: string;
  type: 'home' | 'work' | 'favorite' | 'recent';
}

/**
 * Hook pour gérer les emplacements favoris de l'utilisateur
 */
export function useFavoriteLocations(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [recentLocations, setRecentLocations] = useState<FavoriteLocation[]>([]);

  /**
   * Charge les emplacements favoris de l'utilisateur
   */
  const loadFavoriteLocations = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Données fictives pour la démonstration
      const mockFavorites: FavoriteLocation[] = [
        {
          id: '1',
          userId,
          name: 'Domicile',
          address: 'Avenue de la Paix, Brazzaville',
          latitude: -4.2634,
          longitude: 15.2429,
          icon: 'home',
          useCount: 42,
          lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 jours avant
          type: 'home'
        },
        {
          id: '2',
          userId,
          name: 'Bureau',
          address: 'Avenue Marechal Lyautey, Brazzaville',
          latitude: -4.2515,
          longitude: 15.2534,
          icon: 'briefcase',
          useCount: 35,
          lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 heures avant
          type: 'work'
        },
        {
          id: '3',
          userId,
          name: 'Supermarché Casino',
          address: 'Centre-ville, Brazzaville',
          latitude: -4.2705,
          longitude: 15.2809,
          icon: 'shopping-cart',
          useCount: 8,
          lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours avant
          type: 'favorite'
        }
      ];
      
      const mockRecent: FavoriteLocation[] = [
        {
          id: '4',
          userId,
          name: 'Aéroport Maya-Maya',
          address: 'Boulevard Alfred Raoul, Brazzaville',
          latitude: -4.2515,
          longitude: 15.2534,
          useCount: 2,
          lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 jours avant
          type: 'recent'
        },
        {
          id: '5',
          userId,
          name: 'Restaurant Le Philou',
          address: 'Avenue Félix Éboué, Brazzaville',
          latitude: -4.2667,
          longitude: 15.2869,
          useCount: 1,
          lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 jours avant
          type: 'recent'
        }
      ];
      
      setFavoriteLocations(mockFavorites);
      setRecentLocations(mockRecent);
    } catch (error) {
      console.error('Erreur lors du chargement des emplacements favoris:', error);
      toast.error('Impossible de charger vos emplacements favoris');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ajoute un nouvel emplacement favori
   */
  const addFavoriteLocation = async (
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    type: 'home' | 'work' | 'favorite' = 'favorite'
  ): Promise<boolean> => {
    if (!userId) return false;
    
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Créer un nouvel emplacement favori
      const newFavorite: FavoriteLocation = {
        id: `fav-${Date.now()}`,
        userId,
        name,
        address,
        latitude,
        longitude,
        icon: type === 'home' ? 'home' : type === 'work' ? 'briefcase' : 'heart',
        useCount: 1,
        lastUsed: new Date().toISOString(),
        type
      };
      
      // Mettre à jour l'état local
      setFavoriteLocations(prev => [...prev, newFavorite]);
      
      toast.success('Emplacement ajouté aux favoris');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un emplacement favori:', error);
      toast.error('Impossible d\'ajouter cet emplacement aux favoris');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Supprime un emplacement favori
   */
  const removeFavoriteLocation = async (locationId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour l'état local
      setFavoriteLocations(prev => prev.filter(loc => loc.id !== locationId));
      setRecentLocations(prev => prev.filter(loc => loc.id !== locationId));
      
      toast.success('Emplacement supprimé des favoris');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un emplacement favori:', error);
      toast.error('Impossible de supprimer cet emplacement des favoris');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enregistre un emplacement récemment utilisé
   */
  const recordRecentLocation = async (
    address: string,
    latitude: number,
    longitude: number,
    name?: string
  ): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Vérifier si l'adresse existe déjà dans les favoris ou les récents
      const existingFavorite = favoriteLocations.find(loc => 
        loc.latitude === latitude && loc.longitude === longitude
      );
      
      const existingRecent = recentLocations.find(loc => 
        loc.latitude === latitude && loc.longitude === longitude
      );
      
      if (existingFavorite) {
        // Mettre à jour le compteur et la date de dernière utilisation
        const updated = {
          ...existingFavorite,
          useCount: existingFavorite.useCount + 1,
          lastUsed: new Date().toISOString()
        };
        
        setFavoriteLocations(prev => 
          prev.map(loc => loc.id === existingFavorite.id ? updated : loc)
        );
        
        return true;
      }
      
      if (existingRecent) {
        // Mettre à jour le compteur et la date de dernière utilisation
        const updated = {
          ...existingRecent,
          useCount: existingRecent.useCount + 1,
          lastUsed: new Date().toISOString()
        };
        
        setRecentLocations(prev => 
          prev.map(loc => loc.id === existingRecent.id ? updated : loc)
        );
        
        // Si l'emplacement a été utilisé plus de 3 fois, le proposer comme favori
        if (updated.useCount >= 3) {
          toast.info('Vous utilisez souvent cet emplacement', {
            description: 'Voulez-vous l\'ajouter à vos favoris?',
            action: {
              label: 'Ajouter',
              onClick: () => addFavoriteLocation(
                name || address,
                address,
                latitude,
                longitude
              )
            }
          });
        }
        
        return true;
      }
      
      // Créer un nouvel emplacement récent
      const newRecent: FavoriteLocation = {
        id: `rec-${Date.now()}`,
        userId,
        name: name || address,
        address,
        latitude,
        longitude,
        useCount: 1,
        lastUsed: new Date().toISOString(),
        type: 'recent'
      };
      
      // Ajouter à la liste des emplacements récents
      setRecentLocations(prev => {
        // Garder uniquement les 10 emplacements les plus récents
        const updated = [newRecent, ...prev].slice(0, 10);
        return updated;
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement d\'un emplacement récent:', error);
      return false;
    }
  };

  /**
   * Trouve les emplacements qui correspondent à une requête de recherche
   */
  const searchLocations = (query: string): FavoriteLocation[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    
    // Rechercher dans les favoris et les récents
    const matchingFavorites = favoriteLocations.filter(loc => 
      loc.name.toLowerCase().includes(lowerQuery) || 
      loc.address.toLowerCase().includes(lowerQuery)
    );
    
    const matchingRecents = recentLocations.filter(loc => 
      loc.name.toLowerCase().includes(lowerQuery) || 
      loc.address.toLowerCase().includes(lowerQuery)
    );
    
    // Fusionner et retirer les doublons
    const allMatches = [...matchingFavorites];
    
    for (const recent of matchingRecents) {
      if (!allMatches.some(loc => loc.id === recent.id)) {
        allMatches.push(recent);
      }
    }
    
    // Trier par pertinence et fréquence d'utilisation
    return allMatches.sort((a, b) => {
      // Priorité aux correspondances exactes dans le nom
      const aExactName = a.name.toLowerCase() === lowerQuery;
      const bExactName = b.name.toLowerCase() === lowerQuery;
      
      if (aExactName && !bExactName) return -1;
      if (!aExactName && bExactName) return 1;
      
      // Ensuite, priorité aux favoris sur les récents
      const aIsFavorite = a.type !== 'recent';
      const bIsFavorite = b.type !== 'recent';
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      
      // Enfin, trier par fréquence d'utilisation
      return b.useCount - a.useCount;
    });
  };

  // Charger les emplacements favoris au montage du composant
  useEffect(() => {
    if (userId) {
      loadFavoriteLocations();
    }
  }, [userId]);

  return {
    isLoading,
    favoriteLocations,
    recentLocations,
    loadFavoriteLocations,
    addFavoriteLocation,
    removeFavoriteLocation,
    recordRecentLocation,
    searchLocations
  };
}
