
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Order, OrderStatus } from '@/types/order';

interface OrderContextType {
  orders: Order[];
  activeOrders: Order[];
  pastOrders: Order[];
  isLoading: boolean;
  error: string | null;
  refetchOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        setOrders([]);
        return;
      }

      let { data: ordersData, error: supabaseError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      const typedOrders = (ordersData || []).map(order => ({
        ...order,
        status: order.status as OrderStatus,
        payment_status: order.payment_status as Order['payment_status'],
        delivery_status: order.delivery_status as Order['delivery_status']
      }));

      setOrders(typedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const activeOrders = orders.filter(order => 
    ['pending', 'accepted', 'preparing', 'prepared', 'delivering'].includes(order.status)
  );

  const pastOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change received:', payload);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <OrderContext.Provider value={{
      orders,
      activeOrders,
      pastOrders,
      isLoading,
      error,
      refetchOrders: fetchOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
