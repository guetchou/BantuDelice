
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Shield, Languages } from "lucide-react";
import { TaxiDriver, TaxiVehicleType } from '@/types/taxi';

interface NearbyDriversProps {
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  vehicleType: string;
  onSelectDriver: (driver: TaxiDriver) => void;
  rideId: string;
  availableDrivers?: TaxiDriver[];
  selectedDriver: TaxiDriver | null;
}

const NearbyDrivers: React.FC<NearbyDriversProps> = ({
  pickupLatitude,
  pickupLongitude,
  destinationLatitude,
  destinationLongitude,
  vehicleType,
  onSelectDriver,
  rideId,
  availableDrivers = [],
  selectedDriver
}) => {
  const isLoading = availableDrivers.length === 0;
  
  // Calculate estimated arrival time based on distance
  const getEstimatedArrival = (driver: TaxiDriver): string => {
    if (!driver.current_latitude || !driver.current_longitude) return '10 min';
    
    // Simple distance calculation
    const distance = calculateDistance(
      pickupLatitude, 
      pickupLongitude, 
      driver.current_latitude, 
      driver.current_longitude
    );
    
    // Rough estimate: 2 min per km + 3 min base
    const minutes = Math.ceil(distance * 2) + 3;
    return `${minutes} min`;
  };
  
  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recherche de chauffeurs à proximité...</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {availableDrivers.length > 0 
          ? 'Chauffeurs disponibles à proximité' 
          : 'Aucun chauffeur disponible pour le moment'}
      </h3>
      
      {availableDrivers.map((driver) => (
        <div 
          key={driver.id}
          onClick={() => onSelectDriver(driver)}
          className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-all ${
            selectedDriver?.id === driver.id 
              ? 'border-primary bg-primary/5' 
              : 'hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={driver.photo_url || driver.profile_image || 'https://via.placeholder.com/48'} 
                alt={driver.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">{driver.name}</h4>
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="ml-1 text-sm">{driver.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {driver.vehicle_model || driver.vehicle_info?.model || 'Véhicule standard'} • 
                {driver.license_plate || driver.vehicle_info?.license_plate || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{getEstimatedArrival(driver)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{driver.years_experience || 3} ans d'expérience</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Vérifié</span>
            </div>
            {driver.languages && driver.languages.length > 0 && (
              <div className="flex items-center gap-1">
                <Languages className="h-4 w-4 text-blue-500" />
                <span>{driver.languages.join(', ')}</span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onSelectDriver(driver);
            }}
            className={`w-full ${
              selectedDriver?.id === driver.id 
                ? 'bg-primary' 
                : 'bg-primary/80 hover:bg-primary'
            }`}
          >
            {selectedDriver?.id === driver.id ? 'Chauffeur sélectionné' : 'Choisir ce chauffeur'}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NearbyDrivers;
