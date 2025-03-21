
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryDriver } from "@/types/delivery";
import DeliveryDriverMap from '@/components/delivery/DeliveryDriverMap';

interface LocationMapProps {
  restaurantId: string;
  activeDrivers: DeliveryDriver[];
  isLoading: boolean;
}

const LocationMap = ({ restaurantId, activeDrivers, isLoading }: LocationMapProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Carte des livreurs</CardTitle>
        <CardDescription>
          {isLoading 
            ? "Chargement de la carte..." 
            : `${activeDrivers.length} livreur${activeDrivers.length > 1 ? 's' : ''} en ligne`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[400px]">
        {isLoading ? (
          <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center">
            Chargement de la carte...
          </div>
        ) : (
          <DeliveryDriverMap 
            restaurantId={restaurantId} 
            height="100%" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;
