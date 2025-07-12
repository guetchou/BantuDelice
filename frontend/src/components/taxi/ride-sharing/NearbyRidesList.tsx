
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaxiRide } from '@/types/taxi';

interface NearbyRidesListProps {
  rides: TaxiRide[];
  loading: boolean;
  onJoinRide: (rideId: string) => void;
}

export const NearbyRidesList: React.FC<NearbyRidesListProps> = ({ 
  rides, 
  loading, 
  onJoinRide 
}) => {
  if (rides.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-medium">Covoiturages disponibles à proximité</h4>
      
      {rides.map(ride => (
        <Card key={ride.id} className="p-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">
                Trajet vers {ride.destination_address.split(',')[0]}
              </p>
              <p className="text-xs text-gray-500">
                Départ dans ~{Math.floor(Math.random() * 10) + 5} min
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onJoinRide(ride.id)}
              disabled={loading}
            >
              Rejoindre
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
