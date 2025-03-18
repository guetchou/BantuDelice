
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Car, Clock, MapPin, Phone, ThumbsUp, AlertCircle } from "lucide-react";
import { useTaxiDriverSelection } from '@/hooks/useTaxiDriverSelection';
import { TaxiDriver } from '@/types/taxi';
import { Skeleton } from '@/components/ui/skeleton';

interface NearbyDriversProps {
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  vehicleType?: string;
  onSelectDriver: (driver: TaxiDriver) => void;
  rideId?: string;
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
  const { isLoading, nearbyDrivers, findOptimalDrivers, requestDriver } = useTaxiDriverSelection();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadDrivers = async () => {
      if (pickupLatitude && pickupLongitude && destinationLatitude && destinationLongitude) {
        await findOptimalDrivers(
          pickupLatitude,
          pickupLongitude,
          destinationLatitude,
          destinationLongitude,
          vehicleType
        );
      }
    };
    
    loadDrivers();
  }, [pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude, vehicleType]);

  const handleSelectDriver = async (driver: TaxiDriver) => {
    setSelectedDriverId(driver.id);
    onSelectDriver(driver);
    
    if (rideId) {
      await requestDriver(rideId, driver.id);
    }
  };

  const renderDriverCard = (driver: TaxiDriver & {
    distance_to_pickup?: number;
    time_to_pickup?: number;
  }) => {
    const isSelected = selectedDriverId === driver.id;
    
    return (
      <Card 
        key={driver.id} 
        className={`mb-4 transition-all ${
          isSelected ? 'border-primary shadow-md' : 'hover:border-gray-300'
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border border-gray-200">
                <AvatarImage src={driver.photo_url} alt={driver.name} />
                <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{driver.name}</CardTitle>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{driver.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({driver.total_rides || 0} courses)
                  </span>
                </div>
              </div>
            </div>
            <Badge variant={driver.verified ? "outline" : "secondary"}>
              {driver.verified ? "Vérifié" : "Chauffeur"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3 pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Car className="h-4 w-4 text-gray-500 mr-2" />
              <span>{driver.vehicle_model}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              <span>{driver.distance_to_pickup?.toFixed(1) || '-'} km</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span>~{driver.time_to_pickup || '-'} min</span>
            </div>
            {driver.languages && (
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 text-gray-500 mr-2" />
                <span>{driver.languages.join(', ')}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button 
            onClick={() => handleSelectDriver(driver)} 
            className="w-full" 
            variant={isSelected ? "default" : "outline"}
            disabled={isSelected}
          >
            {isSelected ? "Chauffeur sélectionné" : "Choisir ce chauffeur"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recherche des chauffeurs à proximité...</h3>
        {[1, 2, 3].map(i => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (nearbyDrivers.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
        <CardTitle className="text-lg mb-2">Aucun chauffeur disponible</CardTitle>
        <CardDescription>
          Nous n'avons pas trouvé de chauffeurs disponibles à proximité pour le moment. 
          Veuillez réessayer dans quelques minutes.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium mb-4">Chauffeurs à proximité ({nearbyDrivers.length})</h3>
      {nearbyDrivers.map(renderDriverCard)}
    </div>
  );
};

export default NearbyDrivers;
