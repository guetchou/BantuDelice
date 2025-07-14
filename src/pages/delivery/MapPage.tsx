
import React from "react";
import InteractiveMap from "@/components/delivery/InteractiveMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Carte de livraison interactive
          </h1>
          <p className="text-gray-600">
            Cliquez sur "Ma position" pour utiliser votre géolocalisation
          </p>
        </div>

        <InteractiveMap 
          initialLat={-4.269666}
          initialLng={15.275815}
          orderId="demo-order-123"
          height="500px"
        />
      </div>
    </div>
  );
};

export default MapPage;
