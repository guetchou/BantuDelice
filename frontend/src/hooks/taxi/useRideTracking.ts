
import { useState, useEffect, useRef } from 'react';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import { toast } from 'sonner';

export interface TrackingPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
  heading?: number;
  speed?: number;
}

export interface RouteUpdate {
  position: TrackingPosition;
  estimatedArrivalTime: Date;
  remainingDistance: number;
  remainingTime: number;
}

/**
 * Hook pour le suivi en temps réel d'une course
 */
export function useRideTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [driverPosition, setDriverPosition] = useState<TrackingPosition | null>(null);
  const [routePolyline, setRoutePolyline] = useState<string | null>(null);
  const [routePoints, setRoutePoints] = useState<TrackingPosition[]>([]);
  const [eta, setEta] = useState<Date | null>(null);
  const [remainingDistance, setRemainingDistance] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  /**
   * Démarre le suivi en temps réel
   */
  const startTracking = (rideId: string, useWebsocket: boolean = false) => {
    setIsTracking(true);
    
    if (useWebsocket) {
      // Utiliser WebSocket pour le suivi en temps réel (simulé)
      initializeWebsocket(rideId);
    } else {
      // Utiliser le polling pour le suivi (fallback)
      startPolling(rideId);
    }
    
    // Récupérer les données initiales
    fetchInitialRouteData(rideId);
  };

  /**
   * Initialise une connexion WebSocket pour le suivi en temps réel
   */
  const initializeWebsocket = (rideId: string) => {
    // Simulation d'une connexion WebSocket
    console.log(`Initializing WebSocket connection for ride ${rideId}`);
    
    // Dans une implémentation réelle, on se connecterait à un vrai WebSocket
    // socketRef.current = new WebSocket(`wss://api.example.com/rides/${rideId}/track`);
    
    // Simulation des messages WebSocket
    const mockSocket = {
      onmessage: (callback: (event: any) => void) => {},
      onclose: (callback: () => void) => {},
      onerror: (callback: (error: any) => void) => {},
      close: () => {}
    };
    
    // Simuler des mises à jour périodiques
    const interval = setInterval(() => {
      const update = generateMockUpdate();
      mockSocket.onmessage && mockSocket.onmessage({ data: JSON.stringify(update) });
    }, 5000);
    
    // Pour la démo, utiliser un intervalle Node.js pour simuler les mises à jour WebSocket
    pollingIntervalRef.current = interval;
  };

  /**
   * Démarre le polling pour les mises à jour de position
   */
  const startPolling = (rideId: string) => {
    // Arrêter tout polling existant
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Démarrer un nouvel intervalle de polling
    const interval = setInterval(() => {
      fetchRideUpdate(rideId);
    }, 5000); // Toutes les 5 secondes
    
    pollingIntervalRef.current = interval;
  };

  /**
   * Récupère les données initiales de l'itinéraire
   */
  const fetchInitialRouteData = async (rideId: string) => {
    setIsLoading(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données fictives pour la démonstration
      const mockRoute = generateMockRoute();
      
      // Mettre à jour l'état avec les données récupérées
      setRoutePoints(mockRoute.points);
      setRoutePolyline(mockRoute.polyline);
      setEta(new Date(Date.now() + 15 * 60 * 1000)); // ETA dans 15 minutes
      setRemainingDistance(5.2); // 5.2 km
      setRemainingTime(15); // 15 minutes
      
      // Récupérer la première position du chauffeur
      const mockUpdate = generateMockUpdate();
      setDriverPosition(mockUpdate.position);
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'itinéraire:', error);
      toast.error('Impossible de charger l\'itinéraire');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Récupère une mise à jour de la position du chauffeur
   */
  const fetchRideUpdate = async (rideId: string) => {
    try {
      // Simulation d'un appel API
      const mockUpdate = generateMockUpdate();
      
      // Mettre à jour l'état avec les données récupérées
      setDriverPosition(mockUpdate.position);
      setEta(mockUpdate.estimatedArrivalTime);
      setRemainingDistance(mockUpdate.remainingDistance);
      setRemainingTime(mockUpdate.remainingTime);
      
      // Ajouter la nouvelle position à l'historique des points
      setRoutePoints(prevPoints => [...prevPoints, mockUpdate.position]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la position:', error);
      // Pas de toast pour éviter de spammer l'utilisateur en cas d'erreurs répétées
    }
  };

  /**
   * Arrête le suivi en temps réel
   */
  const stopTracking = () => {
    setIsTracking(false);
    
    // Nettoyer l'intervalle de polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    // Fermer la connexion WebSocket
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  /**
   * Génère des données de route fictives pour la démonstration
   */
  const generateMockRoute = () => {
    // Simuler un trajet entre deux points
    const startLat = -4.2634;
    const startLng = 15.2429;
    const endLat = -4.2515;
    const endLng = 15.2534;
    
    // Générer quelques points intermédiaires
    const points: TrackingPosition[] = [];
    const numPoints = 10;
    
    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      const lat = startLat + (endLat - startLat) * fraction;
      const lng = startLng + (endLng - startLng) * fraction;
      
      // Ajouter un peu de variation pour simuler une route réelle
      const jitter = 0.0005; // ~50m
      const jitterLat = (Math.random() - 0.5) * jitter;
      const jitterLng = (Math.random() - 0.5) * jitter;
      
      points.push({
        latitude: lat + jitterLat,
        longitude: lng + jitterLng,
        timestamp: Date.now() + i * 60 * 1000 // Points espacés d'une minute
      });
    }
    
    // Simuler un polyline encodé
    const mockPolyline = 'gu{iDirznAkCmEyD}GqBcDwBwDoAsBsA_CwFuJmDnvLmNoDq@_DoBmD';
    
    return {
      points,
      polyline: mockPolyline
    };
  };

  /**
   * Génère une mise à jour fictive pour la démonstration
   */
  const generateMockUpdate = (): RouteUpdate => {
    // Si on a déjà une position, simuler un petit déplacement
    let lat, lng;
    
    if (driverPosition) {
      // Déplacer légèrement la position
      const jitter = 0.0008; // ~80m
      lat = driverPosition.latitude + (Math.random() - 0.3) * jitter; // Tendance à avancer
      lng = driverPosition.longitude + (Math.random() - 0.3) * jitter;
    } else {
      // Position initiale
      lat = -4.2634;
      lng = 15.2429;
    }
    
    // Calculer un ETA qui diminue progressivement
    const currentEta = eta ? eta.getTime() : Date.now() + 15 * 60 * 1000;
    const newEta = new Date(currentEta - Math.random() * 60 * 1000); // Réduire de 0-60 secondes
    
    // Calculer une distance restante qui diminue progressivement
    const newDistance = remainingDistance ? 
      Math.max(0, remainingDistance - (0.1 + Math.random() * 0.2)) : 
      5.2;
    
    // Calculer un temps restant qui diminue progressivement
    const newTime = remainingTime ? 
      Math.max(0, remainingTime - (Math.random() * 0.5)) : 
      15;
    
    return {
      position: {
        latitude: lat,
        longitude: lng,
        timestamp: Date.now(),
        heading: Math.random() * 360,
        speed: 15 + Math.random() * 10 // 15-25 km/h
      },
      estimatedArrivalTime: newEta,
      remainingDistance: parseFloat(newDistance.toFixed(1)),
      remainingTime: Math.ceil(newTime)
    };
  };

  // Nettoyer les ressources lors du démontage du composant
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    isTracking,
    isLoading,
    driverPosition,
    routePolyline,
    routePoints,
    eta,
    remainingDistance,
    remainingTime,
    startTracking,
    stopTracking
  };
}
