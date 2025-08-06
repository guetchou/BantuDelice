
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TaxiMap from "@/components/taxi/TaxiMap";
import { useTaxiRide } from "@/hooks/useTaxiRide";
import { useAuth } from "@/hooks/useAuth";
import { VehicleType, PaymentMethod } from "@/types/taxi";
import { toast } from "sonner";
import { 
  MapPin, 
  Navigation, 
  Car, 
  CreditCard, 
  DollarSign, 
  Smartphone,
  Clock,
  Shield,
  Star,
  Users,
  Package,
  Zap,
  ArrowLeft,
  Search,
  LocateIcon,
  Calendar,
  User
} from "lucide-react";

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
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

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
      name: "Standard",
      description: "Véhicule confortable pour 4 personnes",
      basePrice: 1500,
      icon: Car,
      features: ["Climatisation", "Paiement en ligne", "Chauffeur professionnel"],
      capacity: "4 personnes",
      color: "bg-blue-500"
    },
    {
      id: VehicleType.PREMIUM,
      name: "Premium",
      description: "Véhicule haut de gamme pour 4 personnes",
      basePrice: 2500,
      icon: Car,
      features: ["Véhicule luxueux", "Chauffeur en uniforme", "Eau minérale incluse"],
      capacity: "4 personnes",
      color: "bg-purple-500"
    },
    {
      id: VehicleType.VAN,
      name: "Van",
      description: "Véhicule spacieux pour 8 personnes",
      basePrice: 3500,
      icon: Users,
      features: ["8 places assises", "Idéal pour groupe", "Bagages inclus"],
      capacity: "8 personnes",
      color: "bg-green-500"
    }
  ];

  const paymentMethods = [
    {
      id: PaymentMethod.CASH,
      name: "Espèces",
      icon: DollarSign,
      description: "Paiement en espèces"
    },
    {
      id: PaymentMethod.CARD,
      name: "Carte bancaire",
      icon: CreditCard,
      description: "Visa, Mastercard, etc."
    },
    {
      id: PaymentMethod.MOBILE_MONEY,
      name: "Mobile Money",
      icon: Smartphone,
      description: "Airtel Money, M-Pesa"
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
          setEstimatedTime(15); // Temps estimé par défaut
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center space-x-2">
              <Car className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Taxi</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de réservation */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Réserver un taxi
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Remplissez les informations pour votre trajet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Point de départ */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Point de départ
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Adresse de départ"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Destination */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Navigation className="w-4 h-4 mr-2 text-green-600" />
                    Destination
                  </label>
                  <div className="relative">
                    <LocateIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Adresse de destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Type de véhicule */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Type de véhicule</label>
                  <div className="space-y-3">
                    {vehicleTypes.map((vehicle) => {
                      const IconComponent = vehicle.icon;
                      return (
                        <div
                          key={vehicle.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedVehicle === vehicle.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedVehicle(vehicle.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${vehicle.color} text-white`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
                                <p className="text-sm text-gray-600">{vehicle.description}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    {vehicle.capacity}
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Package className="w-3 h-3 mr-1" />
                                    Bagages
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{vehicle.basePrice} XAF</div>
                              <div className="text-xs text-gray-500">Prix de base</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mode de paiement */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Mode de paiement</label>
                  <div className="grid grid-cols-1 gap-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <div
                          key={method.id}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPaymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimation */}
                {(estimatedPrice || estimatedTime) && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-gray-900">Estimation du trajet</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {estimatedPrice && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{estimatedPrice} XAF</div>
                          <div className="text-sm text-gray-600">Prix estimé</div>
                        </div>
                      )}
                      {estimatedTime && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{estimatedTime} min</div>
                          <div className="text-sm text-gray-600">Temps estimé</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking}
                  disabled={isLoading || !pickupLocation || !destination}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Réservation en cours...
                    </div>
                  ) : (
                    "Réserver maintenant"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Informations supplémentaires */}
            <div className="mt-6 space-y-4">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-gray-900">Sécurité garantie</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tous nos chauffeurs sont vérifiés et nos véhicules sont assurés pour votre sécurité.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Arrivée rapide</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Temps d'attente moyen de 5-10 minutes dans la plupart des zones de Brazzaville.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Carte interactive */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Sélectionnez vos points sur la carte
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Cliquez sur la carte pour définir votre point de départ et destination
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 w-full">
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
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Chauffeurs actifs</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">4.8</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    Note moyenne
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Service disponible</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
