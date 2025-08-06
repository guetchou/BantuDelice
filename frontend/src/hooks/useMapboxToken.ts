import { useState, useEffect } from 'react';

interface MapboxTokenResponse {
  token: string;
  message: string;
}

interface UseMapboxTokenReturn {
  token: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook personnalisé pour récupérer le token Mapbox de manière sécurisée via l'API
 * Au lieu d'exposer la clé API en dur dans le frontend
 */
export const useMapboxToken = (): UseMapboxTokenReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Utilisation de l'API backend NestJS sécurisée
      const response = await fetch('/api/config/mapbox-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint Mapbox token non disponible');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data: MapboxTokenResponse = await response.json();
      
      if (!data.token) {
        throw new Error('Token Mapbox non configuré sur le serveur');
      }

      setToken(data.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      // Ne pas logger l'erreur en production pour éviter le spam
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erreur lors de la récupération du token Mapbox:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchToken();
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return {
    token,
    loading,
    error,
    refetch
  };
}; 