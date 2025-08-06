
import { useState } from 'react';
import apiService from '@/services/api';
import { TaxiRideStatus } from '@/types/taxi';

/**
 * Hook to manage existing taxi bookings
 */
export function useTaxiBookingManage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelBooking = async (rideId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('taxi_rides')
        .update({ 
          status: TaxiRideStatus.CANCELLED,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', rideId);
        
      if (updateError) throw updateError;
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      console.error('Error cancelling booking:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    cancelBooking
  };
}
