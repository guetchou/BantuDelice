import React, { useEffect, useState, createContext, useContext } from 'react';
import { MAPBOX_CONFIG, initializeMapbox, isMapboxAvailable } from '@/config/mapbox';

interface MapboxContextType {
  isLoaded: boolean;
  isAvailable: boolean;
  error: string | null;
}

const MapboxContext = createContext<MapboxContextType>({
  isLoaded: false,
  isAvailable: false,
  error: null
});

export const useMapbox = () => {
  const context = useContext(MapboxContext);
  if (!context) {
    throw new Error('useMapbox must be used within a MapboxProvider');
  }
  return context;
};

interface MapboxProviderProps {
  children: React.ReactNode;
}

export const MapboxProvider: React.FC<MapboxProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMapbox = async () => {
      try {
        // Check if Mapbox is already loaded
        if (isMapboxAvailable()) {
          setIsAvailable(true);
          setIsLoaded(true);
          return;
        }

        // Check if access token is available
        if (!MAPBOX_CONFIG.accessToken) {
          setError('Mapbox access token is not configured');
          return;
        }

        // Initialize Mapbox
        initializeMapbox();
        
        // Check if initialization was successful
        if (isMapboxAvailable()) {
          setIsAvailable(true);
          setIsLoaded(true);
        } else {
          setError('Failed to initialize Mapbox');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Mapbox');
      }
    };

    loadMapbox();
  }, []);

  return (
    <MapboxContext.Provider value={{ isLoaded, isAvailable, error }}>
      {children}
    </MapboxContext.Provider>
  );
};

// Hook to check Mapbox availability
export const useMapboxAvailability = () => {
  const { isLoaded, isAvailable, error } = useMapbox();
  
  return {
    isLoaded,
    isAvailable,
    error,
    canUseMapbox: isLoaded && isAvailable && !error
  };
}; 