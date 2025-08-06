
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icons from "../components/ui/IconLibrary";
import { Input } from "@/components/ui/input";
import TaxiMap from "@/components/taxi/TaxiMap";
import { useTaxiRide } from "@/hooks/useTaxiRide";
import { useAuth } from "@/hooks/useAuth";
import { VehicleType, PaymentMethod } from "@/types/taxi";
import { toast } from "sonner";

export default function Taxi() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRide, calculateEstimate, isLoading, error } = useTaxiRide();
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState<[number, number] | null>(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VehicleType.STANDARD);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  // Simuler des taxis autour de Brazzaville
  const drivers = [
    { id: '1', coordinates: [15.2429, -4.2634] as [number, number], vehicleType: 'standard' },
    { id: '2', coordinates: [15.245, -4.26] as [number, number], vehicleType: 'premium' },
    { id: '3', coordinates: [15.24, -4.265] as [number, number], vehicleType: 'van' },
  ];

  // Synchroniser la sélection sur la carte avec les champs du formulaire
  const handlePickupSelect = (coords: [number, number], address: string) => {
    setPickupCoordinates(coords);
    setPickupLocation(address);
  };
  const handleDestinationSelect = (coords: [number, number], address: string) => {
    setDestinationCoordinates(coords);
    setDestination(address);
  };

  const vehicleTypes = [
    {
      id: VehicleType.STANDARD,
      name: "Taxi Standard",
      description: "Véhicule confortable pour 4 personnes",
      price: "1500 XAF",
      icon: "🚕",
      features: ["Climatisation", "Paiement en ligne", "Chauffeur professionnel"]
    },
    {
      id: VehicleType.PREMIUM,
      name: "Taxi Premium",
      description: "Véhicule haut de gamme pour 4 personnes",
      price: "2500 XAF",
      icon: "🚙",
      features: ["Véhicule luxueux", "Chauffeur en uniforme", "Eau minérale incluse"]
    },
    {
      id: VehicleType.VAN,
      name: "Van",
      description: "Véhicule spacieux pour 8 personnes",
      price: "3500 XAF",
      icon: "🚐",
      features: ["8 places assises", "Idéal pour groupe", "Bagages inclus"]
    }
  ];

  // Calculate estimate when coordinates change
  useEffect(() => {
    if (pickupCoordinates && destinationCoordinates) {
      calculateEstimate(
        pickupCoordinates[0],
        pickupCoordinates[1],
        destinationCoordinates[0],
        destinationCoordinates[1],
        selectedVehicle
      ).then(estimate => {
        if (estimate) {
          setEstimatedPrice(estimate.estimatedPrice);
        }
      });
    }
  }, [pickupCoordinates, destinationCoordinates, selectedVehicle, calculateEstimate]);

  const handleBooking = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver un taxi");
      return;
    }

    if (!pickupLocation || !destination || !pickupCoordinates || !destinationCoordinates) {
      toast.error("Veuillez remplir tous les champs et sélectionner les points sur la carte");
      return;
    }

    try {
      const ride = await createRide({
        pickupAddress: pickupLocation,
        pickupLatitude: pickupCoordinates[0],
        pickupLongitude: pickupCoordinates[1],
        destinationAddress: destination,
        destinationLatitude: destinationCoordinates[0],
        destinationLongitude: destinationCoordinates[1],
        vehicleType: selectedVehicle,
        paymentMethod: selectedPaymentMethod,
        passengerCount: 1,
      });

      if (ride) {
        toast.success("Course réservée avec succès !");
        navigate(`/taxi/ride/${ride.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:text-green-200 transition"
            >
              ← Retour à l'accueil
            </Button>
            <h1 className="text-2xl font-bold text-white">Service Taxi</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Réservez votre taxi en ligne
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Service de taxi rapide, fiable et sécurisé à Brazzaville
        </p>
      </section>

      {/* Booking Form */}
      <section className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Réserver un taxi</CardTitle>
            <CardDescription className="text-white/80 text-center">
              Remplissez les informations ci-dessous pour réserver votre trajet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-white font-medium">Point de départ</label>
              <Input
                placeholder="Adresse de départ"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-white font-medium">Destination</label>
              <Input
                placeholder="Adresse de destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>

            <div className="space-y-4">
              <label className="text-white font-medium">Type de véhicule</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicleTypes.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className={`cursor-pointer transition-all ${
                      selectedVehicle === vehicle.id
                        ? 'bg-white/30 border-white'
                        : 'bg-white/10 border-white/20'
                    }`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="text-3xl mb-2">{vehicle.icon}</div>
                      <CardTitle className="text-white text-lg">{vehicle.name}</CardTitle>
                      <CardDescription className="text-white/80">{vehicle.description}</CardDescription>
                      <div className="text-white font-bold text-lg">{vehicle.price}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-white/80 text-sm space-y-1">
                        {vehicle.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="space-y-2">
              <label className="text-white font-medium">Mode de paiement</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedPaymentMethod === PaymentMethod.CASH
                      ? 'bg-white/30 border-white'
                      : 'bg-white/10 border-white/20'
                  }`}
                  onClick={() => setSelectedPaymentMethod(PaymentMethod.CASH)}
                >
                  <CardContent className="text-center py-4">
                    <div className="text-2xl mb-2">💵</div>
                    <div className="text-white font-medium">Espèces</div>
                  </CardContent>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedPaymentMethod === PaymentMethod.CARD
                      ? 'bg-white/30 border-white'
                      : 'bg-white/10 border-white/20'
                  }`}
                  onClick={() => setSelectedPaymentMethod(PaymentMethod.CARD)}
                >
                  <CardContent className="text-center py-4">
                    <div className="text-2xl mb-2">💳</div>
                    <div className="text-white font-medium">Carte bancaire</div>
                  </CardContent>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedPaymentMethod === PaymentMethod.MOBILE_MONEY
                      ? 'bg-white/30 border-white'
                      : 'bg-white/10 border-white/20'
                  }`}
                  onClick={() => setSelectedPaymentMethod(PaymentMethod.MOBILE_MONEY)}
                >
                  <CardContent className="text-center py-4">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="text-white font-medium">Mobile Money</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Prix estimé */}
            {estimatedPrice && (
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <div className="text-white/80 text-sm">Prix estimé</div>
                <div className="text-white text-2xl font-bold">{estimatedPrice} XAF</div>
              </div>
            )}

            <Button 
              onClick={handleBooking}
              disabled={isLoading}
              className="w-full bg-white text-green-600 hover:bg-green-50 font-semibold py-3"
            >
              {isLoading ? "Réservation en cours..." : "Réserver maintenant"}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Carte interactive Taxi */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-4">Choisissez vos points sur la carte</h2>
        <div className="h-96 w-full rounded-lg overflow-hidden">
          <TaxiMap
            pickupCoordinates={pickupCoordinates ?? undefined}
            destinationCoordinates={destinationCoordinates ?? undefined}
            onPickupSelect={handlePickupSelect}
            onDestinationSelect={handleDestinationSelect}
            isSelectingPickup={true}
            isSelectingDestination={true}
            drivers={drivers}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Pourquoi choisir notre service taxi ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
              <Icons.lightning className="w-5 h-5 mr-2" />
              Rapide
            </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Arrivée en moins de 10 minutes dans la plupart des zones</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
              <Icons.shield className="w-5 h-5 mr-2" />
              Sécurisé
            </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Chauffeurs vérifiés et véhicules assurés</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white">💰 Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Prix fixe, pas de surprise à l'arrivée</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/80">
            <p>&copy; 2024 Bantudelice. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
