
import { useState } from 'react';
import apiService from '@/services/api';
import { TaxiDriver } from '@/types/taxi';

export function useDriverDetails() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Gets details for a specific driver
   */
  const getDriverDetails = async (driverId: string): Promise<TaxiDriver | null> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('taxi_drivers')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) throw error;

      if (!data) {
        return null;
      }

      // Mock data for development - in production this would come from the database
      const mockDriver: TaxiDriver = {
        id: driverId,
        user_id: "u1",
        name: "Jean Dupont",
        phone: "+242612345678",
        vehicle_type: "standard",
        vehicle_model: "Toyota Corolla",
        license_plate: "BZV 1234",
        photo_url: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 4.8,
        is_available: true,
        current_latitude: 4.2634,
        current_longitude: 15.2429,
        total_rides: 284,
        years_experience: 3,
        languages: ["Français", "Lingala"],
        verified: true
      };

      return mockDriver;
    } catch (error) {
      console.error('Error getting driver details:', error);
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
