
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TaxiDriver } from '@/types/taxi';

/**
 * Hook for fetching individual driver details
 */
export function useDriverDetails() {
  const [isLoading, setIsLoading] = useState(false);

  const getDriverDetails = async (driverId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('taxi_drivers')
        .select('*')
        .eq('id', driverId)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;

      // Convert to our TaxiDriver type to ensure type safety
      const driver: TaxiDriver = {
        id: data.id,
        user_id: data.user_id,
        name: data.name || '',
        phone: data.phone || '',
        vehicle_type: data.vehicle_type || 'standard',
        vehicle_model: data.vehicle_model || '',
        license_plate: data.license_plate || '',
        photo_url: data.photo_url,
        rating: data.rating || 0,
        is_available: data.is_available || false,
        current_location: data.current_location,
        current_latitude: data.current_latitude,
        current_longitude: data.current_longitude,
        total_rides: data.total_rides,
        total_earnings: data.total_earnings,
        years_experience: data.years_experience,
        languages: data.languages,
        verified: data.verified,
        background_check_passed: data.background_check_passed,
        vehicle_inspection_date: data.vehicle_inspection_date,
        insurance_verified: data.insurance_verified
      };
      
      return driver;
    } catch (error) {
      console.error('Error fetching driver details:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getDriverDetails
  };
}
