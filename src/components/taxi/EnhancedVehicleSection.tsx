
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Car, Bus, TrendingUp, Users } from "lucide-react";

// Types de véhicules disponibles
const vehicleTypes = [
  {
    id: 'standard',
    name: 'Standard',
    icon: Car,
    description: 'Berline confortable pour 1-4 personnes',
    basePrice: 500,
    eta: '5-10 min'
  },
  {
    id: 'comfort',
    name: 'Confort',
    icon: Car,
    description: 'Plus d\'espace, climatisation, eau offerte',
    basePrice: 800,
    eta: '6-12 min'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: TrendingUp,
    description: 'Service haut de gamme, véhicule de luxe',
    basePrice: 1200,
    eta: '7-15 min'
  },
  {
    id: 'van',
    name: 'Van',
    icon: Users,
    description: 'Parfait pour les groupes jusqu\'à 6 personnes',
    basePrice: 1500,
    eta: '8-15 min'
  }
];

interface EnhancedVehicleSectionProps {
  selectedVehicleType: string;
  onVehicleSelect: (vehicleType: string) => void;
  isLoading?: boolean;
}

const EnhancedVehicleSection: React.FC<EnhancedVehicleSectionProps> = ({
  selectedVehicleType,
  onVehicleSelect,
  isLoading = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">Type de véhicule</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Choisissez le type de véhicule qui vous convient le mieux
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {vehicleTypes.map((vehicle) => {
          const isSelected = selectedVehicleType === vehicle.id;
          
          return (
            <Card
              key={vehicle.id}
              className={cn(
                "border cursor-pointer transition-all hover:border-primary/50",
                isSelected && "border-primary bg-primary/5"
              )}
              onClick={() => onVehicleSelect(vehicle.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted",
                    isSelected && "bg-primary/20 text-primary"
                  )}>
                    <vehicle.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{vehicle.name}</p>
                      <p className="font-semibold text-sm">
                        {isLoading ? (
                          <span className="inline-block h-4 w-16 animate-pulse bg-muted rounded"></span>
                        ) : (
                          <>
                            <span className="text-primary font-semibold">
                              {vehicle.basePrice} FCFA
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">Base</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">{vehicle.description}</p>
                      <p className="text-xs text-muted-foreground">ETA: {vehicle.eta}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedVehicleSection;
