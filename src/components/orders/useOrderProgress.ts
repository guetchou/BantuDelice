
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrderStatus } from '@/types/order';
import { formatTimeString } from '@/utils/dateFormatters';

export function useOrderProgress(initialStatus: OrderStatus, orderId: string) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>(true);

  useEffect(() => {
    // Set initial status
    setStatus(initialStatus);
    
    // Subscribe to changes in order status
    const orderSubscription = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders', 
          filter: `id=eq.${orderId}` 
        }, 
        (payload) => {
          if (payload.new && payload.new.status) {
            setStatus(payload.new.status as OrderStatus);
          }
          
          if (payload.new && payload.new.estimated_delivery_time) {
            const formattedTime = formatTimeString(payload.new.estimated_delivery_time);
            setEstimatedTime(formattedTime);
          }

          // Check if restaurant is open for this order
          if (payload.new && payload.new.restaurant_id) {
            checkRestaurantOpenStatus(payload.new.restaurant_id);
          }
        }
      )
      .subscribe();
    
    // Subscribe to changes in delivery status
    const deliverySubscription = supabase
      .channel(`delivery-${orderId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'delivery_tracking', 
          filter: `order_id=eq.${orderId}` 
        }, 
        (payload) => {
          if (payload.new && payload.new.status) {
            setDeliveryStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    // Fetch initial delivery status
    const fetchInitialDeliveryStatus = async () => {
      const { data } = await supabase
        .from('delivery_tracking')
        .select('status')
        .eq('order_id', orderId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        setDeliveryStatus(data.status);
      }
    };

    // Fetch initial estimated time
    const fetchEstimatedTime = async () => {
      const { data } = await supabase
        .from('orders')
        .select('estimated_delivery_time, restaurant_id')
        .eq('id', orderId)
        .single();
      
      if (data) {
        if (data.estimated_delivery_time) {
          const formattedTime = formatTimeString(data.estimated_delivery_time);
          setEstimatedTime(formattedTime);
        }
        if (data.restaurant_id) {
          checkRestaurantOpenStatus(data.restaurant_id);
        }
      }
    };

    const checkRestaurantOpenStatus = async (restaurantId: string) => {
      const { data } = await supabase
        .from('restaurants')
        .select('is_open')
        .eq('id', restaurantId)
        .single();
      
      if (data) {
        setIsRestaurantOpen(!!data.is_open);
      }
    };

    fetchInitialDeliveryStatus();
    fetchEstimatedTime();

    return () => {
      supabase.removeChannel(orderSubscription);
      supabase.removeChannel(deliverySubscription);
    };
  }, [orderId, initialStatus]);

  return {
    status,
    deliveryStatus,
    estimatedTime,
    isRestaurantOpen
  };
}
