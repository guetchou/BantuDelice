
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";
import LocationSection from './LocationSection';
import VehicleSection from './VehicleSection';
import PaymentSection from './PaymentSection';
import PickupTimeSection from './PickupTimeSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
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
    const R = 6371;
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

  const handleUseCurrentLocation = () => {
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
  };

  const handlePaymentComplete = async () => {
    setShowPaymentDialog(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      if (!pickupCoords || !destinationCoords) {
        throw new Error('Coordonnées manquantes');
      }

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

      if (ride) {
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
      }

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
          <LocationSection 
            pickupAddress={pickupAddress}
            setPickupAddress={setPickupAddress}
            destinationAddress={destinationAddress}
            setDestinationAddress={setDestinationAddress}
            onLocationSelect={handleLocationSelect}
            onUseCurrentLocation={handleUseCurrentLocation}
          />

          <VehicleSection 
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
          />

          <PickupTimeSection 
            pickupTime={pickupTime}
            setPickupTime={setPickupTime}
          />

          <PaymentSection 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

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
