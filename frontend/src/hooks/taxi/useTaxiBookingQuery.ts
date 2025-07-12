
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TaxiRide } from '@/types/taxi';

/**
 * Hook to query taxi booking data
 */
export function useTaxiBookingQuery() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserRides = async (): Promise<TaxiRide[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error: fetchError } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      return data as TaxiRide[] || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user rides';
      setError(errorMessage);
      console.error('Error fetching user rides:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getRideDetails = async (rideId: string): Promise<TaxiRide | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();
        
      if (fetchError) throw fetchError;
      
      return data as TaxiRide;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ride details';
      setError(errorMessage);
      console.error('Error fetching ride details:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getUserRides,
    getRideDetails
  };
}
