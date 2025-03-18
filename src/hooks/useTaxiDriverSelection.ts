
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TaxiDriver } from '@/types/taxi';
import { calculateDistance, estimateDeliveryTime } from '@/utils/deliveryOptimization';

export function useTaxiDriverSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<TaxiDriver[]>([]);

  // Find the best drivers based on proximity, rating and availability
  const findOptimalDrivers = async (
    pickupLatitude: number,
    pickupLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number,
    vehicleType?: string
  ) => {
    try {
      setIsLoading(true);

      // Get all available drivers
      const { data: drivers, error } = await supabase
        .from('taxi_drivers')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      if (!drivers || drivers.length === 0) {
        return [];
      }

      // Filter by vehicle type if specified
      let filteredDrivers = drivers;
      if (vehicleType) {
        filteredDrivers = drivers.filter(driver => driver.vehicle_type === vehicleType);
      }

      // Calculate distances and estimated times
      const driversWithMetrics = filteredDrivers.map(driver => {
        // Distance from driver to pickup
        const distanceToPickup = calculateDistance(
          driver.current_latitude || 0,
          driver.current_longitude || 0,
          pickupLatitude,
          pickupLongitude
        );

        // Distance for the whole ride
        const rideDistance = calculateDistance(
          pickupLatitude,
          pickupLongitude,
          destinationLatitude,
          destinationLongitude
        );

        // Estimate time to pickup
        const timeToPickup = estimateDeliveryTime(distanceToPickup, driver.vehicle_type);

        // Calculate a composite score (lower is better)
        // Factors: distance to pickup (50%), driver rating (30%), experience (20%)
        const proximityScore = distanceToPickup * 5; // Weight distance heavily
        const ratingScore = (5 - driver.rating) * 3; // Invert rating (lower is better)
        const experienceScore = driver.total_rides ? (100 / Math.min(driver.total_rides, 100)) * 2 : 2;
        
        const score = proximityScore + ratingScore + experienceScore;

        return {
          ...driver,
          distance_to_pickup: distanceToPickup,
          ride_distance: rideDistance,
          time_to_pickup: timeToPickup,
          score: score
        };
      });

      // Sort by score (lower is better)
      driversWithMetrics.sort((a, b) => a.score - b.score);
      
      // Take top 5 drivers
      const topDrivers = driversWithMetrics.slice(0, 5);
      
      setNearbyDrivers(topDrivers);
      return topDrivers;
    } catch (error) {
      console.error('Error finding optimal drivers:', error);
      toast.error("Impossible de trouver des chauffeurs à proximité");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get a single driver's details
  const getDriverDetails = async (driverId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('taxi_drivers')
        .select('*')
        .eq('id', driverId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching driver details:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Request a specific driver
  const requestDriver = async (rideId: string, driverId: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('taxi_ride_requests')
        .insert([{ 
          ride_id: rideId, 
          driver_id: driverId,
          status: 'pending',
          requested_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Update the ride status
      const { error: rideError } = await supabase
        .from('taxi_rides')
        .update({ status: 'pending' })
        .eq('id', rideId);

      if (rideError) throw rideError;

      toast.success("Demande envoyée au chauffeur");
      return true;
    } catch (error) {
      console.error('Error requesting driver:', error);
      toast.error("Erreur lors de la demande de chauffeur");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    nearbyDrivers,
    findOptimalDrivers,
    getDriverDetails,
    requestDriver
  };
}
