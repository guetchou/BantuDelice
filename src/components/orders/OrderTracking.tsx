
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Package, Check } from 'lucide-react';
import DeliveryMap from '@/components/DeliveryMap';
import { Card } from '@/components/ui/card';

interface OrderStatus {
  status: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export default function OrderTracking({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<OrderStatus | null>(null);
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
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_tracking',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('Delivery status updated:', payload);
          setStatus(payload.new as OrderStatus);
          
          toast({
            title: "Statut de livraison mis à jour",
            description: `Nouveau statut: ${payload.new.status}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const fetchOrderStatus = async () => {
    const { data, error } = await supabase
      .from('delivery_tracking')
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

  if (!status) return <div>Chargement...</div>;

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
          </div>
        </div>
      </div>

      <div className="h-[300px] rounded-lg overflow-hidden">
        <DeliveryMap 
          latitude={status.latitude} 
          longitude={status.longitude}
        />
      </div>
    </Card>
  );
}
