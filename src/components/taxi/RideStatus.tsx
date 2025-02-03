import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeliveryMap from "@/components/DeliveryMap";
import { Clock, MapPin, Car, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

type TaxiRide = {
  id: string;
  user_id: string;
  pickup_address: string;
  destination_address: string;
  pickup_time: string;
  status: string;
  driver_id?: string;
  created_at: string;
  updated_at: string;
  estimated_price?: number;
  actual_price?: number;
  payment_status: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_latitude?: number;
  destination_longitude?: number;
  vehicle_type: string;
  payment_method: string;
  rating?: number;
  rating_comment?: string;
  driver?: {
    id: string;
    current_latitude: number;
    current_longitude: number;
    user_id: string;
    profiles?: {
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
    } | null;
  } | null;
};

const RideStatus = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const [ride, setRide] = useState<TaxiRide | null>(null);
  const [driverLocation, setDriverLocation] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) {
        console.error('No rideId provided');
        setError('Identifiant de course invalide');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('taxi_rides')
          .select(`
            *,
            driver:delivery_drivers(
              id,
              current_latitude,
              current_longitude,
              user_id,
              profiles:user_id(
                first_name,
                last_name,
                avatar_url
              )
            )
          `)
          .eq('id', rideId)
          .single();

        if (error) {
          console.error('Error fetching ride:', error);
          setError('Erreur lors du chargement de la course');
          return;
        }

        if (!data) {
          console.error('No ride found');
          setError('Course non trouvée');
          return;
        }

        setRide(data as TaxiRide);
        
        if (data.driver) {
          setDriverLocation({
            lat: data.driver.current_latitude,
            lng: data.driver.current_longitude
          });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Une erreur inattendue est survenue');
      }
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
          console.log('Ride update received:', payload);
          setRide(payload.new as TaxiRide);
        }
      )
      .subscribe();

    // Subscribe to driver location updates if driver is assigned
    if (ride?.driver_id) {
      const driverChannel = supabase
        .channel('driver-location')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'delivery_drivers',
            filter: `id=eq.${ride.driver_id}`
          },
          (payload) => {
            console.log('Driver location update:', payload);
            setDriverLocation({
              lat: payload.new.current_latitude,
              lng: payload.new.current_longitude
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(driverChannel);
      };
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, ride?.driver_id]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive", label: string }> = {
      'pending': { variant: "secondary", label: "En attente d'un chauffeur" },
      'accepted': { variant: "default", label: "Chauffeur en route" },
      'in_progress': { variant: "default", label: "En course" },
      'completed': { variant: "default", label: "Terminée" },
      'cancelled': { variant: "destructive", label: "Annulée" }
    };

    const statusInfo = variants[status] || variants['pending'];
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="text-red-500">{error}</div>
      </Card>
    );
  }

  if (!ride) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-secondary rounded w-3/4"></div>
          <div className="h-4 bg-secondary rounded w-1/2"></div>
          <div className="h-32 bg-secondary rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Suivi de votre course</h2>
            {getStatusBadge(ride.status || 'pending')}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Départ</span>
              </div>
              <p className="font-medium">{ride.pickup_address}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Destination</span>
              </div>
              <p className="font-medium">{ride.destination_address}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Heure de prise en charge</span>
              </div>
              <p className="font-medium">
                {new Date(ride.pickup_time).toLocaleString()}
              </p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Prix estimé</span>
              </div>
              <p className="font-medium">
                {ride.estimated_price?.toLocaleString()} FCFA
              </p>
            </div>
          </div>

          {ride.driver && (
            <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Votre chauffeur</h3>
                  <p className="text-sm text-muted-foreground">
                    {ride.driver.profiles?.first_name} {ride.driver.profiles?.last_name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(ride.pickup_latitude && ride.pickup_longitude) && (
            <div className="h-64 mt-4">
              <DeliveryMap
                latitude={driverLocation?.lat || ride.pickup_latitude}
                longitude={driverLocation?.lng || ride.pickup_longitude}
                orderId={ride.id}
              />
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default RideStatus;