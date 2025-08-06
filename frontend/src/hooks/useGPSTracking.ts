import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  altitude?: number;
  timestamp: Date;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: Date;
  driverInfo?: {
    id: string;
    name: string;
    phone: string;
    photo?: string;
  };
  route: {
    distance: number;
    duration: number;
    waypoints: Array<{ lat: number; lng: number }>;
  };
  lastUpdate: Date;
}

export interface TrackingEvent {
  type: 'location' | 'status' | 'driver' | 'route';
  data: unknown;
  timestamp: Date;
}

interface UseGPSTrackingOptions {
  trackingNumber: string;
  userId: string;
  enableRealTime?: boolean;
  updateInterval?: number;
  onLocationUpdate?: (location: LocationData) => void;
  onStatusChange?: (status: string) => void;
  onError?: (error: string) => void;
}

export const useGPSTracking = ({
  trackingNumber,
  userId,
  enableRealTime = true,
  updateInterval = 5000,
  onLocationUpdate,
  onStatusChange,
  onError
}: UseGPSTrackingOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<LocationData[]>([]);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialiser la connexion WebSocket
  const initializeSocket = useCallback(() => {
    if (socketRef.current) return;

    try {
      socketRef.current = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        auth: {
          token: localStorage.getItem('colis_token')
        }
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.log('WebSocket connecté');
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('WebSocket déconnecté');
      });

      socketRef.current.on('error', (error) => {
        setError(`Erreur WebSocket: ${error.message}`);
        onError?.(error.message);
      });

      // Écouter les mises à jour de position
      socketRef.current.on('locationUpdate', (locationData: LocationData) => {
        const location: LocationData = {
          ...locationData,
          timestamp: new Date(locationData.timestamp)
        };

        setCurrentLocation(location);
        setTrackingHistory(prev => [...prev, location]);
        onLocationUpdate?.(location);

        // Ajouter l'événement
        setEvents(prev => [...prev, {
          type: 'location',
          data: location,
          timestamp: new Date()
        }]);
      });

      // Écouter les changements de statut
      socketRef.current.on('statusChange', (data: { trackingNumber: string; status: string }) => {
        setTrackingInfo(prev => prev ? { ...prev, status: data.status } : null);
        onStatusChange?.(data.status);

        setEvents(prev => [...prev, {
          type: 'status',
          data: { status: data.status },
          timestamp: new Date()
        }]);

        toast.success(`Statut mis à jour: ${data.status}`);
      });

      // Écouter les informations de tracking
      socketRef.current.on('trackingInfo', (info: TrackingInfo) => {
        setTrackingInfo(info);
      });

      // Écouter l'arrêt du tracking
      socketRef.current.on('trackingStopped', (data: { trackingNumber: string }) => {
        setIsTracking(false);
        toast.info('Tracking arrêté');
      });

    } catch (error) {
      setError(`Erreur de connexion: ${error.message}`);
      onError?.(error.message);
    }
  }, [onLocationUpdate, onStatusChange, onError]);

  // Démarrer le tracking GPS
  const startTracking = useCallback(async () => {
    if (!trackingNumber || !userId) {
      setError('Numéro de tracking et ID utilisateur requis');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Initialiser la connexion WebSocket
      initializeSocket();

      // S'abonner au tracking
      if (socketRef.current) {
        socketRef.current.emit('subscribeToTracking', {
          trackingNumber,
          userId
        });
      }

      // Démarrer le tracking GPS si activé
      if (enableRealTime && 'geolocation' in navigator) {
        const startGPS = () => {
          locationWatchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
              const locationData: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                speed: position.coords.speed || 0,
                heading: position.coords.heading || 0,
                altitude: position.coords.altitude || undefined,
                timestamp: new Date(position.timestamp)
              };

              // Envoyer la position au serveur
              if (socketRef.current) {
                socketRef.current.emit('updateLocation', {
                  ...locationData,
                  trackingNumber
                });
              }

              setCurrentLocation(locationData);
            },
            (error) => {
              console.error('Erreur GPS:', error);
              setError(`Erreur GPS: ${error.message}`);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 30000
            }
          );
        };

        // Demander la permission de géolocalisation
        navigator.geolocation.getCurrentPosition(
          () => startGPS(),
          (error) => {
            console.error('Permission GPS refusée:', error);
            setError('Permission de géolocalisation requise');
          }
        );
      }

      setIsTracking(true);
      toast.success('Tracking démarré');
      return true;

    } catch (error) {
      setError(`Erreur lors du démarrage du tracking: ${error.message}`);
      onError?.(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [trackingNumber, userId, enableRealTime, initializeSocket, onError]);

  // Arrêter le tracking
  const stopTracking = useCallback(async () => {
    try {
      // Arrêter le GPS
      if (locationWatchIdRef.current) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
        locationWatchIdRef.current = null;
      }

      // Se désabonner du tracking
      if (socketRef.current) {
        socketRef.current.emit('unsubscribeFromTracking', {
          trackingNumber,
          userId
        });
      }

      // Arrêter l'intervalle de mise à jour
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }

      setIsTracking(false);
      toast.info('Tracking arrêté');
    } catch (error) {
      setError(`Erreur lors de l'arrêt du tracking: ${error.message}`);
    }
  }, [trackingNumber, userId]);

  // Mettre à jour la position manuellement
  const updateLocation = useCallback(async (location: Partial<LocationData>) => {
    if (!socketRef.current || !isTracking) return;

    try {
      const currentPos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      const locationData: LocationData = {
        latitude: location.latitude ?? currentPos.coords.latitude,
        longitude: location.longitude ?? currentPos.coords.longitude,
        accuracy: location.accuracy ?? currentPos.coords.accuracy,
        speed: location.speed ?? (currentPos.coords.speed || 0),
        heading: location.heading ?? (currentPos.coords.heading || 0),
        altitude: location.altitude ?? (currentPos.coords.altitude || undefined),
        timestamp: new Date()
      };

      socketRef.current.emit('updateLocation', {
        ...locationData,
        trackingNumber
      });

      setCurrentLocation(locationData);
    } catch (error) {
      setError(`Erreur mise à jour position: ${error.message}`);
    }
  }, [trackingNumber, isTracking]);

  // Récupérer l'historique de tracking
  const fetchTrackingHistory = useCallback(async (limit = 50, offset = 0) => {
    try {
      const response = await fetch(`/api/tracking/${trackingNumber}/history?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'historique');
      }

      const data = await response.json();
      setTrackingHistory(data.data || []);
      return data.data;
    } catch (error) {
      setError(`Erreur historique: ${error.message}`);
      return [];
    }
  }, [trackingNumber]);

  // Récupérer les informations de tracking
  const fetchTrackingInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/tracking/${trackingNumber}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations');
      }

      const data = await response.json();
      setTrackingInfo(data.data);
      return data.data;
    } catch (error) {
      setError(`Erreur informations: ${error.message}`);
      return null;
    }
  }, [trackingNumber]);

  // Nettoyer les ressources
  useEffect(() => {
    return () => {
      if (locationWatchIdRef.current) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Démarrer automatiquement le tracking au montage
  useEffect(() => {
    if (trackingNumber && userId) {
      fetchTrackingInfo();
    }
  }, [trackingNumber, userId, fetchTrackingInfo]);

  return {
    // État
    isConnected,
    isTracking,
    trackingInfo,
    currentLocation,
    trackingHistory,
    events,
    error,
    loading,

    // Actions
    startTracking,
    stopTracking,
    updateLocation,
    fetchTrackingHistory,
    fetchTrackingInfo,

    // Utilitaires
    clearError: () => setError(null),
    clearEvents: () => setEvents([])
  };
}; 