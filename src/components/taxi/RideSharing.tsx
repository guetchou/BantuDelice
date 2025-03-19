
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Users, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RideSharingProps {
  rideId: string | null;
  onSharingEnabled: (enabled: boolean, maxPassengers: number) => void;
  initialPrice: number;
}

const RideSharing: React.FC<RideSharingProps> = ({
  rideId,
  onSharingEnabled,
  initialPrice
}) => {
  const [isShared, setIsShared] = useState(false);
  const [maxPassengers, setMaxPassengers] = useState(2);
  
  const handleSharingToggle = (enabled: boolean) => {
    setIsShared(enabled);
    onSharingEnabled(enabled, maxPassengers);
  };
  
  const handlePassengersChange = (value: number[]) => {
    const passengers = value[0];
    setMaxPassengers(passengers);
    if (isShared) {
      onSharingEnabled(isShared, passengers);
    }
  };
  
  // Calculate discount based on sharing settings
  const calculateDiscount = () => {
    if (!isShared) return 0;
    
    // Base discount is 15% + 5% per additional passenger
    const discountPercentage = 15 + ((maxPassengers - 1) * 5);
    return discountPercentage;
  };
  
  const discount = calculateDiscount();
  const discountedPrice = isShared ? Math.round(initialPrice * (1 - (discount / 100))) : initialPrice;
  const savings = initialPrice - discountedPrice;
  
  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <Label htmlFor="shared-ride" className="font-medium cursor-pointer">
            Covoiturage
          </Label>
        </div>
        <Switch 
          id="shared-ride" 
          checked={isShared}
          onCheckedChange={handleSharingToggle}
        />
      </div>
      
      {isShared && (
        <div className="space-y-4 pt-3 border-t border-gray-200">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="max-passengers">Nombre maximum de passagers supplémentaires</Label>
              <span className="font-medium">{maxPassengers}</span>
            </div>
            <Slider
              id="max-passengers"
              value={[maxPassengers]}
              min={1}
              max={5}
              step={1}
              onValueChange={handlePassengersChange}
            />
          </div>
          
          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <div className="flex items-start gap-2">
              <Banknote className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Économisez jusqu'à {savings.toLocaleString()} FCFA ({discount}%)
                </p>
                <p className="text-xs text-green-600">
                  Le prix final dépend du nombre de personnes qui partageront le trajet avec vous
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                    Économique
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                    Écologique
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideSharing;
