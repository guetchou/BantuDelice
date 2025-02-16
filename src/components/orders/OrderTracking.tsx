
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Package, Check } from 'lucide-react';
import DeliveryMap from '@/components/DeliveryMap';
import { Card } from '@/components/ui/card';
import type { OrderTrackingDetails } from '@/types/orderTracking';

interface OrderTrackingProps {
  orderId: string;
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const [status, setStatus] = useState<OrderTrackingDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch
    fetchOrderStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_tracking_details',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order tracking updated:', payload);
          setStatus(payload.new as OrderTrackingDetails);
          
          toast({
            title: "Statut de commande mis à jour",
            description: `Nouveau statut: ${payload.new.status}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, toast]);

  const fetchOrderStatus = async () => {
    const { data, error } = await supabase
      .from('order_tracking_details')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le statut de la commande",
        variant: "destructive",
      });
      return;
    }

    setStatus(data);
  };

  const getStatusIcon = (currentStatus: string) => {
    switch (currentStatus) {
      case 'preparing':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'picked_up':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'delivered':
        return <Check className="h-6 w-6 text-green-500" />;
      default:
        return <MapPin className="h-6 w-6 text-gray-500" />;
    }
  };

  if (!status) return <div>Chargement du statut...</div>;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getStatusIcon(status.status)}
          <div>
            <h3 className="font-semibold">
              {status.status === 'preparing' && 'En préparation'}
              {status.status === 'picked_up' && 'En route'}
              {status.status === 'delivered' && 'Livré'}
            </h3>
            <p className="text-sm text-gray-500">
              Dernière mise à jour: {new Date(status.updated_at).toLocaleTimeString()}
            </p>
            {status.estimated_delivery_time && (
              <p className="text-sm text-gray-500">
                Livraison estimée: {new Date(status.estimated_delivery_time).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {status.current_location && (
        <div className="h-[300px] rounded-lg overflow-hidden">
          <DeliveryMap 
            latitude={Number(status.current_location[0])} 
            longitude={Number(status.current_location[1])}
          />
        </div>
      )}
    </Card>
  );
}
