import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Clock, CreditCard, Wallet } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MobilePayment from "@/components/MobilePayment";

const TaxiBookingForm = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('mobile_money');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
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

  const handlePaymentComplete = async () => {
    setShowPaymentDialog(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      if (!pickupCoords || !destinationCoords) {
        throw new Error('Coordonnées manquantes');
      }

      // Créer la course
      const { data: ride, error: rideError } = await supabase
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
          vehicle_type: vehicleType,
          payment_method: paymentMethod,
          payment_status: 'completed'
        })
        .select()
        .single();

      if (rideError) throw rideError;

      // Créer l'enregistrement de paiement
      const { error: paymentError } = await supabase
        .from('taxi_payments')
        .insert({
          ride_id: ride.id,
          amount: estimatedPrice || 0,
          payment_method: paymentMethod,
          payment_status: 'completed',
          payment_details: {
            vehicle_type: vehicleType,
            payment_type: paymentMethod
          }
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Réservation confirmée",
        description: "Votre taxi a été réservé avec succès",
      });

      navigate(`/taxi/ride/${ride.id}`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!estimatedPrice) {
      toast({
        title: "Erreur",
        description: "Impossible de calculer le prix estimé",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setShowPaymentDialog(true);
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

          <div className="space-y-2">
            <Label htmlFor="payment-method">Mode de paiement</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money" className="flex-1">Mobile Money</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1">Paiement en espèces</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex-1 flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Portefeuille électronique
                </Label>
              </div>
            </RadioGroup>
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

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiement</DialogTitle>
          </DialogHeader>
          {paymentMethod === 'mobile_money' && (
            <MobilePayment
              amount={estimatedPrice || 0}
              onPaymentComplete={handlePaymentComplete}
              description="Réservation de taxi"
            />
          )}
          {paymentMethod === 'cash' && (
            <div className="space-y-4">
              <p>Vous paierez en espèces au chauffeur à la fin de la course.</p>
              <p className="font-semibold">Montant à payer: {estimatedPrice?.toLocaleString()} FCFA</p>
              <Button onClick={handlePaymentComplete} className="w-full">
                Confirmer la réservation
              </Button>
            </div>
          )}
          {paymentMethod === 'wallet' && (
            <div className="space-y-4">
              <p>Paiement via votre portefeuille électronique</p>
              <p className="font-semibold">Montant: {estimatedPrice?.toLocaleString()} FCFA</p>
              <Button onClick={handlePaymentComplete} className="w-full">
                Payer avec mon portefeuille
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default TaxiBookingForm;
