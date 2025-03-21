
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryDriver, DeliveryRequest } from '@/types/delivery';
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
      
      // Mise à jour en temps réel des positions des livreurs
      const driversChannel = supabase
        .channel('realtime-drivers')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_drivers',
          filter: `restaurant_id=eq.${restaurantId}`
        }, () => {
          fetchActiveDrivers();
        })
        .subscribe();

      // Mise à jour en temps réel des livraisons
      const deliveriesChannel = supabase
        .channel('realtime-deliveries')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'delivery_requests',
          filter: `restaurant_id=eq.${restaurantId}`
        }, () => {
          fetchDeliveries();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(driversChannel);
        supabase.removeChannel(deliveriesChannel);
      };
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
      
      setDrivers(data || []);
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
      
      setDeliveries(data || []);
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
