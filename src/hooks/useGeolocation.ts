
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface GeolocationState {
  coordinates: [number, number] | null;
  accuracy: number | null;
  timestamp: number | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

const defaultOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
  watch: false
};

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    accuracy: null,
    timestamp: null,
    loading: false,
    error: null,
    permission: 'unknown'
  });

  const [watchId, setWatchId] = useState<number | null>(null);

  // Check permission status
  const checkPermission = useCallback(async (): Promise<'granted' | 'denied' | 'prompt'> => {
    if (!navigator.permissions) {
      return 'unknown';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return permission.state as 'granted' | 'denied' | 'prompt';
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'unknown';
    }
  }, []);

  // Get current position
  const getCurrentPosition = useCallback(async (): Promise<[number, number] | null> => {
    if (!navigator.geolocation) {
      const error = 'La géolocalisation n\'est pas supportée par votre navigateur';
      setState(prev => ({ ...prev, error, loading: false }));
      toast.error(error);
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const mergedOptions = { ...defaultOptions, ...options };

    return new Promise((resolve) => {
      const successCallback = (position: GeolocationPosition) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coordinates: [number, number] = [longitude, latitude];
        
        setState({
          coordinates,
          accuracy,
          timestamp: position.timestamp,
          loading: false,
          error: null,
          permission: 'granted'
        });

        toast.success('Position obtenue avec succès');
        resolve(coordinates);
      };

      const errorCallback = (error: GeolocationPositionError) => {
        let errorMessage: string;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Accès à la géolocalisation refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Impossible de déterminer votre position. Veuillez vérifier votre connexion GPS.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé pour obtenir votre position.';
            break;
          default:
            errorMessage = 'Erreur inconnue lors de la géolocalisation.';
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          permission: error.code === error.PERMISSION_DENIED ? 'denied' : 'prompt'
        }));

        toast.error(errorMessage);
        resolve(null);
      };

      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        mergedOptions
      );
    });
  }, [options]);

  // Start watching position
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n\'est pas supportée');
      return;
    }

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    const mergedOptions = { ...defaultOptions, ...options };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coordinates: [number, number] = [longitude, latitude];
        
        setState({
          coordinates,
          accuracy,
          timestamp: position.timestamp,
          loading: false,
          error: null,
          permission: 'granted'
        });
      },
      (error) => {
        let errorMessage: string;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Accès à la géolocalisation refusé';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé';
            break;
          default:
            errorMessage = 'Erreur de géolocalisation';
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          permission: error.code === error.PERMISSION_DENIED ? 'denied' : 'prompt'
        }));
      },
      mergedOptions
    );

    setWatchId(id);
  }, [options, watchId]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Request permission and get position
  const requestPosition = useCallback(async () => {
    const permission = await checkPermission();
    
    if (permission === 'denied') {
      toast.error('Accès à la géolocalisation refusé. Veuillez l\'activer dans les paramètres.');
      return null;
    }

    return await getCurrentPosition();
  }, [checkPermission, getCurrentPosition]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }, []);

  // Get distance from current position to a point
  const getDistanceTo = useCallback((lat: number, lon: number): number | null => {
    if (!state.coordinates) return null;
    
    const [currentLon, currentLat] = state.coordinates;
    return calculateDistance(currentLat, currentLon, lat, lon);
  }, [state.coordinates, calculateDistance]);

  // Format distance for display
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const permission = await checkPermission();
      setState(prev => ({ ...prev, permission }));
      
      if (permission === 'granted') {
        await getCurrentPosition();
      }
    };

    init();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return {
    ...state,
    getCurrentPosition,
    requestPosition,
    startWatching,
    stopWatching,
    calculateDistance,
    getDistanceTo,
    formatDistance,
    checkPermission
  };
}
