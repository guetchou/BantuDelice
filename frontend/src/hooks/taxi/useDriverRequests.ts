
import { useState } from 'react';
import apiService from '@/services/api';
import { TaxiRideRequest } from '@/types/taxi';

export function useDriverRequests() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Request a specific driver for a ride
   */
  const requestDriver = async (rideId: string, driverId: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const requestData: Omit<TaxiRideRequest, 'id'> = {
        ride_id: rideId,
        driver_id: driverId,
        status: 'pending',
        requested_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('taxi_ride_requests')
        .insert(requestData);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error requesting driver:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    requestDriver
  };
}
