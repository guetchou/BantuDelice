
import { useState } from 'react';
import { TaxiDriver } from '@/types/taxi';

/**
 * Hook to manage taxi driver selection
 */
export function useTaxiDriverSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<TaxiDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<TaxiDriver | null>(null);
  
  const findOptimalDrivers = async (
    pickupLatitude?: number,
    pickupLongitude?: number,
    destinationLatitude?: number,
    destinationLongitude?: number,
    vehicleType?: string
  ) => {
    setIsLoading(true);
    try {
      // Simulation of an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch drivers from the backend
      const mockDrivers: TaxiDriver[] = [
        {
          id: '1',
          user_id: 'user-123',
          name: 'Jean Dupont',
          phone: '+242 06 123 4567',
          vehicle_type: 'standard',
          license_plate: 'BZV 1234',
          rating: 4.8,
          is_available: true,
          current_latitude: pickupLatitude ? pickupLatitude + 0.01 : -4.2634 + 0.01,
          current_longitude: pickupLongitude ? pickupLongitude - 0.01 : 15.2429 - 0.01,
          photo_url: 'https://randomuser.me/api/portraits/men/32.jpg',
          vehicle_model: 'Toyota Corolla',
          languages: ['Français', 'Lingala'],
          years_experience: 5,
          total_rides: 342,
          verified: true,
          location: [pickupLatitude ? pickupLatitude + 0.01 : -4.2634 + 0.01, pickupLongitude ? pickupLongitude - 0.01 : 15.2429 - 0.01],
          status: 'available'
        },
        {
          id: '2',
          user_id: 'user-456',
          name: 'Marie Okemba',
          phone: '+242 05 234 5678',
          vehicle_type: 'standard',
          license_plate: 'BZV 5678',
          rating: 4.6,
          is_available: true,
          current_latitude: pickupLatitude ? pickupLatitude - 0.005 : -4.2634 - 0.005,
          current_longitude: pickupLongitude ? pickupLongitude + 0.007 : 15.2429 + 0.007,
          photo_url: 'https://randomuser.me/api/portraits/women/44.jpg',
          vehicle_model: 'Hyundai Accent',
          languages: ['Français', 'Anglais'],
          years_experience: 3,
          total_rides: 187,
          verified: true,
          location: [pickupLatitude ? pickupLatitude - 0.005 : -4.2634 - 0.005, pickupLongitude ? pickupLongitude + 0.007 : 15.2429 + 0.007],
          status: 'available'
        }
      ];
      
      setNearbyDrivers(mockDrivers);
      return mockDrivers;
    } catch (error) {
      console.error('Error finding drivers:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const getDriverDetails = async (driverId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const driver = nearbyDrivers.find(d => d.id === driverId) || null;
      return driver;
    } catch (error) {
      console.error('Error getting driver details:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const requestDriver = async (driverId: string, rideId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Driver request successfully sent'
      };
    } catch (error) {
      console.error('Error requesting driver:', error);
      return {
        success: false,
        message: 'Failed to request driver'
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectDriver = (driver: TaxiDriver) => {
    setSelectedDriver(driver);
  };
  
  return {
    isLoading,
    nearbyDrivers,
    selectedDriver,
    findOptimalDrivers,
    getDriverDetails,
    requestDriver,
    handleSelectDriver
  };
}
