import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, Clock, MapPin, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TaxiFeature() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Service de Taxi Premium</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Voyagez en toute sécurité et confort avec notre service de taxi premium. 
            Des chauffeurs professionnels à votre service 24/7.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="font-semibold mb-2">Sécurité Garantie</h3>
            <p className="text-gray-600">Chauffeurs vérifiés et véhicules assurés</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Clock className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="font-semibold mb-2">Service 24/7</h3>
            <p className="text-gray-600">Disponible à toute heure du jour et de la nuit</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Car className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="font-semibold mb-2">Véhicules Premium</h3>
            <p className="text-gray-600">Flotte moderne et confortable</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <MapPin className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="font-semibold mb-2">Suivi en Temps Réel</h3>
            <p className="text-gray-600">Suivez votre trajet en direct</p>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate('/taxi/booking')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            Réserver un Taxi
          </Button>
        </div>
      </div>
    </section>
  );
}