import React from "react";
import DeliveryMap from "@/components/DeliveryMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MapPage: React.FC = () => {
  // Coordonnées par défaut : Brazzaville
  const latitude = -4.2634;
  const longitude = 15.2429;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <CardTitle>Carte de livraison</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 400 }}>
          <DeliveryMap latitude={latitude} longitude={longitude} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MapPage; 