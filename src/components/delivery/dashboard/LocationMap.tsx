
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import DeliveryMap from "@/components/DeliveryMap";

interface LocationMapProps {
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  onUpdateLocation: () => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ currentLocation, onUpdateLocation }) => {
  if (!currentLocation) return null;
  
  return (
    <Card className="mt-8 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Position actuelle</h2>
        <Button onClick={onUpdateLocation} className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Mettre à jour la position
        </Button>
      </div>
      <DeliveryMap
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
      />
    </Card>
  );
};

export default LocationMap;
