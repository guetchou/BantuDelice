
import { useState, useEffect } from 'react';

// Types simplifiées
type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_progress' | 'delivered' | 'cancelled';
type DeliveryPriority = 'low' | 'medium' | 'high' | 'urgent';
type DeliveryVehicleType = 'bike' | 'scooter' | 'car' | 'walk';
type DeliveryType = 'standard' | 'express' | 'scheduled';

interface DeliveryRequest {
  id: string;
  order_id: string;
  restaurant_id: string;
  assigned_driver_id?: string;
  status: DeliveryStatus;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_instructions?: string;
  priority: DeliveryPriority;
  delivery_fee: number;
  total_amount: number;
  created_at: string;
  delivery_type: DeliveryType;
}

interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  current_latitude: number;
  current_longitude: number;
  is_available: boolean;
  status: string;
  average_rating: number;
  total_deliveries: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  vehicle_type: DeliveryVehicleType;
  profile_picture?: string;
  commission_rate: number;
  last_location_update: string;
  current_location: {
    latitude: number;
    longitude: number;
  };
}

export function useDeliveryMapData(restaurantId: string, deliveryId?: string) {
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [restaurantCoords, setRestaurantCoords] = useState<[number, number]>([-4.2634, 15.2429]); // Brazzaville default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantCoords();
      fetchActiveDrivers();
      fetchDeliveries();
    }
  }, [restaurantId, deliveryId]);

  const fetchRestaurantCoords = async () => {
    try {
      // Simulate fetching restaurant coordinates
      console.log(`Fetching coordinates for restaurant ${restaurantId}`);
      setTimeout(() => {
        // Sample data for demonstration
        setRestaurantCoords([-4.2634, 15.2429]);
      }, 500);
    } catch (error) {
      console.error('Error fetching restaurant coordinates:', error);
    }
  };

  const fetchActiveDrivers = async () => {
    try {
      // Simulate fetching active drivers
      console.log(`Fetching active drivers for restaurant ${restaurantId}`);
      setTimeout(() => {
        // Sample data for demonstration
        const mockDrivers: DeliveryDriver[] = [
          {
            id: '1',
            name: 'Jean Dupont',
            phone: '+242 123456789',
            current_latitude: -4.2634,
            current_longitude: 15.2429,
            is_available: true,
            status: 'available',
            average_rating: 4.7,
            total_deliveries: 128,
            total_earnings: 1250000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: 'user-1',
            vehicle_type: 'bike',
            profile_picture: '/assets/drivers/driver1.jpg',
            commission_rate: 0.1,
            last_location_update: new Date().toISOString(),
            current_location: {
              latitude: -4.2634,
              longitude: 15.2429
            }
          },
          {
            id: '2',
            name: 'Marie Kodia',
            phone: '+242 987654321',
            current_latitude: -4.2734,
            current_longitude: 15.2529,
            is_available: true,
            status: 'available',
            average_rating: 4.5,
            total_deliveries: 85,
            total_earnings: 780000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: 'user-2',
            vehicle_type: 'scooter',
            profile_picture: '/assets/drivers/driver2.jpg',
            commission_rate: 0.1,
            last_location_update: new Date().toISOString(),
            current_location: {
              latitude: -4.2734,
              longitude: 15.2529
            }
          }
        ];
        setDrivers(mockDrivers);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setLoading(false);
    }
  };

  const fetchDeliveries = async () => {
    try {
      // Simulate fetching deliveries
      console.log(`Fetching deliveries for restaurant ${restaurantId}`);
      setTimeout(() => {
        // Sample data for demonstration
        const mockDeliveries: DeliveryRequest[] = deliveryId 
          ? [
              {
                id: deliveryId,
                order_id: 'order-123',
                restaurant_id: restaurantId,
                assigned_driver_id: '1',
                status: 'assigned',
                delivery_address: '123 Avenue de la Paix, Brazzaville',
                delivery_latitude: -4.2834,
                delivery_longitude: 15.2629,
                delivery_instructions: 'Appartement au 3ème étage',
                priority: 'medium',
                delivery_fee: 2000,
                total_amount: 15000,
                created_at: new Date().toISOString(),
                delivery_type: 'standard'
              }
            ]
          : [
              {
                id: 'delivery-1',
                order_id: 'order-123',
                restaurant_id: restaurantId,
                assigned_driver_id: '1',
                status: 'assigned',
                delivery_address: '123 Avenue de la Paix, Brazzaville',
                delivery_latitude: -4.2834,
                delivery_longitude: 15.2629,
                delivery_instructions: 'Appartement au 3ème étage',
                priority: 'medium',
                delivery_fee: 2000,
                total_amount: 15000,
                created_at: new Date().toISOString(),
                delivery_type: 'standard'
              },
              {
                id: 'delivery-2',
                order_id: 'order-456',
                restaurant_id: restaurantId,
                assigned_driver_id: '2',
                status: 'picked_up',
                delivery_address: '45 Rue des Flamboyants, Brazzaville',
                delivery_latitude: -4.2934,
                delivery_longitude: 15.2729,
                delivery_instructions: 'Sonner à l\'interphone',
                priority: 'high',
                delivery_fee: 2500,
                total_amount: 22000,
                created_at: new Date().toISOString(),
                delivery_type: 'express'
              }
            ];
        setDeliveries(mockDeliveries);
      }, 600);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  };

  return {
    drivers,
    deliveries,
    restaurantCoords,
    loading
  };
}
