
import { useState } from 'react';
import { toast } from 'sonner';
import { getCurrentPosition, reverseGeocode } from '@/utils/locationUtils';

// Coordonnées fictives pour simuler le géocodage
const mockGeocode = (address: string): Promise<{ lat: number, lng: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Générer des coordonnées fictives autour de Brazzaville
      const baseLatitude = -4.2634;
      const baseLongitude = 15.2429;
      
      const randomOffset = () => (Math.random() - 0.5) * 0.05;
      
      resolve({
        lat: baseLatitude + randomOffset(),
        lng: baseLongitude + randomOffset()
      });
    }, 800);
  });
};

export function useLocationHandler() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = async (address: string, isPickup: boolean, updateFormState: Function) => {
    if (!address.trim()) {
      toast.error("Veuillez entrer une adresse valide");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler un géocodage pour obtenir les coordonnées à partir de l'adresse
      const { lat, lng } = await mockGeocode(address);
      
      // Mettre à jour l'état du formulaire avec les coordonnées
      if (isPickup) {
        updateFormState({
          pickupLatitude: lat,
          pickupLongitude: lng,
          pickupAddress: address
        });
      } else {
        updateFormState({
          destinationLatitude: lat,
          destinationLongitude: lng,
          destinationAddress: address
        });
      }
      
      toast.success(`Adresse ${isPickup ? 'de départ' : 'de destination'} définie`, {
        description: address
      });
    } catch (error) {
      console.error('Erreur lors de la géolocalisation:', error);
      toast.error("Impossible de localiser cette adresse", {
        description: "Veuillez essayer une autre adresse"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseCurrentLocation = async (updateFormState: Function) => {
    setIsLoading(true);
    
    try {
      // Obtenir la position actuelle de l'utilisateur
      const position = await getCurrentPosition();
      
      // Faire un géocodage inverse pour obtenir l'adresse
      const address = await reverseGeocode(position.latitude, position.longitude);
      
      // Mettre à jour l'état du formulaire
      updateFormState({
        pickupLatitude: position.latitude,
        pickupLongitude: position.longitude,
        pickupAddress: address
      });
      
      toast.success("Position actuelle utilisée", {
        description: address
      });
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      toast.error("Impossible d'obtenir votre position actuelle", {
        description: "Veuillez entrer votre adresse manuellement"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLocationSelect,
    handleUseCurrentLocation
  };
}
