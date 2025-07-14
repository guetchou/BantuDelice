
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';

export interface LocationMapProps {
  currentLocation: { latitude: number; longitude: number } | null;
  onUpdateLocation: () => Promise<void>;
  restaurantId?: string;
  activeDrivers?: any[];
  isLoading?: boolean;
  onLocationSelect?: () => void;
  onAddressChange?: () => void;
  initialAddress?: string;
  showSavedLocations?: boolean;
}

const LocationMap = ({ 
  currentLocation, 
  onUpdateLocation,
  restaurantId,
  activeDrivers = [],
  isLoading = false,
  onLocationSelect,
  onAddressChange,
  initialAddress,
  showSavedLocations = false
}: LocationMapProps) => {
  return (
    <Card className="col-span-2 mt-6">
      <CardHeader>
        <CardTitle>Votre position actuelle</CardTitle>
        <CardDescription>
          {isLoading 
            ? "Chargement de la carte..." 
            : currentLocation 
              ? `Latitude: ${currentLocation.latitude.toFixed(6)}, Longitude: ${currentLocation.longitude.toFixed(6)}`
              : "Position non disponible"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted h-[300px] rounded-md flex items-center justify-center mb-4">
          {isLoading ? (
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          ) : currentLocation ? (
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p>Votre position est mise à jour</p>
              {initialAddress && (
                <p className="text-sm text-muted-foreground mt-1">{initialAddress}</p>
              )}
            </div>
          ) : (
            <p>Impossible d'accéder à votre position</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onUpdateLocation}
            className="flex-1"
            disabled={!currentLocation || isLoading}
          >
            Mettre à jour ma position
          </Button>
          
          {onLocationSelect && (
            <Button 
              variant="outline"
              onClick={onLocationSelect}
              disabled={isLoading}
            >
              Sélectionner position
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
