
import { useState, useEffect } from 'react';
import { OrderStatus } from '@/types/order';
import { DeliveryStatus } from '@/types/delivery';
import apiService from '@/services/api';

export const useOrderProgress = (initialStatus: OrderStatus, orderId: string) => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>(true);

  useEffect(() => {
    // Update status from initial prop
    setStatus(initialStatus);
    
    // Fetch restaurant status and delivery details
    const fetchOrderDetails = async () => {
      try {
        // Get order details to check restaurant
        const { data: orderData } = await supabase
          .from('orders')
          .select('restaurant_id, estimated_delivery_time')
          .eq('id', orderId)
          .single();
          
        if (orderData?.estimated_delivery_time) {
          const estimatedDate = new Date(orderData.estimated_delivery_time);
          setEstimatedTime(estimatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        
        // Check if restaurant is open
        if (orderData?.restaurant_id) {
          const { data: restaurantData } = await supabase
            .from('restaurants')
            .select('is_open')
            .eq('id', orderData.restaurant_id)
            .single();
            
          if (restaurantData) {
            setIsRestaurantOpen(!!restaurantData.is_open);
          }
        }
        
        // Get delivery status
        const { data: deliveryData } = await supabase
          .from('delivery_requests')
          .select('status')
          .eq('order_id', orderId)
          .single();
          
        if (deliveryData) {
          setDeliveryStatus(deliveryData.status as DeliveryStatus);
        }
      } catch (error) {
        console.error('Error fetching order progress details:', error);
      }
    };
    
    fetchOrderDetails();
    
    // Set up subscription for real-time updates
    const subscription = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      }, (payload) => {
        if (payload.new && payload.new.status) {
          setStatus(payload.new.status as OrderStatus);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'delivery_requests',
        filter: `order_id=eq.${orderId}`
      }, (payload) => {
        if (payload.new && payload.new.status) {
          setDeliveryStatus(payload.new.status as DeliveryStatus);
        }
      })
      .subscribe();
      
    return () => {
      apiService.removeChannel(subscription);
    };
  }, [initialStatus, orderId]);

  return {
    status,
    deliveryStatus,
    estimatedTime,
    isRestaurantOpen
  };
};
