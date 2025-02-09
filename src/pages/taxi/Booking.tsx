
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Car, Clock, Wallet, MapPin, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTaxiBooking } from "@/hooks/useTaxiBooking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationSection from "@/components/taxi/LocationSection";
import PickupTimeSection from "@/components/taxi/PickupTimeSection";
import VehicleSection from "@/components/taxi/VehicleSection";
import PaymentSection from "@/components/taxi/PaymentSection";
import { Separator } from "@/components/ui/separator";

const TaxiBookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBooking, isLoading } = useTaxiBooking();

  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  const onUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
            );
            const data = await response.json();
            if (data.features?.[0]) {
              setPickupAddress(data.features[0].place_name);
            }
          } catch (error) {
            console.error('Error getting address:', error);
            toast({
              title: "Erreur",
              description: "Impossible de récupérer votre position actuelle",
              variant: "destructive",
            });
          }
        },
        () => {
          toast({
            title: "Erreur",
            description: "La géolocalisation n'est pas disponible",
            variant: "destructive",
          });
        }
      );
    }
  };

  const onLocationSelect = async (address: string, isPickup: boolean) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.features?.[0]) {
        const [longitude, latitude] = data.features[0].center;
        if (isPickup) {
          setPickupAddress(data.features[0].place_name);
        } else {
          setDestinationAddress(data.features[0].place_name);
        }
      }
    } catch (error) {
      console.error('Error validating address:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupAddress || !destinationAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner l'adresse de départ et de destination",
        variant: "destructive",
      });
      return;
    }

    if (!pickupTime) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une heure de prise en charge",
        variant: "destructive",
      });
      return;
    }

    try {
      const booking = await createBooking({
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        pickup_time: new Date(pickupTime).toISOString(),
        vehicle_type: vehicleType,
        payment_method: paymentMethod,
        payment_status: 'pending', // Ajout du champ manquant
      });

      if (booking) {
        navigate(`/taxi/ride/${booking.id}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Réserver un taxi</h1>
              <Car className="w-8 h-8 text-orange-500" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <LocationSection
                pickupAddress={pickupAddress}
                setPickupAddress={setPickupAddress}
                destinationAddress={destinationAddress}
                setDestinationAddress={setDestinationAddress}
                onLocationSelect={onLocationSelect}
                onUseCurrentLocation={onUseCurrentLocation}
              />

              <Separator />

              <PickupTimeSection
                pickupTime={pickupTime}
                setPickupTime={setPickupTime}
              />

              <Separator />

              <VehicleSection
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
              />

              <Separator />

              <PaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <ChevronsUpDown className="h-4 w-4 animate-spin" />
                      Réservation en cours...
                    </div>
                  ) : (
                    'Réserver maintenant'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <div className="mt-6 text-sm text-muted-foreground">
          <p className="text-center">
            En réservant, vous acceptez nos{' '}
            <a href="/legal" className="text-orange-500 hover:underline">
              conditions générales
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxiBookingPage;
