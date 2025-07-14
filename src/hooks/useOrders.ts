
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

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const getUserOrders = async (userId: string): Promise<Order[]> => {
    setLoading(true);
    try {
      // Simulation - remplacer par un vrai appel API
      const mockOrders: Order[] = [
        {
          id: 1,
          user_id: userId,
          restaurant_id: 1,
          items: [],
          total: 25.50,
          status: 'delivered',
          delivery_address: '123 Main St',
          delivery_phone: '+123456789',
          delivery_name: 'John Doe',
          payment_method: 'card',
          created_at: new Date().toISOString()
        }
      ];
      setOrders(mockOrders);
      return mockOrders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrder = (orderId: number, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };

  const removeOrder = (orderId: number) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const updateOrderStatus = async (orderId: number, status: string): Promise<boolean> => {
    try {
      updateOrder(orderId, { status });
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  return {
    orders,
    loading,
    getUserOrders,
    addOrder,
    updateOrder,
    removeOrder,
    updateOrderStatus
  };
};
