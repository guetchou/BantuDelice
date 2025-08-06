import { useState, useEffect } from 'react';
import { apiService, Order } from '../services/api';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error('Erreur fetchOrders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>) => {
    try {
      const newOrder = await apiService.createOrder(orderData);
      setOrders(prev => [...prev, newOrder]);
      return { success: true, order: newOrder };
    } catch (err) {
      console.error('Erreur createOrder:', err);
      return { success: false, error: err };
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const updatedOrder = await apiService.updateOrderStatus(id, status);
      setOrders(prev => 
        prev.map(order => 
          order.id === id ? { ...order, status } : order
        )
      );
      return { success: true, order: updatedOrder };
    } catch (err) {
      console.error('Erreur updateOrderStatus:', err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  };
}; 