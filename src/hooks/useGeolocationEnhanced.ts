
import { useState, useEffect, useCallback } from 'react';
import { getCurrentPosition, watchPosition, clearWatch, GeolocationResult, GeolocationError } from '@/utils/geolocation';
import { useToast } from '@/hooks/use-toast';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

export function useGeolocationEnhanced(options: UseGeolocationOptions = {}) {
  const [location, setLocation] = useState<GeolocationResult | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const position = await getCurrentPosition();
      setLocation(position);
      toast({
        title: "Position obtenue",
        description: `Localisation mise à jour avec précision de ${Math.round(position.accuracy || 0)}m`,
      });
    } catch (err) {
      const geoError = err as GeolocationError;
      setError(geoError);
      toast({
        title: "Erreur de géolocalisation",
        description: geoError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const startWatching = useCallback(() => {
    if (watchId) return; // Already watching
    
    const id = watchPosition(
      (position) => {
        setLocation(position);
        setError(null);
      },
      (err) => {
        setError(err);
        console.error('Geolocation watch error:', err);
      }
    );
    
    if (id) {
      setWatchId(id);
    }
  }, [watchId]);

  const stopWatching = useCallback(() => {
    if (watchId) {
      clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    if (options.watch) {
      startWatching();
    }
    
    return () => {
      if (watchId) {
        clearWatch(watchId);
      }
    };
  }, [options.watch, startWatching, watchId]);

  return {
    location,
    error,
    loading,
    getLocation,
    startWatching,
    stopWatching,
    isWatching: watchId !== null
  };
}
