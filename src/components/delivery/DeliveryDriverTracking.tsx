
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DeliveryMap from '@/components/DeliveryMap';
import DeliveryChat from './DeliveryChat';
import type { DeliveryDriver } from '@/types/delivery';

interface DriverTrackingProps {
  orderId: string;
  driverId: string;
}

export default function DeliveryDriverTracking({ orderId, driverId }: DriverTrackingProps) {
  const [driverLocation, setDriverLocation] = useState<DeliveryDriver | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDriverLocation();
    subscribeToLocationUpdates();
  }, [driverId]);

  const fetchDriverLocation = async () => {
    const { data, error } = await supabase
      .from('delivery_drivers')
      .select('*')
      .eq('user_id', driverId)
      .single();

    if (error) {
      console.error('Error fetching driver location:', error);
      return;
    }

    setDriverLocation(data);
  };

  const subscribeToLocationUpdates = () => {
    const channel = supabase
      .channel('driver-location')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_drivers',
          filter: `user_id=eq.${driverId}`
        },
        (payload) => {
          setDriverLocation(payload.new as DeliveryDriver);
          toast({
            title: "Position mise à jour",
            description: "La position du livreur a été mise à jour",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (!driverLocation) {
    return <div>Chargement de la position du livreur...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Suivi du livreur</h3>
        
        <div className="h-[300px] mb-6">
          <DeliveryMap
            latitude={driverLocation.current_latitude}
            longitude={driverLocation.current_longitude}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {' '}
            {new Date(driverLocation.last_location_update).toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Évaluation moyenne :</span>{' '}
            {driverLocation.average_rating.toFixed(1)} / 5
          </p>
          <p className="text-sm">
            <span className="font-medium">Livraisons effectuées :</span>{' '}
            {driverLocation.total_deliveries}
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chat avec le livreur</h3>
        <DeliveryChat orderId={orderId} userType="customer" />
      </Card>
    </div>
  );
}
