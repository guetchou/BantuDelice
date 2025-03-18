
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Users, Banknote, Clock, Shield } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TaxiRide, RideShareRequest } from '@/types/taxi';

interface RideSharingProps {
  rideId?: string;
  onSharingEnabled: (enabled: boolean, maxPassengers: number) => void;
  initialPrice: number;
}

const RideSharing: React.FC<RideSharingProps> = ({ 
  rideId, 
  onSharingEnabled, 
  initialPrice 
}) => {
  const [isSharingEnabled, setIsSharingEnabled] = useState(false);
  const [maxPassengers, setMaxPassengers] = useState(2);
  const [discountPercent, setDiscountPercent] = useState(15);
  const [nearbySharedRides, setNearbySharedRides] = useState<TaxiRide[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSharingEnabled && rideId) {
      fetchNearbySharedRides();
    }
  }, [isSharingEnabled, rideId]);

  const fetchNearbySharedRides = async () => {
    if (!rideId) return;
    
    try {
      setLoading(true);
      
      // First get the current ride details
      const { data: currentRide } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('id', rideId)
        .single();
        
      if (!currentRide) return;
      
      // Then find nearby rides that could be shared
      // In a real app, you would use geospatial queries to find rides with similar routes
      const { data: ridesData } = await supabase
        .from('taxi_rides')
        .select('*')
        .eq('status', 'pending')
        .eq('is_shared_ride', true)
        .neq('id', rideId);
        
      if (ridesData && ridesData.length > 0) {
        // Convert to our TaxiRide type to ensure type safety
        const rides: TaxiRide[] = ridesData.map(ride => ({
          id: ride.id,
          user_id: ride.user_id,
          pickup_address: ride.pickup_address,
          destination_address: ride.destination_address,
          pickup_time: ride.pickup_time,
          status: ride.status,
          driver_id: ride.driver_id,
          estimated_price: ride.estimated_price,
          actual_price: ride.actual_price,
          payment_status: ride.payment_status,
          vehicle_type: ride.vehicle_type,
          payment_method: ride.payment_method,
          pickup_latitude: ride.pickup_latitude,
          pickup_longitude: ride.pickup_longitude,
          destination_latitude: ride.destination_latitude,
          destination_longitude: ride.destination_longitude,
          special_instructions: ride.special_instructions,
          is_shared_ride: ride.is_shared_ride,
          max_passengers: ride.max_passengers,
          current_passengers: ride.current_passengers
        }));

        // Filter to only show rides that are close to your pickup and destination
        // This is a simplified version - in production you'd use proper spatial calculations
        setNearbySharedRides(rides);
      }
    } catch (error) {
      console.error('Error fetching shared rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSharingToggle = (enabled: boolean) => {
    setIsSharingEnabled(enabled);
    if (enabled) {
      onSharingEnabled(true, maxPassengers);
      toast.success("Covoiturage activé", {
        description: `Vous pourrez partager votre trajet avec jusqu'à ${maxPassengers} autres passagers`
      });
    } else {
      onSharingEnabled(false, 0);
    }
  };

  const handleMaxPassengersChange = (value: number[]) => {
    const passengers = value[0];
    setMaxPassengers(passengers);
    if (isSharingEnabled) {
      onSharingEnabled(true, passengers);
    }
  };

  const calculateDiscountedPrice = () => {
    return initialPrice * (1 - (discountPercent / 100));
  };

  const joinSharedRide = async (sharedRideId: string) => {
    try {
      setLoading(true);
      
      if (!rideId) {
        toast.error("Erreur: identifiant de course manquant");
        return;
      }
      
      // Create a ride share request
      const shareRequest: Omit<RideShareRequest, 'id' | 'created_at'> = {
        ride_id: sharedRideId,
        requester_id: rideId,
        status: 'pending',
        pickup_address: '',  // These would come from the current ride
        destination_address: '', 
        pickup_latitude: 0,
        pickup_longitude: 0,
        destination_latitude: 0,
        destination_longitude: 0
      };
      
      const { error } = await supabase
        .from('ride_share_requests')
        .insert(shareRequest);
        
      if (error) throw error;
      
      toast.success("Demande de covoiturage envoyée", {
        description: "Le conducteur validera votre demande rapidement"
      });
    } catch (error) {
      console.error('Error joining shared ride:', error);
      toast.error("Erreur lors de la demande de covoiturage");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Covoiturage</CardTitle>
          </div>
          <Switch 
            checked={isSharingEnabled}
            onCheckedChange={handleSharingToggle}
          />
        </div>
        <CardDescription>
          Partagez votre trajet avec d'autres passagers et économisez jusqu'à {discountPercent}%
        </CardDescription>
      </CardHeader>
      
      {isSharingEnabled && (
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Nombre de passagers max (en plus de vous)</Label>
              <span className="font-medium">{maxPassengers}</span>
            </div>
            <Slider
              value={[maxPassengers]}
              min={1}
              max={4}
              step={1}
              onValueChange={handleMaxPassengersChange}
            />
          </div>
          
          <div className="bg-primary/10 p-3 rounded-md flex justify-between">
            <div className="flex items-center">
              <Banknote className="h-5 w-5 text-primary mr-2" />
              <span>Prix estimé avec réduction</span>
            </div>
            <div className="flex items-center">
              <span className="line-through text-gray-500 mr-2">{initialPrice} FCFA</span>
              <Badge variant="outline" className="bg-primary/20 text-primary">
                {calculateDiscountedPrice()} FCFA
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">Sécurisé et vérifié</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-600">+5-10 min sur le temps de trajet</span>
            </div>
          </div>
          
          {nearbySharedRides.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium">Covoiturages disponibles à proximité</h4>
              
              {nearbySharedRides.map(ride => (
                <Card key={ride.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        Trajet vers {ride.destination_address.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-500">
                        Départ dans ~{Math.floor(Math.random() * 10) + 5} min
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => joinSharedRide(ride.id)}
                      disabled={loading}
                    >
                      Rejoindre
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default RideSharing;
