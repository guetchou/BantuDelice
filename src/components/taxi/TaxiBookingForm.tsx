import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Clock, CreditCard } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const TaxiBookingForm = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateEstimatedPrice = (distance: number, type: string) => {
    const basePrice = type === 'standard' ? 500 : type === 'premium' ? 800 : 1200;
    const pricePerKm = type === 'standard' ? 200 : type === 'premium' ? 300 : 400;
    return basePrice + (distance * pricePerKm);
  };

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

        // Calculate estimated price if both locations are set
        if (pickupCoords && destinationCoords) {
          const distance = calculateDistance(
            pickupCoords.lat,
            pickupCoords.lng,
            lat,
            lng
          );
          const price = calculateEstimatedPrice(distance, vehicleType);
          setEstimatedPrice(price);
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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
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
          estimated_price: estimatedPrice,
          vehicle_type: vehicleType
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <Card className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="pickup">Point de départ</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="pickup"
                  className="pl-10"
                  placeholder="Adresse de départ"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  onBlur={() => handleLocationSelect(pickupAddress, true)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        const { latitude, longitude } = position.coords;
                        setPickupCoords({ lat: latitude, lng: longitude });
                        
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
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="destination"
                className="pl-10"
                placeholder="Adresse de destination"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                onBlur={() => handleLocationSelect(destinationAddress, false)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle-type">Type de véhicule</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type de véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (4 places)</SelectItem>
                <SelectItem value="premium">Premium (4 places)</SelectItem>
                <SelectItem value="van">Van (7 places)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-time">
              <Clock className="inline-block h-4 w-4 mr-2" />
              Heure de prise en charge
            </Label>
            <Input
              id="pickup-time"
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {pickupCoords && destinationCoords && (
            <>
              <div className="h-64 rounded-lg overflow-hidden">
                <DeliveryMap
                  latitude={pickupCoords.lat}
                  longitude={pickupCoords.lng}
                />
              </div>

              {estimatedPrice && (
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Prix estimé:</span>
                    <span className="text-xl font-bold">{estimatedPrice.toLocaleString()} FCFA</span>
                  </div>
                </div>
              )}
            </>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !pickupAddress || !destinationAddress || !pickupTime || !vehicleType}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {loading ? "Réservation en cours..." : "Réserver un taxi"}
          </Button>
        </motion.div>
      </Card>
    </form>
  );
};

export default TaxiBookingForm;