
import React from 'react';
import { TaxiRide } from '@/types/taxi';

interface LocationInfoProps {
  ride: TaxiRide;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({ ride }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="mt-1">
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          <div className="h-full w-0.5 bg-gray-200 mx-auto"></div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Départ</p>
          <p className="font-medium">{ride.pickup_address}</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="mt-1">
          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Destination</p>
          <p className="font-medium">{ride.destination_address}</p>
        </div>
      </div>
    </div>
  );
};
