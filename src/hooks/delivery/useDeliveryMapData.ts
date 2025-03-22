
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliveryRequest, DeliveryDriverStatus, DeliveryVehicleType, DeliveryStatus, DeliveryPriority, DeliveryType } from '@/types/delivery';
import { useToast } from '@/hooks/use-toast';

export function useDeliveryMapData(restaurantId: string, deliveryId?: string) {
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [restaurantCoords, setRestaurantCoords] = useState<[number, number]>([-4.2634, 15.2429]); // Brazzaville default
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantCoords();
      fetchActiveDrivers();
      fetchDeliveries();
    }
  }, [restaurantId, deliveryId]);

  const fetchRestaurantCoords = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('latitude, longitude')
        .eq('id', restaurantId)
        .single();

      if (error) throw error;
      
      if (data) {
        setRestaurantCoords([data.latitude, data.longitude]);
      }
    } catch (error) {
      console.error('Error fetching restaurant coordinates:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les coordonnées du restaurant',
        variant: 'destructive',
      });
    }
  };

  const fetchActiveDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_drivers')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .in('status', ['available', 'busy']);

      if (error) throw error;
      
      // Conversion vers le type DeliveryDriver
      if (data) {
        const formattedDrivers: DeliveryDriver[] = data.map(driver => ({
          id: driver.id,
          name: driver.name || 'Sans nom',
          phone: driver.phone || '',
          current_latitude: driver.current_latitude,
          current_longitude: driver.current_longitude,
          is_available: driver.is_available || true,
          status: (driver.status || 'available') as DeliveryDriverStatus,
          average_rating: driver.average_rating || 0,
          total_deliveries: driver.total_deliveries || 0,
          total_earnings: driver.total_earnings || 0,
          created_at: driver.created_at,
          updated_at: driver.updated_at || driver.created_at,
          commission_rate: driver.commission_rate,
          last_location_update: driver.last_location_update,
          user_id: driver.user_id,
          vehicle_type: (driver.vehicle_type || 'bike') as DeliveryVehicleType,
          profile_picture: driver.profile_picture,
          current_location: driver.current_location
        }));
        setDrivers(formattedDrivers);
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les livreurs actifs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveries = async () => {
    try {
      let query = supabase
        .from('delivery_requests')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .in('status', ['assigned', 'picked_up', 'delivering']);

      if (deliveryId) {
        query = query.eq('id', deliveryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      if (data) {
        const formattedDeliveries: DeliveryRequest[] = data.map(d => ({
          id: d.id,
          order_id: d.order_id,
          restaurant_id: d.restaurant_id,
          assigned_driver_id: d.assigned_driver_id,
          status: d.status as DeliveryStatus,
          delivery_address: d.delivery_address || '',
          delivery_latitude: d.delivery_latitude,
          delivery_longitude: d.delivery_longitude,
          delivery_instructions: d.delivery_instructions,
          priority: (d.priority || 'medium') as DeliveryPriority,
          delivery_fee: d.delivery_fee || 0,
          total_amount: d.total_amount || 0,
          created_at: d.created_at,
          delivery_type: (d.delivery_type || 'standard') as DeliveryType
        }));
        setDeliveries(formattedDeliveries);
      } else {
        setDeliveries([]);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les livraisons',
        variant: 'destructive',
      });
    }
  };

  return {
    drivers,
    deliveries,
    restaurantCoords,
    loading
  };
}
