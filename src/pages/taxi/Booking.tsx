
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Car, Clock, Wallet, MapPin, ChevronsUpDown, Info, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTaxiBooking } from "@/hooks/useTaxiBooking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LocationSection from "@/components/taxi/LocationSection";
import PickupTimeSection from "@/components/taxi/PickupTimeSection";
import VehicleSection from "@/components/taxi/VehicleSection";
import PaymentSection from "@/components/taxi/PaymentSection";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const vehicleInfo = {
  standard: {
    name: "Standard",
    description: "Véhicule confortable pour 4 personnes maximum",
    price: "Prix de base",
    features: ["Climatisation", "4 places", "2 bagages"],
    estimatedTime: "15-20 min"
  },
  premium: {
    name: "Premium",
    description: "Berline haut de gamme avec plus d'espace",
    price: "+25% du tarif standard",
    features: ["Climatisation", "4 places", "4 bagages", "Wifi", "Eau minérale"],
    estimatedTime: "10-15 min"
  },
  van: {
    name: "Van",
    description: "Parfait pour les groupes ou les gros bagages",
    price: "+50% du tarif standard",
    features: ["Climatisation", "7 places", "6 bagages", "Wifi"],
    estimatedTime: "20-25 min"
  }
};

const TaxiBookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBooking, isLoading } = useTaxiBooking();

  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  useEffect(() => {
    // Calculer un prix estimé basé sur les adresses (simulation)
    if (pickupAddress && destinationAddress) {
      const basePrice = 2000; // Prix de base en FCFA
      const multiplier = vehicleType === 'premium' ? 1.25 : vehicleType === 'van' ? 1.5 : 1;
      setEstimatedPrice(basePrice * multiplier);
    }
  }, [pickupAddress, destinationAddress, vehicleType]);

  const onUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { data: { token }, error: tokenError } = await supabase.functions.invoke('get_mapbox_token');
            if (tokenError) throw new Error('Could not get Mapbox token');

            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${token}`
            );
            const data = await response.json();
            if (data.features?.[0]) {
              setPickupAddress(data.features[0].place_name);
              toast({
                title: "Position actuelle détectée",
                description: "Votre position a été automatiquement remplie",
              });
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
    if (!address) return;
    
    try {
      const { data: { token }, error: tokenError } = await supabase.functions.invoke('get_mapbox_token');
      if (tokenError) throw new Error('Could not get Mapbox token');

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}`
      );
      const data = await response.json();
      if (data.features?.[0]) {
        const [longitude, latitude] = data.features[0].center;
        if (isPickup) {
          setPickupAddress(data.features[0].place_name);
          toast({
            title: "Adresse validée",
            description: "L'adresse de départ a été validée",
          });
        } else {
          setDestinationAddress(data.features[0].place_name);
          toast({
            title: "Adresse validée",
            description: "L'adresse de destination a été validée",
          });
        }
      }
    } catch (error) {
      console.error('Error validating address:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider l'adresse",
        variant: "destructive",
      });
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
        payment_status: 'pending',
        estimated_price: estimatedPrice || 0,
      });

      if (booking) {
        toast({
          title: "Réservation confirmée",
          description: "Votre taxi arrive bientôt!",
        });
        navigate(`/taxi/ride/${booking.id}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-white/5 backdrop-blur-sm border-gray-800">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Réserver un taxi</h1>
                <p className="text-gray-400">Remplissez les informations ci-dessous pour réserver votre course</p>
              </div>
              <Car className="w-12 h-12 text-orange-500" />
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

              {/* Informations détaillées sur le véhicule sélectionné */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {vehicleInfo[vehicleType as keyof typeof vehicleInfo].name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Temps d'attente estimé: {vehicleInfo[vehicleType as keyof typeof vehicleInfo].estimatedTime}</span>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  {vehicleInfo[vehicleType as keyof typeof vehicleInfo].description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {vehicleInfo[vehicleType as keyof typeof vehicleInfo].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-300">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <PaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />

              {/* Prix estimé */}
              {estimatedPrice && (
                <div className="bg-orange-500/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <span className="text-lg font-semibold text-white">Prix estimé</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-500">
                      {estimatedPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              )}

              {/* FAQ et informations supplémentaires */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cancellation">
                  <AccordionTrigger className="text-white">
                    Politique d'annulation
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Annulation gratuite jusqu'à 5 minutes avant le départ. Des frais peuvent s'appliquer après ce délai.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="luggage">
                  <AccordionTrigger className="text-white">
                    Bagages autorisés
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Le nombre de bagages dépend du type de véhicule sélectionné. Consultez les détails de chaque véhicule.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment">
                  <AccordionTrigger className="text-white">
                    Modes de paiement
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Nous acceptons les paiements par mobile money, carte bancaire et espèces.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="submit" 
                        className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
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
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cliquez pour confirmer votre réservation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
