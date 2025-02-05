
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationSectionProps {
  pickupAddress: string;
  setPickupAddress: (address: string) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  onLocationSelect: (address: string, isPickup: boolean) => Promise<void>;
  onUseCurrentLocation: () => void;
}

const LocationSection = ({
  pickupAddress,
  setPickupAddress,
  destinationAddress,
  setDestinationAddress,
  onLocationSelect,
  onUseCurrentLocation
}: LocationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pickup">Point de départ</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="pickup"
              className="pl-10"
              placeholder="Adresse de départ"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              onBlur={() => onLocationSelect(pickupAddress, true)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onUseCurrentLocation}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="destination"
            className="pl-10"
            placeholder="Adresse de destination"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            onBlur={() => onLocationSelect(destinationAddress, false)}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
