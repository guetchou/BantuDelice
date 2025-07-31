
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icons from "../components/ui/IconLibrary";
import { Input } from "@/components/ui/input";

export default function Taxi() {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("standard");

  const vehicleTypes = [
    {
      id: "standard",
      name: "Taxi Standard",
      description: "Véhicule confortable pour 4 personnes",
      price: "1500 XAF",
      icon: "🚕",
      features: ["Climatisation", "Paiement en ligne", "Chauffeur professionnel"]
    },
    {
      id: "premium",
      name: "Taxi Premium",
      description: "Véhicule haut de gamme pour 4 personnes",
      price: "2500 XAF",
      icon: "🚙",
      features: ["Véhicule luxueux", "Chauffeur en uniforme", "Eau minérale incluse"]
    },
    {
      id: "van",
      name: "Van",
      description: "Véhicule spacieux pour 8 personnes",
      price: "3500 XAF",
      icon: "🚐",
      features: ["8 places assises", "Idéal pour groupe", "Bagages inclus"]
    }
  ];

  const handleBooking = () => {
    if (!pickupLocation || !destination) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    alert(`Réservation confirmée !\nDe: ${pickupLocation}\nÀ: ${destination}\nVéhicule: ${vehicleTypes.find(v => v.id === selectedVehicle)?.name}`);
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

            <Button 
              onClick={handleBooking}
              className="w-full bg-white text-green-600 hover:bg-green-50 font-semibold py-3"
            >
              Réserver maintenant
            </Button>
          </CardContent>
        </Card>
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
