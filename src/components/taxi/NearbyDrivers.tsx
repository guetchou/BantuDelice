
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, Car, Star, Check } from "lucide-react";
import { useTaxiDriverSelection } from "@/hooks/useTaxiDriverSelection";
import { TaxiDriver } from "@/types/taxi";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface NearbyDriversProps {
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  vehicleType?: string;
  onSelectDriver: (driver: TaxiDriver) => void;
  rideId: string;
}

const NearbyDrivers: React.FC<NearbyDriversProps> = ({
  pickupLatitude,
  pickupLongitude,
  destinationLatitude,
  destinationLongitude,
  vehicleType,
  onSelectDriver,
  rideId
}) => {
  const { isLoading, nearbyDrivers, findOptimalDrivers } = useTaxiDriverSelection();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  useEffect(() => {
    const loadDrivers = async () => {
      await findOptimalDrivers(
        pickupLatitude,
        pickupLongitude,
        destinationLatitude,
        destinationLongitude,
        vehicleType
      );
    };

    loadDrivers();
  }, [pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude, vehicleType, findOptimalDrivers]);

  const handleSelectDriver = (driver: TaxiDriver) => {
    setSelectedDriverId(driver.id);
    onSelectDriver(driver);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recherche de chauffeurs disponibles...</h3>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (nearbyDrivers.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucun chauffeur disponible</h3>
        <p className="text-gray-500">
          Nous ne trouvons pas de chauffeurs disponibles pour le moment. Veuillez réessayer dans quelques instants.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Chauffeurs disponibles ({nearbyDrivers.length})</h3>
      <div className="grid gap-4">
        {nearbyDrivers.map((driver) => {
          const isSelected = selectedDriverId === driver.id;
          
          const estimatedArrival = Math.floor(Math.random() * 10) + 5; // Random time between 5-15 minutes
          
          return (
            <Card 
              key={driver.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectDriver(driver)}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={driver.photo_url} alt={driver.name} />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{driver.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="h-3 w-3 fill-yellow-500" />
                        <span>{driver.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({Math.floor(Math.random() * 500) + 50} courses)</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{estimatedArrival} min</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Car className="h-3 w-3 mr-1" />
                      {driver.vehicle_model}
                    </Badge>
                    
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      {driver.license_plate}
                    </Badge>
                    
                    {driver.languages && driver.languages.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {driver.languages.join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant={isSelected ? "default" : "outline"} 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDriver(driver);
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Sélectionné
                    </>
                  ) : (
                    "Choisir"
                  )}
                </Button>
              </div>
              
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary/20 text-sm text-primary">
                  <p>Ce chauffeur sera notifié de votre demande de course.</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyDrivers;
