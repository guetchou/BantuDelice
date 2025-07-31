
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Utiliser une position par défaut au Congo (Brazzaville)
          setUserLocation([15.2429, -4.2634]); // Brazzaville, Congo as default
        }
      );
    }
  }, []);

  const findNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          toast({
            title: "Localisation mise à jour",
            description: "Restaurants à proximité affichés sur la carte",
          });
        },
        () => {
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'accéder à votre position",
          });
        }
      );
    } else {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
      });
    }
    return userLocation;
  };

  return { userLocation, findNearMe };
}
