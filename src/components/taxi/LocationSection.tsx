
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, ArrowDown } from "lucide-react";

interface LocationSectionProps {
  pickupAddress: string;
  setPickupAddress: (address: string) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  onLocationSelect: (address: string, isPickup: boolean) => void;
  onUseCurrentLocation: () => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  pickupAddress,
  setPickupAddress,
  destinationAddress,
  setDestinationAddress,
  onLocationSelect,
  onUseCurrentLocation
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pickup">Point de départ</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="pickup"
              placeholder="Adresse de départ"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={onUseCurrentLocation}
            title="Utiliser ma position actuelle"
          >
            <Navigation className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onLocationSelect(pickupAddress, true)}
          >
            Valider
          </Button>
        </div>
      </div>
      
      <div className="relative flex justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-10 bg-gray-200"></div>
        </div>
        <div className="relative bg-white z-10 p-1 rounded-full border border-gray-200">
          <ArrowDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="destination"
              placeholder="Adresse de destination"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onLocationSelect(destinationAddress, false)}
          >
            Valider
          </Button>
        </div>
      </div>
      
      {(pickupAddress && destinationAddress) && (
        <div className="bg-green-50 p-3 rounded-md border border-green-200">
          <p className="text-sm text-green-700">
            Adresses validées. Vous pouvez continuer avec votre réservation.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSection;
