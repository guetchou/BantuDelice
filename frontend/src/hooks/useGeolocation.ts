
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
          setUserLocation([4.0383, 9.7084]); // Douala, Cameroon as default
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
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
    }
    return userLocation;
  };

  return { userLocation, findNearMe };
}
