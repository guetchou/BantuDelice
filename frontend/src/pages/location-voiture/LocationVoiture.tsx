import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LocationVoiture: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="max-w-2xl w-full shadow-xl border-0">
        <CardHeader className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-xl py-8">
          <CardTitle className="text-3xl font-bold text-white mb-2">Location de Voiture</CardTitle>
          <p className="text-white/90 text-center max-w-md">
            Réservez une voiture facilement pour vos déplacements à Brazzaville et partout au Congo. Service rapide, fiable et sécurisé.
          </p>
        </CardHeader>
        <CardContent className="py-8 flex flex-col items-center">
          <p className="text-gray-600 text-center text-lg mb-4">
            Ce service sera bientôt disponible. Restez connecté !
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationVoiture; 