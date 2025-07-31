
import { useState } from 'react';

interface GeocodeResult {
  coordinates: [number, number];
  address: string;
}

export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocode = async (address: string): Promise<GeocodeResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiKey = 'pk.eyJ1IjoibGF1cmVudGRldm1vIiwiYSI6ImNsdTF2NnN6djJrbHkya24wZWJreTBhcGEifQ.3tdP2ZwJRrdGVouUYnHxFA';
      const encodedAddress = encodeURIComponent(address);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de géocodage');
      }
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Aucun résultat trouvé pour cette adresse');
      }
      
      const [longitude, latitude] = data.features[0].center;
      const formattedAddress = data.features[0].place_name;
      
      return {
        coordinates: [longitude, latitude],
        address: formattedAddress
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du géocodage';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (coordinates: [number, number]): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [longitude, latitude] = coordinates;
      const apiKey = 'pk.eyJ1IjoibGF1cmVudGRldm1vIiwiYSI6ImNsdTF2NnN6djJrbHkya24wZWJreTBhcGEifQ.3tdP2ZwJRrdGVouUYnHxFA';
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de géocodage inverse');
      }
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Aucun résultat trouvé pour ces coordonnées');
      }
      
      return data.features[0].place_name;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du géocodage inverse';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = (): Promise<GeocodeResult | null> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError('La géolocalisation n\'est pas prise en charge par votre navigateur');
        reject('Geolocation not supported');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          const coordinates: [number, number] = [longitude, latitude];
          
          try {
            const address = await reverseGeocode(coordinates);
            if (address) {
              resolve({ coordinates, address });
            } else {
              resolve({ coordinates, address: 'Adresse inconnue' });
            }
          } catch (err) {
            resolve({ coordinates, address: 'Adresse inconnue' });
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          const errorMessage = getGeolocationErrorMessage(err);
          setError(errorMessage);
          setIsLoading(false);
          reject(errorMessage);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  // Helper function to get a user-friendly error message
  const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'L\'utilisateur a refusé la demande de géolocalisation';
      case error.POSITION_UNAVAILABLE:
        return 'Les informations de localisation sont indisponibles';
      case error.TIMEOUT:
        return 'La demande de géolocalisation a expiré';
      default:
        return 'Une erreur inconnue est survenue lors de la géolocalisation';
    }
  };

  return {
    geocode,
    reverseGeocode,
    getCurrentLocation,
    isLoading,
    error
  };
}
