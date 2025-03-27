
import { useState } from 'react';
import { TaxiRide, RideShareRequest } from '@/types/taxi';
import { toast } from 'sonner';
import { calculateDistance } from '@/utils/geoUtils';

interface SharedRideOptions {
  maxDetour: number; // Distance maximale de détour en km
  maxTimeOffset: number; // Temps supplémentaire maximal en minutes
  discountPercentage: number; // Réduction sur le prix pour course partagée
}

/**
 * Hook pour la gestion des courses partagées
 */
export function useSharedRides() {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedRides, setMatchedRides] = useState<TaxiRide[]>([]);
  const [sharedRideOptions, setSharedRideOptions] = useState<SharedRideOptions>({
    maxDetour: 2.5, // Maximum 2.5 km de détour
    maxTimeOffset: 15, // Maximum 15 minutes de détour
    discountPercentage: 25 // 25% de réduction sur le prix
  });

  /**
   * Trouve des courses compatibles pour le partage
   */
  const findCompatibleRides = async (
    pickupLat: number,
    pickupLng: number, 
    destLat: number,
    destLng: number,
    pickupTime: Date
  ): Promise<TaxiRide[]> => {
    setIsLoading(true);
    
    try {
      // Dans un système réel, cette requête interrogerait la base de données
      // pour trouver des courses avec des origines/destinations proches
      
      // Simulons des données pour la démo
      const mockActiveRides: TaxiRide[] = [
        {
          id: 'ride-123',
          user_id: 'user-456',
          driver_id: 'driver-789',
          pickup_address: 'Avenue de la Paix, Brazzaville',
          pickup_latitude: pickupLat + 0.015,
          pickup_longitude: pickupLng + 0.01,
          destination_address: 'Aéroport Maya-Maya, Brazzaville',
          destination_latitude: destLat + 0.02,
          destination_longitude: destLng + 0.01,
          pickup_time: new Date(pickupTime.getTime() + 10 * 60000).toISOString(), // +10 min
          pickup_time_type: 'scheduled',
          status: 'pending',
          vehicle_type: 'standard',
          payment_method: 'cash',
          estimated_price: 7000,
          actual_price: null,
          created_at: new Date().toISOString(),
          is_shared_ride: true,
          max_passengers: 4,
          current_passengers: 1
        },
        {
          id: 'ride-456',
          user_id: 'user-789',
          driver_id: null,
          pickup_address: 'Marché Total, Brazzaville',
          pickup_latitude: pickupLat - 0.01,
          pickup_longitude: pickupLng - 0.02,
          destination_address: 'Université Marien Ngouabi, Brazzaville',
          destination_latitude: destLat - 0.03,
          destination_longitude: destLng - 0.01,
          pickup_time: new Date(pickupTime.getTime() + 5 * 60000).toISOString(), // +5 min
          pickup_time_type: 'scheduled',
          status: 'pending',
          vehicle_type: 'standard',
          payment_method: 'mobile_money',
          estimated_price: 4500,
          actual_price: null,
          created_at: new Date().toISOString(),
          is_shared_ride: true,
          max_passengers: 4,
          current_passengers: 2
        }
      ];
      
      // Filtrer les courses compatibles
      const compatibleRides = mockActiveRides.filter(ride => {
        // Vérifier si le ride accepte encore des passagers
        if (!ride.is_shared_ride || !ride.max_passengers || ride.status !== 'pending') {
          return false;
        }
        
        if (ride.current_passengers && ride.max_passengers && 
            ride.current_passengers >= ride.max_passengers) {
          return false;
        }
        
        // Calculer la distance entre les points de prise en charge
        const pickupDistance = calculateDistance(
          pickupLat, pickupLng,
          ride.pickup_latitude, ride.pickup_longitude
        );
        
        // Calculer la distance entre les destinations
        const destDistance = calculateDistance(
          destLat, destLng,
          ride.destination_latitude, ride.destination_longitude
        );
        
        // Calculer la différence de temps
        const rideTime = new Date(ride.pickup_time).getTime();
        const requestedTime = pickupTime.getTime();
        const timeDiffMinutes = Math.abs(rideTime - requestedTime) / (60 * 1000);
        
        // Vérifier si les critères sont respectés
        return (
          pickupDistance <= sharedRideOptions.maxDetour &&
          destDistance <= sharedRideOptions.maxDetour * 2 && // Tolérance plus grande pour la destination
          timeDiffMinutes <= sharedRideOptions.maxTimeOffset
        );
      });
      
      setMatchedRides(compatibleRides);
      return compatibleRides;
    } catch (error) {
      console.error('Erreur lors de la recherche de courses compatibles:', error);
      toast.error('Impossible de trouver des courses compatibles');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calcule le prix d'une course partagée
   */
  const calculateSharedRidePrice = (originalPrice: number): number => {
    const discountMultiplier = 1 - (sharedRideOptions.discountPercentage / 100);
    return Math.round(originalPrice * discountMultiplier);
  };

  /**
   * Demande à rejoindre une course partagée
   */
  const requestJoinRide = async (
    rideId: string,
    userId: string,
    pickupAddress: string,
    pickupLat: number,
    pickupLng: number,
    destAddress: string,
    destLat: number,
    destLng: number
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Dans un système réel, cette requête enverrait une demande
      // à l'API pour rejoindre la course partagée
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Création d'une demande de partage (simulée)
      const shareRequest: Omit<RideShareRequest, 'id' | 'created_at'> = {
        ride_id: rideId,
        user_id: userId,
        status: 'pending',
        requested_at: new Date().toISOString(),
        pickup_address: pickupAddress,
        pickup_latitude: pickupLat,
        pickup_longitude: pickupLng,
      };
      
      // Succès simulé
      toast.success('Demande de partage envoyée', {
        description: 'Le passager principal sera notifié de votre demande'
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de partage:', error);
      toast.error('Impossible de rejoindre cette course');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Accepte une demande de partage de course
   */
  const acceptShareRequest = async (requestId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Demande de partage acceptée', {
        description: 'Le passager a été ajouté à votre course'
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error);
      toast.error('Impossible d\'accepter cette demande');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refuse une demande de partage de course
   */
  const rejectShareRequest = async (requestId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Demande de partage refusée');
      
      return true;
    } catch (error) {
      console.error('Erreur lors du refus de la demande:', error);
      toast.error('Impossible de refuser cette demande');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Met à jour les options de courses partagées
   */
  const updateSharedRideOptions = (options: Partial<SharedRideOptions>) => {
    setSharedRideOptions(prev => ({
      ...prev,
      ...options
    }));
  };

  return {
    isLoading,
    matchedRides,
    sharedRideOptions,
    findCompatibleRides,
    calculateSharedRidePrice,
    requestJoinRide,
    acceptShareRequest,
    rejectShareRequest,
    updateSharedRideOptions
  };
}
