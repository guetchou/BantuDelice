
import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Shield, Languages } from "lucide-react";
import { useTaxiDriverSelection } from '@/hooks/useTaxiDriverSelection';
import { TaxiDriver } from '@/types/taxi';

interface NearbyDriversProps {
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  vehicleType: string;
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
  const {
    isLoading,
    nearbyDrivers,
    selectedDriver,
    findOptimalDrivers,
    handleSelectDriver
  } = useTaxiDriverSelection();
  
  const [searchingForDrivers, setSearchingForDrivers] = useState(true);
  const [foundDrivers, setFoundDrivers] = useState<TaxiDriver[]>([]);

  useEffect(() => {
    // Simulate fetching nearby drivers
    const fetchDrivers = async () => {
      setSearchingForDrivers(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data for demo purposes
        const mockDrivers: TaxiDriver[] = [
          {
            id: '1',
            user_id: 'user-123',
            name: 'Jean Dupont',
            phone: '+242 06 123 4567',
            vehicle_type: vehicleType as TaxiVehicleType,
            license_plate: 'BZV 1234',
            rating: 4.8,
            is_available: true,
            current_latitude: pickupLatitude + 0.01,
            current_longitude: pickupLongitude - 0.01,
            photo_url: 'https://randomuser.me/api/portraits/men/32.jpg',
            vehicle_model: 'Toyota Corolla', 
            languages: ['Français', 'Lingala'],
            years_experience: 5,
            total_rides: 342,
            verified: true,
            location: [pickupLatitude + 0.01, pickupLongitude - 0.01],
            status: 'available'
          },
          {
            id: '2',
            user_id: 'user-456',
            name: 'Marie Okemba',
            phone: '+242 05 234 5678',
            vehicle_type: vehicleType as TaxiVehicleType,
            license_plate: 'BZV 5678',
            rating: 4.6,
            is_available: true,
            current_latitude: pickupLatitude - 0.005,
            current_longitude: pickupLongitude + 0.007,
            photo_url: 'https://randomuser.me/api/portraits/women/44.jpg',
            vehicle_model: 'Hyundai Accent',
            languages: ['Français', 'Anglais'],
            years_experience: 3,
            total_rides: 187,
            verified: true,
            location: [pickupLatitude - 0.005, pickupLongitude + 0.007],
            status: 'available'
          },
          {
            id: '3',
            user_id: 'user-789',
            name: 'Pascal Moukala',
            phone: '+242 06 345 6789',
            vehicle_type: vehicleType as TaxiVehicleType,
            license_plate: 'BZV 9012',
            rating: 4.9,
            is_available: true,
            current_latitude: pickupLatitude + 0.008,
            current_longitude: pickupLongitude + 0.002,
            photo_url: 'https://randomuser.me/api/portraits/men/67.jpg',
            vehicle_model: 'Honda Civic',
            languages: ['Français', 'Kituba'],
            years_experience: 7,
            total_rides: 520,
            verified: true,
            location: [pickupLatitude + 0.008, pickupLongitude + 0.002],
            status: 'available'
          }
        ];
        
        setFoundDrivers(mockDrivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setSearchingForDrivers(false);
      }
    };
    
    fetchDrivers();
  }, [pickupLatitude, pickupLongitude, vehicleType]);

  const handleDriverSelect = (driver: TaxiDriver) => {
    handleSelectDriver(driver);
    onSelectDriver(driver);
  };

  if (searchingForDrivers) {
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
        {foundDrivers.length > 0 
          ? 'Chauffeurs disponibles à proximité' 
          : 'Aucun chauffeur disponible pour le moment'}
      </h3>
      
      {foundDrivers.map((driver) => (
        <div 
          key={driver.id}
          onClick={() => handleDriverSelect(driver)}
          className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-all ${
            selectedDriver?.id === driver.id 
              ? 'border-primary bg-primary/5' 
              : 'hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={driver.photo_url || 'https://via.placeholder.com/48'} 
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
              <p className="text-sm text-gray-500">{driver.vehicle_model} • {driver.license_plate}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span>7 min</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{driver.years_experience} ans d'expérience</span>
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
              handleDriverSelect(driver);
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
