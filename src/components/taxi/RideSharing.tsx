
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Ban, Sparkles } from "lucide-react";
import { formatPrice } from './booking-form/bookingFormUtils';

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
  const [isSharingEnabled, setIsSharingEnabled] = useState(false);
  const [maxPassengers, setMaxPassengers] = useState<string>("1");
  
  // Constantes pour le calcul des réductions
  const DISCOUNT_PERCENT = 25; // 25% de réduction
  
  const handleSharingToggle = (checked: boolean) => {
    setIsSharingEnabled(checked);
    onSharingEnabled(checked, parseInt(maxPassengers));
  };
  
  const handleMaxPassengersChange = (value: string) => {
    setMaxPassengers(value);
    onSharingEnabled(isSharingEnabled, parseInt(value));
  };
  
  // Calculer le prix réduit
  const discountedPrice = Math.round(initialPrice * (1 - DISCOUNT_PERCENT / 100));
  const savings = initialPrice - discountedPrice;
  
  return (
    <Card className={isSharingEnabled ? "border-primary/20 bg-primary/5" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isSharingEnabled ? (
            <Users className="h-5 w-5 text-primary" />
          ) : (
            <Ban className="h-5 w-5 text-muted-foreground" />
          )}
          Trajet partagé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Switch
              id="sharing-mode"
              checked={isSharingEnabled}
              onCheckedChange={handleSharingToggle}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="sharing-mode" className="text-base">
                Activer le partage de trajet
              </Label>
              <p className="text-sm text-muted-foreground">
                Partagez votre course avec d'autres passagers et économisez {DISCOUNT_PERCENT}% sur le prix
              </p>
            </div>
          </div>
          
          {isSharingEnabled && (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="max-passengers">Nombre de places disponibles</Label>
                <Select 
                  value={maxPassengers} 
                  onValueChange={handleMaxPassengersChange}
                  disabled={!isSharingEnabled}
                >
                  <SelectTrigger id="max-passengers" className="w-full">
                    <SelectValue placeholder="Sélectionnez un nombre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 place</SelectItem>
                    <SelectItem value="2">2 places</SelectItem>
                    <SelectItem value="3">3 places</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-primary/10 p-3 rounded-md border border-primary/20 flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Économisez {formatPrice(savings)}</p>
                  <p className="text-sm">
                    Prix estimé: <span className="line-through">{formatPrice(initialPrice)}</span> → <span className="font-bold text-primary">{formatPrice(discountedPrice)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RideSharing;
