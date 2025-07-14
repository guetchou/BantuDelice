
import { useState, useEffect } from 'react';

export interface Order {
  id: number;
  user_id: string;
  restaurant_id: number;
  items: any;
  total: number;
  status: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_name: string;
  payment_method: string;
  created_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserOrders = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      const mockOrders: Order[] = [
        {
          id: 1,
          user_id: userId,
          restaurant_id: 1,
          items: [],
          total: 25.50,
          status: 'delivered',
          delivery_address: 'Brazzaville, Congo',
          delivery_phone: '+242123456789',
          delivery_name: 'John Doe',
          payment_method: 'mobile_money',
          created_at: new Date().toISOString()
        }
      ];
      setOrders(mockOrders);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>) => {
    setLoading(true);
    try {
      // Simulate API call
      const newOrder: Order = {
        id: Date.now(),
        user_id: orderData.user_id || '',
        restaurant_id: orderData.restaurant_id || 0,
        items: orderData.items || [],
        total: orderData.total || 0,
        status: 'pending',
        delivery_address: orderData.delivery_address || '',
        delivery_phone: orderData.delivery_phone || '',
        delivery_name: orderData.delivery_name || '',
        payment_method: orderData.payment_method || '',
        created_at: new Date().toISOString()
      };
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      setError('Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  return {
    orders,
    loading,
    error,
    getUserOrders,
    createOrder,
    updateOrderStatus
  };
}
