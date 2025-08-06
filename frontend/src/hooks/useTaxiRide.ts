import { useState, useEffect, useCallback, useRef } from 'react';
import { taxiService, CreateRideRequest, RideEstimate } from '@/services/taxiService';
import { TaxiRide, RideStatus, VehicleType } from '@/types/taxi';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useTaxiRide = () => {
  const { user, token } = useAuth();
  const [currentRide, setCurrentRide] = useState<TaxiRide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (token && user) {
      const socket = taxiService.connectWebSocket(token);
      socketRef.current = socket;

      // Join user room
      taxiService.joinUserRoom(socket, user.id);

      // Set up event listeners
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        socket.close();
      };
    }
  }, [token, user]);

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.event) {
      case 'ride_created':
        setCurrentRide(data.ride);
        toast.success('Course créée avec succès');
        break;
      
      case 'driver_assigned':
        setCurrentRide(data.ride);
        toast.success('Chauffeur assigné à votre course');
        break;
      
      case 'driver_location_updated':
        if (data.rideId === currentRide?.id) {
          setDriverLocation({
            latitude: data.latitude,
            longitude: data.longitude
          });
        }
        break;
      
      case 'ride_status_updated':
        setCurrentRide(data.ride);
        handleRideStatusUpdate(data.status);
        break;
      
      case 'ride_cancelled':
        setCurrentRide(data.ride);
        toast.info('Course annulée');
        break;
      
      case 'error':
        toast.error(data.message);
        setError(data.message);
        break;
    }
  }, [currentRide]);

  const handleRideStatusUpdate = useCallback((status: RideStatus) => {
    switch (status) {
      case 'accepted':
        toast.success('Chauffeur en route');
        break;
      case 'arriving':
        toast.info('Chauffeur arrive bientôt');
        break;
      case 'arrived':
        toast.success('Chauffeur arrivé');
        break;
      case 'in_progress':
        toast.info('Trajet en cours');
        break;
      case 'completed':
        toast.success('Trajet terminé');
        break;
      case 'cancelled':
        toast.info('Course annulée');
        break;
    }
  }, []);

  // Create a new ride
  const createRide = useCallback(async (rideData: CreateRideRequest): Promise<TaxiRide | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ride = await taxiService.createRide(rideData);
      setCurrentRide(ride);
      
      // Send via WebSocket for real-time updates
      if (socketRef.current && user) {
        taxiService.requestRideWS(socketRef.current, { ...rideData, userId: user.id });
      }
      
      return ride;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de la course';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Calculate ride estimate
  const calculateEstimate = useCallback(async (
    pickupLat: number,
    pickupLng: number,
    destLat: number,
    destLng: number,
    vehicleType: VehicleType
  ): Promise<RideEstimate | null> => {
    try {
      const estimate = await taxiService.calculateEstimate(
        pickupLat,
        pickupLng,
        destLat,
        destLng,
        vehicleType
      );
      return estimate;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du calcul de l\'estimation';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Cancel current ride
  const cancelRide = useCallback(async (): Promise<boolean> => {
    if (!currentRide) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await taxiService.cancelRide(currentRide.id);
      
      // Send via WebSocket
      if (socketRef.current && user) {
        taxiService.cancelRideWS(socketRef.current, currentRide.id, user.id);
      }
      
      setCurrentRide(null);
      toast.success('Course annulée avec succès');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentRide, user]);

  // Rate a completed ride
  const rateRide = useCallback(async (
    rideId: string,
    rating: number,
    comment?: string,
    categories?: any
  ): Promise<boolean> => {
    try {
      await taxiService.rateRide(rideId, { rating, comment, categories });
      toast.success('Évaluation enregistrée');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'évaluation';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Get user ride history
  const getUserRides = useCallback(async (page: number = 1, limit: number = 10) => {
    try {
      const result = await taxiService.getUserRides(page, limit);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération des courses';
      setError(errorMessage);
      toast.error(errorMessage);
      return { rides: [], total: 0 };
    }
  }, []);

  // Find nearby drivers
  const findNearbyDrivers = useCallback(async (
    latitude: number,
    longitude: number,
    vehicleType: VehicleType,
    radius: number = 5
  ) => {
    try {
      const drivers = await taxiService.findNearbyDrivers(latitude, longitude, vehicleType, radius);
      setNearbyDrivers(drivers);
      return drivers;
    } catch (err: any) {
      console.error('Error finding nearby drivers:', err);
      return [];
    }
  }, []);

  // Get pricing information
  const getPricing = useCallback(async (vehicleType?: VehicleType) => {
    try {
      const pricing = await taxiService.getPricing(vehicleType);
      return pricing;
    } catch (err: any) {
      console.error('Error getting pricing:', err);
      return null;
    }
  }, []);

  // Update ride status (for drivers)
  const updateRideStatus = useCallback(async (
    rideId: string,
    status: RideStatus
  ): Promise<boolean> => {
    try {
      const updatedRide = await taxiService.updateRideStatus(rideId, status);
      
      // Send via WebSocket
      if (socketRef.current) {
        taxiService.updateRideStatusWS(socketRef.current, { rideId, status });
      }
      
      setCurrentRide(updatedRide);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du statut';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Update driver location (for drivers)
  const updateDriverLocation = useCallback(async (
    latitude: number,
    longitude: number,
    rideId?: string
  ): Promise<void> => {
    try {
      await taxiService.updateDriverLocation(latitude, longitude);
      
      // Send via WebSocket
      if (socketRef.current && user) {
        taxiService.updateDriverLocationWS(socketRef.current, {
          driverId: user.id,
          latitude,
          longitude,
          rideId
        });
      }
    } catch (err: any) {
      console.error('Error updating driver location:', err);
    }
  }, [user]);

  // Accept ride (for drivers)
  const acceptRide = useCallback(async (rideId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedRide = await taxiService.assignDriver(rideId, user.id);
      
      // Send via WebSocket
      if (socketRef.current) {
        taxiService.acceptRideWS(socketRef.current, rideId, user.id);
      }
      
      setCurrentRide(updatedRide);
      toast.success('Course acceptée');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'acceptation de la course';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [user]);

  return {
    // State
    currentRide,
    isLoading,
    error,
    driverLocation,
    nearbyDrivers,
    
    // Actions
    createRide,
    calculateEstimate,
    cancelRide,
    rateRide,
    getUserRides,
    findNearbyDrivers,
    getPricing,
    updateRideStatus,
    updateDriverLocation,
    acceptRide,
    
    // Utilities
    clearError: () => setError(null),
    clearCurrentRide: () => setCurrentRide(null),
  };
}; 