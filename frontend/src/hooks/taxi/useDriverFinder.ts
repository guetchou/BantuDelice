
import { useState } from 'react';
import apiService from '@/services/api';
import { TaxiDriver } from '@/types/taxi';
import { calculateDistance } from '@/utils/deliveryOptimization';

export function useDriverFinder() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Finds the optimal drivers based on pickup and destination coordinates
   */
  const findOptimalDrivers = async (
    pickupLatitude: number,
    pickupLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number,
    vehicleType?: string
  ): Promise<TaxiDriver[]> => {
    try {
      setIsLoading(true);

      // In a real implementation, this would query the database for active drivers
      // and calculate their distance to the pickup point
      const { data, error } = await supabase
        .from('taxi_drivers')
        .select('*')
        .eq('is_available', true)
        .order('last_location_update', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Mock data for development - in production this would come from the database
      const mockDrivers: TaxiDriver[] = [
        {
          id: "d1",
          user_id: "u1",
          name: "Jean Dupont",
          phone: "+242612345678",
          vehicle_type: vehicleType as TaxiVehicleType || "standard",
          vehicle_info: {
            make: "Toyota",
            model: "Corolla",
            year: 2019,
            color: "Silver",
            license_plate: "BZV 1234"
          },
          license_number: "DL-123456",
          status: 'available',
          rating: 4.8,
          is_available: true,
          current_latitude: pickupLatitude + (Math.random() * 0.02 - 0.01),
          current_longitude: pickupLongitude + (Math.random() * 0.02 - 0.01),
          total_rides: 284,
          years_experience: 3,
          languages: ["Français", "Lingala"],
          verified: true,
          photo_url: "https://randomuser.me/api/portraits/men/1.jpg",
          vehicle_model: "Toyota Corolla",
          license_plate: "BZV 1234"
        },
        {
          id: "d2",
          user_id: "u2",
          name: "Marie Mbemba",
          phone: "+242698765432",
          vehicle_type: "premium",
          vehicle_info: {
            make: "Mercedes",
            model: "C-Class",
            year: 2021,
            color: "Black",
            license_plate: "BZV 5678"
          },
          license_number: "DL-789012",
          status: 'available',
          rating: 4.9,
          is_available: true,
          current_latitude: pickupLatitude + (Math.random() * 0.02 - 0.01),
          current_longitude: pickupLongitude + (Math.random() * 0.02 - 0.01),
          total_rides: 412,
          years_experience: 5,
          languages: ["Français", "Anglais"],
          verified: true,
          photo_url: "https://randomuser.me/api/portraits/women/2.jpg",
          vehicle_model: "Mercedes C-Class",
          license_plate: "BZV 5678"
        },
        {
          id: "d3",
          user_id: "u3",
          name: "David Moussa",
          phone: "+242654321987",
          vehicle_type: "standard",
          vehicle_info: {
            make: "Hyundai",
            model: "Elantra",
            year: 2020,
            color: "White",
            license_plate: "BZV 9012"
          },
          license_number: "DL-345678",
          status: 'available',
          rating: 4.6,
          is_available: true,
          current_latitude: pickupLatitude + (Math.random() * 0.02 - 0.01),
          current_longitude: pickupLongitude + (Math.random() * 0.02 - 0.01),
          total_rides: 156,
          years_experience: 2,
          languages: ["Français"],
          verified: true,
          photo_url: "https://randomuser.me/api/portraits/men/3.jpg",
          vehicle_model: "Hyundai Elantra",
          license_plate: "BZV 9012"
        }
      ];
      
      // Filter by vehicle type if provided
      const filteredDrivers = vehicleType 
        ? mockDrivers.filter(driver => driver.vehicle_type === vehicleType)
        : mockDrivers;
      
      // Sort drivers by distance to pickup
      return filteredDrivers.sort((a, b) => {
        if (!a.current_latitude || !a.current_longitude || !b.current_latitude || !b.current_longitude) {
          return 0;
        }
        
        const distanceA = calculateDistance(
          pickupLatitude, 
          pickupLongitude, 
          a.current_latitude, 
          a.current_longitude
        );
        
        const distanceB = calculateDistance(
          pickupLatitude, 
          pickupLongitude, 
          b.current_latitude, 
          b.current_longitude
        );
        
        return distanceA - distanceB;
      });
    } catch (error) {
      console.error('Error finding optimal drivers:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    findOptimalDrivers
  };
}
