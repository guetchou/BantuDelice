import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TaxiRide = Database['public']['Tables']['taxi_rides']['Row'];

interface RideStatusProps {
  rideId: string;
}

export default function RideStatus({ rideId }: RideStatusProps) {
  const [ride, setRide] = useState<TaxiRide | null>(null);

  useEffect(() => {
    const fetchRide = async () => {
      const { data, error } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();

      if (error) {
        console.error('Error fetching ride:', error);
      } else {
        setRide(data);
      }
    };

    fetchRide();
  }, [rideId]);

  if (!ride) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Status de la course</h3>
      <div className="space-y-2">
        <p>Status: {ride.status}</p>
        <p>De: {ride.pickup_address}</p>
        <p>À: {ride.destination_address}</p>
        <p>Prix estimé: {ride.estimated_price ? `${ride.estimated_price} FCFA` : 'Non disponible'}</p>
      </div>
    </div>
  );
}