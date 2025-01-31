import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import DeliveryMap from "@/components/DeliveryMap";
import { Database } from "@/integrations/supabase/types";
import { logger } from '@/services/logger';

type TaxiRide = Database['public']['Tables']['taxi_rides']['Row'];

const TaxiRideStatus = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const [ride, setRide] = useState<TaxiRide | null>(null);

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) {
        logger.error('No rideId provided');
        return;
      }

      const { data, error } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();

      if (error) {
        logger.error('Error fetching ride:', error);
        return;
      }

      setRide(data);
    };

    fetchRide();

    // Subscribe to changes
    const channel = supabase
      .channel('taxi-ride-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'taxi_rides',
          filter: `id=eq.${rideId}`
        },
        (payload) => {
          logger.info('Ride update received:', payload);
          setRide(payload.new as TaxiRide);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  if (!ride) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Statut de votre course</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Départ</h3>
            <p>{ride.pickup_address}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Destination</h3>
            <p>{ride.destination_address}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Heure de prise en charge</h3>
            <p>{new Date(ride.pickup_time).toLocaleString()}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Statut</h3>
            <p className="capitalize">{ride.status}</p>
          </div>
        </div>

        {ride.pickup_latitude && ride.pickup_longitude && (
          <div className="h-64">
            <DeliveryMap
              latitude={ride.pickup_latitude}
              longitude={ride.pickup_longitude}
              orderId={ride.id}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default TaxiRideStatus;