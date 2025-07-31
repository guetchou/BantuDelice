import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ColisServicePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full shadow-xl border-0">
        <CardHeader className="flex flex-col items-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-xl py-8">
          <Package className="h-16 w-16 text-white mb-4 animate-pulse-smooth" />
          <CardTitle className="text-3xl font-bold text-white mb-2">Livraison de Colis</CardTitle>
          <p className="text-white/90 text-center max-w-md">
            Envoyez et recevez vos colis rapidement, en toute sécurité, partout à Brazzaville et ses environs. Suivi en temps réel, tarifs transparents, service fiable.
          </p>
        </CardHeader>
        <CardContent className="py-8 flex flex-col items-center">
          <div className="flex flex-col md:flex-row gap-6 w-full justify-center mb-8">
            <div className="flex-1 flex flex-col items-center">
              <MapPin className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="font-semibold text-lg mb-1">Enlèvement à domicile</h3>
              <p className="text-gray-600 text-center text-sm">Notre coursier récupère votre colis à l'adresse de votre choix.</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Package className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="font-semibold text-lg mb-1">Suivi en temps réel</h3>
              <p className="text-gray-600 text-center text-sm">Suivez votre colis à chaque étape jusqu'à la livraison.</p>
            </div>
          </div>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-8 py-4 text-lg shadow-lg hover:from-orange-500 hover:to-yellow-400 transition"
            onClick={() => navigate("/delivery")}
          >
            Réserver une livraison <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColisServicePage; 