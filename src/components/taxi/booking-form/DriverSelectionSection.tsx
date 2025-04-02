
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import NearbyDrivers from '../NearbyDrivers';
import TaxiMap from '../TaxiMap';
import { TaxiDriver, TaxiVehicleType } from '@/types/taxi';

interface DriverSelectionSectionProps {
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  vehicleType: TaxiVehicleType;
  onSelectDriver: (driver: TaxiDriver) => void;
  selectedDriver: TaxiDriver | null;
  availableDrivers?: TaxiDriver[];
}

const DriverSelectionSection: React.FC<DriverSelectionSectionProps> = ({
  pickupLatitude,
  pickupLongitude,
  destinationLatitude,
  destinationLongitude,
  vehicleType,
  onSelectDriver,
  selectedDriver,
  availableDrivers = []
}) => {
  const isLoading = availableDrivers.length === 0;

  return (
    <div className="space-y-6">
      <div className="h-[250px] w-full rounded-lg overflow-hidden border border-gray-200 mb-6">
        <TaxiMap
          pickupCoordinates={[pickupLongitude, pickupLatitude]}
          destinationCoordinates={[destinationLongitude, destinationLatitude]}
          onPickupSelect={() => {}}
          onDestinationSelect={() => {}}
          drivers={availableDrivers.map(driver => ({
            id: driver.id,
            coordinates: [
              driver.current_longitude || 0, 
              driver.current_latitude || 0
            ],
            vehicleType: driver.vehicle_type
          }))}
        />
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium text-lg">Recherche de chauffeurs...</p>
                <p className="text-muted-foreground">
                  Nous recherchons les meilleurs chauffeurs à proximité
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <NearbyDrivers
          pickupLatitude={pickupLatitude}
          pickupLongitude={pickupLongitude}
          destinationLatitude={destinationLatitude}
          destinationLongitude={destinationLongitude}
          vehicleType={vehicleType}
          onSelectDriver={onSelectDriver}
          rideId="placeholder"
          availableDrivers={availableDrivers}
          selectedDriver={selectedDriver}
        />
      )}
    </div>
  );
};

export default DriverSelectionSection;
