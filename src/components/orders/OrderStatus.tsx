import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, ChefHat, Truck, CheckCircle } from 'lucide-react';

interface OrderStatusProps {
  orderId: string;
}

const OrderStatus = ({ orderId }: OrderStatusProps) => {
  const [status, setStatus] = useState<string>('pending');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  useEffect(() => {
    // Souscrire aux changements de statut de la commande
    const orderChannel = supabase
      .channel('order-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order status update:', payload);
          if (payload.new) {
            setStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    // Souscrire aux changements de statut de la livraison
    const deliveryChannel = supabase
      .channel('delivery-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_tracking',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('Delivery status update:', payload);
          if (payload.new) {
            setDeliveryStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    // Charger les statuts initiaux
    const loadInitialStatus = async () => {
      const [{ data: orderData }, { data: deliveryData }] = await Promise.all([
        supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .single(),
        supabase
          .from('delivery_tracking')
          .select('status')
          .eq('order_id', orderId)
          .single()
      ]);

      if (orderData) setStatus(orderData.status);
      if (deliveryData) setDeliveryStatus(deliveryData.status);
    };

    loadInitialStatus();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(deliveryChannel);
    };
  }, [orderId]);

  const steps = [
    { 
      icon: Clock, 
      label: 'Commande reçue',
      status: status === 'pending' ? 'current' : status !== 'cancelled' ? 'completed' : 'waiting'
    },
    { 
      icon: ChefHat, 
      label: 'En préparation',
      status: status === 'preparing' ? 'current' : status === 'delivering' || status === 'delivered' ? 'completed' : 'waiting'
    },
    { 
      icon: Truck, 
      label: 'En livraison',
      status: deliveryStatus === 'delivering' ? 'current' : deliveryStatus === 'delivered' ? 'completed' : 'waiting'
    },
    { 
      icon: CheckCircle, 
      label: 'Livrée',
      status: deliveryStatus === 'delivered' ? 'completed' : 'waiting'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Suivi de commande</h3>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center mb-8 last:mb-0">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${step.status === 'completed' ? 'bg-green-500 text-white' :
                step.status === 'current' ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-400'}
            `}>
              <step.icon className="w-5 h-5" />
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">{step.label}</p>
              {step.status === 'current' && (
                <Badge variant="secondary">En cours</Badge>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-4 ml-[11px] h-full border-l border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OrderStatus;