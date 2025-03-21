
import { useState } from 'react';
import { toast } from 'sonner';

export function useLocationHandler() {
  const handleLocationSelect = async (address: string, isPickup: boolean, updateFormState: Function) => {
    if (!address) return;
    
    try {
      // In a real app, we would use a geocoding service here
      // For this demo, we'll simulate with random coordinates
      const simulateGeocode = () => {
        const baseLat = 4.2634; // Base coordinates for Brazzaville
        const baseLng = 15.2429;
        
        // Add some random offset (within ~5km)
        const latOffset = (Math.random() * 0.05) - 0.025;
        const lngOffset = (Math.random() * 0.05) - 0.025;
        
        return {
          lat: baseLat + latOffset,
          lng: baseLng + lngOffset
        };
      };
      
      const coords = simulateGeocode();
      
      if (isPickup) {
        updateFormState({
          pickupAddress: address,
          pickupLatitude: coords.lat,
          pickupLongitude: coords.lng
        });
      } else {
        updateFormState({
          destinationAddress: address,
          destinationLatitude: coords.lat,
          destinationLongitude: coords.lng
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast.error("Impossible de localiser cette adresse");
    }
  };
  
  const handleUseCurrentLocation = (updateFormState: Function) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // In a real app, we would use reverse geocoding here
          // For this demo, we'll set a placeholder address
          updateFormState({
            pickupAddress: "Ma position actuelle",
            pickupLatitude: latitude,
            pickupLongitude: longitude
          });
          
          toast.success("Position actuelle détectée");
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error("Impossible d'obtenir votre position actuelle");
        }
      );
    } else {
      toast.error("La géolocalisation n'est pas prise en charge par votre appareil");
    }
  };

  return {
    handleLocationSelect,
    handleUseCurrentLocation
  };
}
