
import { useState, useEffect } from 'react';
import { TaxiRide, TaxiDriver } from '@/types/taxi';
import { taxiRideService, taxiDriverService, taxiRideRequestService } from '@/services/apiService';
import { toast } from 'sonner';

/**
 * Type pour représenter une position sur la carte
 */
interface MapPosition {
  latitude: number;
  longitude: number;
  label?: string;
  icon?: string;
}

/**
 * Hook pour le suivi en temps réel d'une course de taxi
 */
export function useTaxiRideTracking(rideId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [driver, setDriver] = useState<TaxiDriver | null>(null);
  const [driverLocation, setDriverLocation] = useState<MapPosition | null>(null);
  const [pickupLocation, setPickupLocation] = useState<MapPosition | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<MapPosition | null>(null);
  const [routePoints, setRoutePoints] = useState<MapPosition[]>([]);
  const [estimatedArrival, setEstimatedArrival] = useState<Date | null>(null);
  const [trackingInterval, setTrackingIntervalId] = useState<number | null>(null);
  
  /**
   * Récupère les détails d'une course
   */
  const fetchRideDetails = async () => {
    if (!rideId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await taxiRideService.getById(rideId);
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      if (!response.data) {
        throw new Error('Course non trouvée');
      }
      
      const rideData = response.data as TaxiRide;
      setRide(rideData);
      
      // Configurer les points de départ et d'arrivée
      setPickupLocation({
        latitude: rideData.pickup_latitude,
        longitude: rideData.pickup_longitude,
        label: 'Départ',
        icon: 'pickup'
      });
      
      setDestinationLocation({
        latitude: rideData.destination_latitude,
        longitude: rideData.destination_longitude,
        label: 'Destination',
        icon: 'destination'
      });
      
      // Si un chauffeur est assigné, récupérer ses informations
      if (rideData.driver_id) {
        await fetchDriverDetails(rideData.driver_id);
      }
      
      // Récupérer l'itinéraire si disponible
      if (rideData.route_polyline) {
        decodeRoutePolyline(rideData.route_polyline);
      } else {
        // Sinon, générer un itinéraire fictif pour la démo
        generateDemoRoute(
          [rideData.pickup_latitude, rideData.pickup_longitude],
          [rideData.destination_latitude, rideData.destination_longitude]
        );
      }
      
      // Si l'heure d'arrivée estimée est disponible
      if (rideData.estimated_arrival_time) {
        setEstimatedArrival(new Date(rideData.estimated_arrival_time));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de récupération de la course';
      setError(errorMessage);
      toast.error('Erreur de suivi', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Récupère les détails d'un chauffeur
   */
  const fetchDriverDetails = async (driverId: string) => {
    try {
      const response = await taxiDriverService.getById(driverId);
      
      if (response.error || !response.data) {
        throw new Error('Chauffeur non trouvé');
      }
      
      const driverData = response.data as TaxiDriver;
      setDriver(driverData);
      
      // Définir la position initiale du chauffeur
      setDriverLocation({
        latitude: driverData.current_latitude,
        longitude: driverData.current_longitude,
        label: driverData.name,
        icon: 'driver'
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du chauffeur:', error);
      // Ne pas afficher d'erreur à l'utilisateur ici, car c'est secondaire
    }
  };
  
  /**
   * Démarre le suivi en temps réel de la course
   */
  const startTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
    }
    
    // Rafraîchir les données toutes les 15 secondes
    const intervalId = window.setInterval(() => {
      fetchRideDetails();
    }, 15000);
    
    setTrackingIntervalId(intervalId);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  };
  
  /**
   * Arrête le suivi en temps réel
   */
  const stopTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingIntervalId(null);
    }
  };
  
  /**
   * Décode un polyline encodé en série de points
   */
  const decodeRoutePolyline = (polyline: string) => {
    // Cette fonction décode un encodage polyline de Google Maps
    // Pour le moment, on utilise un tracé fictif
    const demoPoints = generateDemoRoute(
      ride?.pickup_latitude && ride?.pickup_longitude
        ? [ride.pickup_latitude, ride.pickup_longitude]
        : [-4.2634, 15.2429],
      ride?.destination_latitude && ride?.destination_longitude
        ? [ride.destination_latitude, ride.destination_longitude]
        : [-4.2515, 15.2534]
    );
    
    setRoutePoints(demoPoints);
  };
  
  /**
   * Génère un tracé fictif entre deux points pour la démo
   */
  const generateDemoRoute = (
    start: [number, number],
    end: [number, number]
  ): MapPosition[] => {
    const points: MapPosition[] = [];
    const numPoints = 10; // Nombre de points intermédiaires
    
    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      
      // Interpolation linéaire entre les points de départ et d'arrivée
      const lat = start[0] + (end[0] - start[0]) * fraction;
      const lng = start[1] + (end[1] - start[1]) * fraction;
      
      // Ajouter un peu de variation pour simuler une route réelle
      const jitter = 0.001; // ~100m 
      const randomLat = lat + (Math.random() - 0.5) * jitter;
      const randomLng = lng + (Math.random() - 0.5) * jitter;
      
      points.push({
        latitude: randomLat,
        longitude: randomLng
      });
    }
    
    return points;
  };
  
  /**
   * Envoie un message au chauffeur
   */
  const contactDriver = async (message: string) => {
    if (!ride || !driver) {
      toast.error('Impossible de contacter le chauffeur', {
        description: 'Aucun chauffeur assigné à cette course'
      });
      return false;
    }
    
    // Simuler l'envoi du message
    toast.success('Message envoyé', {
      description: `Votre message a été envoyé à ${driver.name}`
    });
    
    return true;
  };
  
  /**
   * Rafraîchit manuellement les données de suivi
   */
  const refreshTracking = () => {
    fetchRideDetails();
  };
  
  // Charger les détails de la course au montage du composant
  useEffect(() => {
    if (rideId) {
      fetchRideDetails();
    }
    
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [rideId]);

  return {
    loading,
    error,
    ride,
    driver,
    driverLocation,
    pickupLocation,
    destinationLocation,
    routePoints,
    estimatedArrival,
    startTracking,
    stopTracking,
    refreshTracking,
    contactDriver
  };
}
