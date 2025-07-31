
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TaxiRide } from '@/types/taxi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Car, CreditCard, Users } from 'lucide-react';

interface RideStatusProps {
  rideId: string;
}

export default function RideStatus({ rideId }: RideStatusProps) {
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();

      if (error) {
        console.error('Error fetching ride:', error);
      } else if (data) {
        const fetchedRide: TaxiRide = {
          id: data.id,
          user_id: data.user_id,
          pickup_address: data.pickup_address,
          destination_address: data.destination_address,
          pickup_time: data.pickup_time,
          status: data.status as 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled',
          driver_id: data.driver_id,
          estimated_price: data.estimated_price,
          actual_price: data.actual_price,
          payment_status: data.payment_status,
          vehicle_type: data.vehicle_type,
          payment_method: data.payment_method,
          pickup_latitude: data.pickup_latitude,
          pickup_longitude: data.pickup_longitude,
          destination_latitude: data.destination_latitude,
          destination_longitude: data.destination_longitude,
          special_instructions: data.special_instructions || undefined,
          is_shared_ride: data.is_shared_ride || false,
          max_passengers: data.max_passengers || 0,
          current_passengers: data.current_passengers || 0,
          estimated_arrival_time: data.estimated_arrival_time || undefined,
          actual_arrival_time: data.actual_arrival_time || undefined,
          distance_km: data.distance_km || undefined,
          route_polyline: data.route_polyline || undefined,
          promo_code_applied: data.promo_code_applied || undefined,
          promo_discount: data.promo_discount || undefined,
          // Add missing required properties
          price: data.actual_price || data.estimated_price || 0,
          distance: data.distance_km || 0,
          duration: 30, // Default duration
          created_at: data.created_at || new Date().toISOString()
        };
        
        setRide(fetchedRide);
      }
      setLoading(false);
    };

    fetchRide();
  }, [rideId]);

  if (loading) {
    return <div className="p-4 text-center">Chargement des détails de la course...</div>;
  }

  if (!ride) return <div className="p-4 text-center">Course non trouvée</div>;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Acceptée</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Course #{ride.id.slice(0, 8)}</span>
          {getStatusBadge(ride.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Point de départ</p>
              <p className="font-medium">{ride.pickup_address}</p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-medium">{ride.destination_address}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-600">Heure de départ</p>
              <p className="font-medium">
                {new Date(ride.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Car className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-600">Type de véhicule</p>
              <p className="font-medium capitalize">{ride.vehicle_type}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-600">Moyen de paiement</p>
              <p className="font-medium capitalize">{ride.payment_method}</p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-600">Prix estimé</p>
              <p className="font-medium">{ride.estimated_price} FCFA</p>
            </div>
          </div>
        </div>

        {ride.is_shared_ride && (
          <div className="bg-primary/10 p-3 rounded-md">
            <p className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span>Course partagée - {ride.max_passengers} passagers max</span>
            </p>
          </div>
        )}

        {ride.special_instructions && (
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600 mb-1">Instructions spéciales:</p>
            <p>{ride.special_instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
