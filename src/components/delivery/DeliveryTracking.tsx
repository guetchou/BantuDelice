import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Bike, CheckCircle } from 'lucide-react';
import DeliveryMap from '@/components/DeliveryMap';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryTrackingProps {
  orderId: string;
}

interface DeliveryStatus {
  status: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

const DeliveryTracking = ({ orderId }: DeliveryTrackingProps) => {
  const [status, setStatus] = useState<DeliveryStatus | null>(null);

  useEffect(() => {
    // Charger le statut initial
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) {
        console.error('Erreur lors du chargement du statut:', error);
        return;
      }

      setStatus(data);
    };

    fetchStatus();

    // Souscrire aux mises à jour en temps réel
    const channel = supabase
      .channel('delivery-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_tracking',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          console.log('Mise à jour de la livraison:', payload);
          setStatus(payload.new as DeliveryStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (!status) return <div>Chargement...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Suivi de livraison</h2>

      <div className="space-y-8 mb-6">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}>
            <Package className="w-4 h-4" />
          </div>
          <div className="ml-4">
            <p className="font-medium">Commande confirmée</p>
            <Badge variant={status.status !== 'pending' ? "success" : "secondary"}>
              {status.status !== 'pending' ? 'Complété' : 'En cours'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status.status === 'preparing' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>
            <Bike className="w-4 h-4" />
          </div>
          <div className="ml-4">
            <p className="font-medium">En préparation</p>
            <Badge variant={status.status === 'preparing' ? "success" : "secondary"}>
              {status.status === 'preparing' ? 'En cours' : 'En attente'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status.status === 'delivering' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div className="ml-4">
            <p className="font-medium">En livraison</p>
            <Badge variant={status.status === 'delivering' ? "success" : "secondary"}>
              {status.status === 'delivering' ? 'En cours' : 'En attente'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="ml-4">
            <p className="font-medium">Livré</p>
            <Badge variant={status.status === 'delivered' ? "success" : "secondary"}>
              {status.status === 'delivered' ? 'Complété' : 'En attente'}
            </Badge>
          </div>
        </div>
      </div>

      {status.latitude && status.longitude && (
        <div className="h-64">
          <DeliveryMap
            latitude={status.latitude}
            longitude={status.longitude}
            orderId={orderId}
          />
        </div>
      )}
    </Card>
  );
};

export default DeliveryTracking;