
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook for managing ride requests to drivers
 */
export function useDriverRequests() {
  const [isLoading, setIsLoading] = useState(false);

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
    requestDriver
  };
}
