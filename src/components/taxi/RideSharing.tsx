
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";
import { toast } from 'sonner';
import { NearbyRidesList } from './ride-sharing/NearbyRidesList';
import { PriceDiscount } from './ride-sharing/PriceDiscount';
import { RideSharingBenefits } from './ride-sharing/RideSharingBenefits';
import { PassengerSelector } from './ride-sharing/PassengerSelector';
import { useSharedRides } from '@/hooks/useSharedRides';

interface RideSharingProps {
  rideId?: string;
  onSharingEnabled: (enabled: boolean, maxPassengers: number) => void;
  initialPrice: number;
}

const RideSharing: React.FC<RideSharingProps> = ({ 
  rideId, 
  onSharingEnabled, 
  initialPrice 
}) => {
  const [isSharingEnabled, setIsSharingEnabled] = useState(false);
  const [maxPassengers, setMaxPassengers] = useState(2);
  const [discountPercent, setDiscountPercent] = useState(15);
  
  const { nearbySharedRides, loading, joinSharedRide } = useSharedRides(
    rideId, 
    isSharingEnabled
  );

  const handleSharingToggle = (enabled: boolean) => {
    setIsSharingEnabled(enabled);
    if (enabled) {
      onSharingEnabled(true, maxPassengers);
      toast.success("Covoiturage activé", {
        description: `Vous pourrez partager votre trajet avec jusqu'à ${maxPassengers} autres passagers`
      });
    } else {
      onSharingEnabled(false, 0);
    }
  };

  const handleMaxPassengersChange = (passengers: number) => {
    setMaxPassengers(passengers);
    if (isSharingEnabled) {
      onSharingEnabled(true, passengers);
    }
  };

  const calculateDiscountedPrice = () => {
    return initialPrice * (1 - (discountPercent / 100));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Covoiturage</CardTitle>
          </div>
          <Switch 
            checked={isSharingEnabled}
            onCheckedChange={handleSharingToggle}
          />
        </div>
        <CardDescription>
          Partagez votre trajet avec d'autres passagers et économisez jusqu'à {discountPercent}%
        </CardDescription>
      </CardHeader>
      
      {isSharingEnabled && (
        <CardContent className="space-y-4">
          <PassengerSelector 
            maxPassengers={maxPassengers} 
            onChange={handleMaxPassengersChange} 
          />
          
          <PriceDiscount 
            initialPrice={initialPrice} 
            discountedPrice={calculateDiscountedPrice()} 
          />
          
          <RideSharingBenefits />
          
          <NearbyRidesList 
            rides={nearbySharedRides} 
            loading={loading} 
            onJoinRide={joinSharedRide} 
          />
        </CardContent>
      )}
    </Card>
  );
};

export default RideSharing;
