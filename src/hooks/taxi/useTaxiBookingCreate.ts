
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TaxiRide, TaxiRideStatus, PaymentMethod, TaxiVehicleType } from '@/types/taxi';

/**
 * Hook to manage taxi booking creation
 */
export function useTaxiBookingCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: Partial<TaxiRide>): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const newRide = {
        user_id: userData.user.id,
        status: TaxiRideStatus.REQUESTED,
        created_at: new Date().toISOString(),
        ...bookingData
      };
      
      // Create the taxi ride
      const { data, error: insertError } = await supabase
        .from('taxi_rides')
        .insert(newRide)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return data?.id || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      console.error('Error creating booking:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createBooking
  };
}
