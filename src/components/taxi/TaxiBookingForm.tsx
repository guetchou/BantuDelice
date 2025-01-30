import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";

const TaxiBookingForm = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLocationSelect = async (address: string, isPickup: boolean) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${process.env.MAPBOX_PUBLIC_TOKEN}`
      );
      const data = await response.json();
      
      if (data.features && data.features[0]) {
        const [lng, lat] = data.features[0].center;
        if (isPickup) {
          setPickupCoords({ lat, lng });
          setPickupAddress(address);
        } else {
          setDestinationCoords({ lat, lng });
          setDestinationAddress(address);
        }
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast({
        title: "Erreur",
        description: "Impossible de trouver les coordonnées de l'adresse",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      if (!pickupCoords || !destinationCoords) {
        throw new Error('Coordonnées manquantes');
      }

      const { data, error } = await supabase
        .from('taxi_rides')
        .insert({
          user_id: user.id,
          pickup_address: pickupAddress,
          destination_address: destinationAddress,
          pickup_time: new Date(pickupTime).toISOString(),
          pickup_latitude: pickupCoords.lat,
          pickup_longitude: pickupCoords.lng,
          destination_latitude: destinationCoords.lat,
          destination_longitude: destinationCoords.lng,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Réservation confirmée",
        description: "Votre taxi a été réservé avec succès",
      });

      navigate(`/taxi/ride/${data.id}`);
    } catch (error) {
      console.error('Error booking taxi:', error);
      toast({
        title: "Erreur de réservation",
        description: "Impossible de réserver le taxi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="pickup">Point de départ</Label>
        <div className="flex gap-2">
          <Input
            id="pickup"
            placeholder="Adresse de départ"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            onBlur={() => handleLocationSelect(pickupAddress, true)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              // Get current location
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  async (position) => {
                    const { latitude, longitude } = position.coords;
                    setPickupCoords({ lat: latitude, lng: longitude });
                    
                    // Reverse geocode to get address
                    try {
                      const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.MAPBOX_PUBLIC_TOKEN}`
                      );
                      const data = await response.json();
                      if (data.features && data.features[0]) {
                        setPickupAddress(data.features[0].place_name);
                      }
                    } catch (error) {
                      console.error('Error reverse geocoding:', error);
                    }
                  },
                  (error) => {
                    console.error('Error getting location:', error);
                    toast({
                      title: "Erreur de localisation",
                      description: "Impossible d'obtenir votre position actuelle",
                      variant: "destructive",
                    });
                  }
                );
              }
            }}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="Adresse de destination"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          onBlur={() => handleLocationSelect(destinationAddress, false)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickup-time">Heure de prise en charge</Label>
        <Input
          id="pickup-time"
          type="datetime-local"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      {pickupCoords && destinationCoords && (
        <div className="h-64 rounded-lg overflow-hidden">
          <DeliveryMap
            latitude={pickupCoords.lat}
            longitude={pickupCoords.lng}
          />
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading || !pickupAddress || !destinationAddress || !pickupTime}
      >
        {loading ? "Réservation en cours..." : "Réserver un taxi"}
      </Button>
    </form>
  );
};

export default TaxiBookingForm;