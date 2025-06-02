
import React from 'react';
import { MapPin, Navigation } from "lucide-react";
import { TaxiRide } from '@/types/taxi';

interface LocationInfoProps {
  ride: TaxiRide;
}

export const LocationInfo = ({ ride }: LocationInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-green-100 p-2 rounded-full">
          <MapPin className="h-4 w-4 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Départ</p>
          <p className="font-medium">{ride.pickup_address}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="bg-red-100 p-2 rounded-full">
          <Navigation className="h-4 w-4 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Destination</p>
          <p className="font-medium">{ride.destination_address}</p>
        </div>
      </div>
    </div>
  );
};
