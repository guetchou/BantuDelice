
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const position = await getCurrentPosition();
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur de géolocalisation';
        setError(errorMessage);
        
        // Utiliser une position par défaut au Congo (Brazzaville)
        setUserLocation([15.2429, -4.2634]);
        
        // Ne pas afficher d'erreur en mode développement pour éviter le spam
        if (process.env.NODE_ENV === 'development') {
          console.warn('Erreur de géolocalisation:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  const findNearMe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const position = await getCurrentPosition();
      const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
      
      setUserLocation(newLocation);
      
      toast({
        title: "Localisation mise à jour",
        description: "Restaurants à proximité affichés sur la carte",
      });
      
      return newLocation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de géolocalisation';
      setError(errorMessage);
      
      toast({
        title: "Erreur de localisation",
        description: "Impossible d'accéder à votre position. Utilisation de la position par défaut.",
        variant: "destructive"
      });
      
      // Retourner la position par défaut
      const defaultLocation: [number, number] = [15.2429, -4.2634];
      setUserLocation(defaultLocation);
      return defaultLocation;
    } finally {
      setLoading(false);
    }
  };

  return { 
    userLocation, 
    findNearMe, 
    loading, 
    error 
  };
}
