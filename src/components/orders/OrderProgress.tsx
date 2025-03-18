
import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Clock, ChefHat, Truck, Package } from 'lucide-react';
import { OrderStatus } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface OrderProgressProps {
  status: OrderStatus;
  orderId: string;
}

const OrderProgress = ({ status: initialStatus, orderId }: OrderProgressProps) => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

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
            setEstimatedTime(payload.new.estimated_delivery_time);
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
        .select('estimated_delivery_time')
        .eq('id', orderId)
        .single();
      
      if (data && data.estimated_delivery_time) {
        setEstimatedTime(data.estimated_delivery_time);
      }
    };

    fetchInitialDeliveryStatus();
    fetchEstimatedTime();

    return () => {
      supabase.removeChannel(orderSubscription);
      supabase.removeChannel(deliverySubscription);
    };
  }, [orderId, initialStatus]);

  const steps = [
    {
      key: 'pending',
      label: 'Commande reçue',
      icon: Clock,
      completedStatuses: ['accepted', 'preparing', 'prepared', 'delivering', 'delivered', 'completed'],
      currentStatus: 'pending',
    },
    {
      key: 'preparing',
      label: 'En préparation',
      icon: ChefHat,
      completedStatuses: ['prepared', 'delivering', 'delivered', 'completed'],
      currentStatus: 'preparing',
      previousStatuses: ['accepted']
    },
    {
      key: 'delivering',
      label: 'En livraison',
      icon: Truck,
      completedStatuses: ['delivered', 'completed'],
      currentStatus: 'delivering',
      previousStatuses: ['prepared']
    },
    {
      key: 'delivered',
      label: 'Livré',
      icon: Package,
      completedStatuses: ['completed'],
      currentStatus: 'delivered',
      previousStatuses: []
    }
  ];

  const getStepStatus = (step: typeof steps[0]) => {
    if (status === 'cancelled') {
      return 'inactive';
    }
    
    if (step.completedStatuses.includes(status) || status === step.currentStatus) {
      return 'completed';
    }
    
    if (status === step.currentStatus || (step.previousStatuses && step.previousStatuses.includes(status))) {
      return 'current';
    }
    
    // Special case for delivery status
    if (step.key === 'delivering' && deliveryStatus === 'delivering') {
      return 'current';
    }
    
    if (step.key === 'delivered' && deliveryStatus === 'delivered') {
      return 'completed';
    }
    
    return 'waiting';
  };

  const formatEstimatedTime = () => {
    if (!estimatedTime) return null;
    
    const estTime = new Date(estimatedTime);
    if (isNaN(estTime.getTime())) return null;
    
    return `${estTime.getHours().toString().padStart(2, '0')}:${estTime.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center relative mb-2">
        {estimatedTime && (
          <div className="absolute -top-6 right-0 text-sm text-gray-500">
            Livraison estimée: {formatEstimatedTime()}
          </div>
        )}
        {/* Connecting line */}
        <div className="absolute h-1 bg-gray-200 left-0 right-0 top-4 -z-10"></div>
        
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step);
          return (
            <div key={step.key} className="flex flex-col items-center space-y-2">
              {/* Circle */}
              <div className="relative">
                {stepStatus === 'completed' ? (
                  <CheckCircle className="h-8 w-8 text-primary" />
                ) : stepStatus === 'current' ? (
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <step.icon className="h-5 w-5" />
                  </div>
                ) : (
                  <Circle className={`h-8 w-8 ${status === 'cancelled' ? 'text-gray-300' : 'text-gray-400'}`} />
                )}
                
                {/* Active line before this step */}
                {index > 0 && (stepStatus === 'completed' || stepStatus === 'current') && (
                  <div className="absolute h-1 bg-primary right-4 w-full top-4 -z-10" style={{ left: '-100%' }}></div>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs text-center ${
                status === 'cancelled' ? 'text-gray-400' :
                stepStatus === 'completed' ? 'text-primary font-medium' :
                stepStatus === 'current' ? 'text-primary font-medium' :
                'text-gray-500'
              }`}>
                {step.label}
              </span>

              {/* Current status indicator */}
              {stepStatus === 'current' && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                  En cours
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {status === 'cancelled' && (
        <div className="mt-4 bg-red-50 text-red-700 p-2 rounded-md text-sm text-center">
          Cette commande a été annulée
        </div>
      )}
    </div>
  );
};

export default OrderProgress;
