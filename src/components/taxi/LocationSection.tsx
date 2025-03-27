
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, MapPinned, CornerDownLeft } from "lucide-react";

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
  // Simuler des suggestions d'adresses pour la démo
  const mockSuggestions = [
    "Centre-ville, Brazzaville",
    "Aéroport Maya-Maya, Brazzaville",
    "Marché Total, Brazzaville",
    "Stade Alphonse Massemba-Débat, Brazzaville",
    "Université Marien Ngouabi, Brazzaville"
  ];
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-3 inset-y-0 flex flex-col items-center justify-between py-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="w-0.5 h-full bg-gray-200 -mt-1.5 -mb-1.5"></div>
          <div className="w-3 h-3 rounded-full bg-primary"></div>
        </div>
        
        <div className="space-y-6 pl-10">
          <div className="space-y-2">
            <Label htmlFor="pickup">Point de départ</Label>
            <div className="relative">
              <Input
                id="pickup"
                placeholder="D'où partez-vous?"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && pickupAddress) {
                    onLocationSelect(pickupAddress, true);
                  }
                }}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => onUseCurrentLocation()}
                title="Utiliser ma position actuelle"
              >
                <MapPinned className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <Input
                id="destination"
                placeholder="Où allez-vous?"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && destinationAddress) {
                    onLocationSelect(destinationAddress, false);
                  }
                }}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => {
                  if (destinationAddress) {
                    onLocationSelect(destinationAddress, false);
                  }
                }}
                title="Rechercher cette adresse"
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggestions d'adresses */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-2">Adresses récentes</p>
          <div className="space-y-2">
            {mockSuggestions.slice(0, 3).map((address, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2"
                onClick={() => {
                  if (!pickupAddress) {
                    setPickupAddress(address);
                    onLocationSelect(address, true);
                  } else if (!destinationAddress) {
                    setDestinationAddress(address);
                    onLocationSelect(address, false);
                  }
                }}
              >
                {index % 2 === 0 ? (
                  <MapPin className="h-4 w-4 text-primary" />
                ) : (
                  <Navigation className="h-4 w-4 text-orange-500" />
                )}
                <span className="truncate text-sm font-normal">{address}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSection;
