
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useTaxiBookingQuery() {
  const [isLoading, setIsLoading] = useState(false);

  // Get user's rides
  const getUserRides = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('user_id', user.id)
        .order('pickup_time', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching user rides:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get ride details
  const getRideDetails = async (rideId: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching ride details:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getUserRides,
    getRideDetails
  };
}
