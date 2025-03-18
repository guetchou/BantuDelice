
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TaxiRide, RideShareRequest } from '@/types/taxi';

export function useSharedRides(rideId: string | undefined, isSharingEnabled: boolean) {
  const [nearbySharedRides, setNearbySharedRides] = useState<TaxiRide[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSharingEnabled && rideId) {
      fetchNearbySharedRides();
    }
  }, [isSharingEnabled, rideId]);

  const fetchNearbySharedRides = async () => {
    if (!rideId) return;
    
    try {
      setLoading(true);
      
      // First get the current ride details
      const { data: currentRide } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();
        
      if (!currentRide) return;
      
      // Find nearby rides that could be shared
      const { data: ridesData } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('status', 'pending')
        .eq('is_shared_ride', true)
        .neq('id', rideId);
        
      if (ridesData && ridesData.length > 0) {
        // Convert to our TaxiRide type to ensure type safety
        const rides = ridesData.map(ride => ({
          id: ride.id,
          user_id: ride.user_id,
          pickup_address: ride.pickup_address,
          destination_address: ride.destination_address,
          pickup_time: ride.pickup_time,
          status: ride.status as TaxiRide['status'],
          driver_id: ride.driver_id,
          estimated_price: ride.estimated_price,
          actual_price: ride.actual_price,
          payment_status: ride.payment_status,
          vehicle_type: ride.vehicle_type,
          payment_method: ride.payment_method,
          pickup_latitude: ride.pickup_latitude,
          pickup_longitude: ride.pickup_longitude,
          destination_latitude: ride.destination_latitude,
          destination_longitude: ride.destination_longitude,
          special_instructions: ride.special_instructions,
          is_shared_ride: ride.is_shared_ride,
          max_passengers: ride.max_passengers,
          current_passengers: ride.current_passengers,
          estimated_arrival_time: ride.estimated_arrival_time,
          actual_arrival_time: ride.actual_arrival_time,
          distance_km: ride.distance_km,
          route_polyline: ride.route_polyline,
          promo_code_applied: ride.promo_code_applied,
          promo_discount: ride.promo_discount
        }));

        setNearbySharedRides(rides);
      } else {
        setNearbySharedRides([]);
      }
    } catch (error) {
      console.error('Error fetching shared rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinSharedRide = async (sharedRideId: string) => {
    try {
      setLoading(true);
      
      if (!rideId) {
        toast.error("Erreur: identifiant de course manquant");
        return;
      }
      
      // Create a ride share request
      const shareRequest: Omit<RideShareRequest, 'id' | 'created_at'> = {
        ride_id: sharedRideId,
        requester_id: rideId,
        status: 'pending',
        pickup_address: '',  // These would come from the current ride
        destination_address: '', 
        pickup_latitude: 0,
        pickup_longitude: 0,
        destination_latitude: 0,
        destination_longitude: 0
      };
      
      const { error } = await supabase
        .from('ride_share_requests')
        .insert(shareRequest);
        
      if (error) throw error;
      
      toast.success("Demande de covoiturage envoyée", {
        description: "Le conducteur validera votre demande rapidement"
      });
    } catch (error) {
      console.error('Error joining shared ride:', error);
      toast.error("Erreur lors de la demande de covoiturage");
    } finally {
      setLoading(false);
    }
  };

  return {
    nearbySharedRides,
    loading,
    joinSharedRide
  };
}
