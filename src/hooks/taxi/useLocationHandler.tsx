
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { geocodeAddress, reverseGeocode, getCurrentPosition } from '@/utils/locationUtils';
import { SavedLocation } from '@/types/taxi';

// Hook pour gérer les emplacements de départ et d'arrivée
export function useLocationHandler() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  
  // Charger les adresses sauvegardées de l'utilisateur
  const loadSavedAddresses = async (userId?: string) => {
    try {
      setIsLoadingLocations(true);
      
      const { data, error } = await supabase
        .from('taxi_saved_locations')
        .select('*')
        .order('last_used', { ascending: false });
        
      if (error) throw error;
      
      const locations = data.map(location => ({
        id: location.id,
        user_id: location.user_id,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        is_favorite: location.is_favorite,
        is_current_location: location.is_current_location,
        last_used: location.last_used,
        created_at: location.created_at,
        name: location.name
      }));
      
      setSavedLocations(locations);
      return locations;
    } catch (error) {
      console.error('Erreur lors du chargement des adresses sauvegardées:', error);
      toast.error('Impossible de charger vos adresses sauvegardées');
      return [];
    } finally {
      setIsLoadingLocations(false);
    }
  };
  
  // Chercher des suggestions d'adresses
  const searchAddressSuggestions = async (query: string): Promise<string[]> => {
    try {
      if (!query || query.length < 3) return [];
      
      // Simulation d'une recherche d'adresses pour cette démo
      // Dans une application réelle, cela appellerait une API de géocodage
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { data, error } = await supabase
        .from('taxi_saved_locations')
        .select('address')
        .ilike('address', `%${query}%`)
        .limit(5);
        
      if (error) throw error;
      
      // Adresses de résultats suggérées
      const searchResults = data.map(item => item.address);
      
      // Ajouter des suggestions communes basées sur la requête
      const commonAddresses = [
        'Aéroport Maya-Maya, Brazzaville',
        'Gare de Brazzaville',
        'Marché Total, Brazzaville',
        'Université Marien Ngouabi, Brazzaville',
        'Hôpital CHU, Brazzaville',
        'Centre-ville, Brazzaville',
        'Pointe-Noire Centre'
      ].filter(address => 
        address.toLowerCase().includes(query.toLowerCase()) && 
        !searchResults.includes(address)
      ).slice(0, 3);
      
      return [...searchResults, ...commonAddresses];
    } catch (error) {
      console.error('Erreur de recherche d\'adresses:', error);
      return [];
    }
  };
  
  // Gérer la sélection d'une adresse
  const handleLocationSelect = async (address: string, isPickup: boolean, updateFormState: (update: any) => void) => {
    try {
      if (!address) return;
      
      // Géocodage de l'adresse en coordonnées
      const coords = await geocodeAddress(address);
      
      // Mettre à jour l'état du formulaire
      if (isPickup) {
        updateFormState({
          pickupAddress: address,
          pickupLatitude: coords.latitude,
          pickupLongitude: coords.longitude
        });
      } else {
        updateFormState({
          destinationAddress: address,
          destinationLatitude: coords.latitude,
          destinationLongitude: coords.longitude
        });
      }
      
      // Sauvegarder l'adresse pour une utilisation future
      const user = (await supabase.auth.getUser()).data.user;
      
      if (user?.id) {
        await saveLocationToHistory(address, coords.latitude, coords.longitude, user.id);
      }
      
      return coords;
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'emplacement:', error);
      toast.error('Impossible de géocoder cette adresse');
      throw error;
    }
  };
  
  // Sauvegarder une adresse dans l'historique
  const saveLocationToHistory = async (
    address: string, 
    latitude: number, 
    longitude: number,
    userId: string
  ) => {
    try {
      // Vérifier si l'adresse existe déjà
      const { data: existingAddresses } = await supabase
        .from('taxi_saved_locations')
        .select('*')
        .eq('address', address)
        .limit(1);
      
      if (existingAddresses && existingAddresses.length > 0) {
        // Mettre à jour la date de dernière utilisation
        await supabase
          .from('taxi_saved_locations')
          .update({ last_used: new Date().toISOString() })
          .eq('id', existingAddresses[0].id);
      } else {
        // Ajouter une nouvelle adresse
        await supabase
          .from('taxi_saved_locations')
          .insert([
            { 
              address,
              latitude,
              longitude,
              user_id: userId,
              last_used: new Date().toISOString(),
              is_favorite: false
            }
          ]);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'adresse:', error);
    }
  };
  
  // Utiliser la position actuelle de l'utilisateur
  const handleUseCurrentLocation = async (updateFormState: (update: any) => void) => {
    try {
      // Obtenir la position actuelle
      const position = await getCurrentPosition();
      
      // Convertir les coordonnées en adresse lisible
      const address = await reverseGeocode(position.latitude, position.longitude);
      
      // Mettre à jour l'état du formulaire
      updateFormState({
        pickupAddress: address,
        pickupLatitude: position.latitude,
        pickupLongitude: position.longitude
      });
      
      // Sauvegarder comme emplacement actuel
      const user = (await supabase.auth.getUser()).data.user;
      
      if (user?.id) {
        try {
          // Vérifier s'il existe déjà un emplacement actuel
          const { data: existingCurrentLocation } = await supabase
            .from('taxi_saved_locations')
            .select('*')
            .eq('is_current_location', true)
            .eq('user_id', user.id)
            .limit(1);
          
          if (existingCurrentLocation && existingCurrentLocation.length > 0) {
            // Mettre à jour l'emplacement actuel
            await supabase
              .from('taxi_saved_locations')
              .update({ 
                address,
                latitude: position.latitude,
                longitude: position.longitude,
                last_used: new Date().toISOString()
              })
              .eq('id', existingCurrentLocation[0].id);
          } else {
            // Créer un nouvel emplacement actuel
            await supabase
              .from('taxi_saved_locations')
              .insert([
                { 
                  address,
                  latitude: position.latitude,
                  longitude: position.longitude,
                  user_id: user.id,
                  is_current_location: true,
                  last_used: new Date().toISOString(),
                  is_favorite: false
                }
              ]);
          }
        } catch (error) {
          console.error('Erreur lors de la sauvegarde de la position actuelle:', error);
        }
      }
      
      return { address, ...position };
    } catch (error) {
      console.error('Erreur lors de l\'utilisation de la position actuelle:', error);
      toast.error('Impossible d\'obtenir votre position actuelle');
      throw error;
    }
  };
  
  // Marquer/démarquer une adresse comme favorite
  const toggleFavoriteLocation = async (locationId: string, isFavorite: boolean) => {
    try {
      await supabase
        .from('taxi_saved_locations')
        .update({ is_favorite: isFavorite })
        .eq('id', locationId);
        
      // Mettre à jour l'état local
      setSavedLocations(prevLocations => 
        prevLocations.map(location => 
          location.id === locationId 
            ? { ...location, is_favorite: isFavorite } 
            : location
        )
      );
      
      toast.success(
        isFavorite 
          ? 'Adresse ajoutée aux favoris' 
          : 'Adresse retirée des favoris'
      );
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la modification du favori:', error);
      toast.error('Impossible de modifier le favori');
      return false;
    }
  };
  
  return {
    savedLocations,
    isLoadingLocations,
    handleLocationSelect,
    handleUseCurrentLocation,
    searchAddressSuggestions,
    loadSavedAddresses,
    toggleFavoriteLocation
  };
}
