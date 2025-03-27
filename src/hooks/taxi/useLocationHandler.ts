
import { useState } from 'react';
import { toast } from 'sonner';

interface LocationHandlerResult {
  handleLocationSelect: (address: string, isPickup: boolean, updateFormState: Function) => Promise<void>;
  handleUseCurrentLocation: (updateFormState: Function) => void;
  isLocating: boolean;
  locationError: string | null;
}

export function useLocationHandler(): LocationHandlerResult {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  /**
   * Gérer la sélection d'une adresse (départ ou destination)
   */
  const handleLocationSelect = async (
    address: string,
    isPickup: boolean,
    updateFormState: Function
  ) => {
    setIsLocating(true);
    setLocationError(null);
    
    try {
      // Simuler un appel API pour géocoder l'adresse
      // En production, ici on appellerait l'API Google Maps Geocoding ou similaire
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler des coordonnées pour la démo
      // Pour Brazzaville, coordonnées approximatives
      const baseCoords = {
        latitude: -4.2634,
        longitude: 15.2429
      };
      
      // Ajouter une petite variation aléatoire pour simuler différentes adresses
      const randomLat = (Math.random() - 0.5) * 0.05;
      const randomLng = (Math.random() - 0.5) * 0.05;
      
      const coords = {
        latitude: baseCoords.latitude + randomLat,
        longitude: baseCoords.longitude + randomLng
      };
      
      // Mettre à jour l'état du formulaire avec la nouvelle adresse et coordonnées
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
      
      toast.success(`Adresse sélectionnée : ${address}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de localiser l'adresse";
      setLocationError(errorMessage);
      toast.error("Erreur de localisation", {
        description: errorMessage
      });
    } finally {
      setIsLocating(false);
    }
  };
  
  /**
   * Utiliser la géolocalisation du navigateur pour la position actuelle
   */
  const handleUseCurrentLocation = (updateFormState: Function) => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
      toast.error("Géolocalisation non disponible");
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      // Succès
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Simuler la récupération de l'adresse textuelle (reverse geocoding)
        // En production, utiliser l'API Google Maps Reverse Geocoding
        const mockAddress = "Votre position actuelle";
        
        updateFormState({
          pickupAddress: mockAddress,
          pickupLatitude: coords.latitude,
          pickupLongitude: coords.longitude
        });
        
        toast.success("Position actuelle détectée");
        setIsLocating(false);
      },
      // Erreur
      (error) => {
        let errorMessage = "Erreur de géolocalisation";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé";
            break;
        }
        
        setLocationError(errorMessage);
        toast.error("Erreur de géolocalisation", {
          description: errorMessage
        });
        setIsLocating(false);
      }
    );
  };

  return {
    handleLocationSelect,
    handleUseCurrentLocation,
    isLocating,
    locationError
  };
}
