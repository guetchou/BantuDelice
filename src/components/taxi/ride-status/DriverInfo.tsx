
import React from 'react';
import { TaxiDriver } from '@/types/taxi';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Star } from "lucide-react";

interface DriverInfoProps {
  driver: TaxiDriver;
  onContactDriver: (message: string) => void;
}

export const DriverInfo: React.FC<DriverInfoProps> = ({ driver, onContactDriver }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Détails du chauffeur</h3>
      
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={driver.profile_image} alt={driver.name} />
          <AvatarFallback>{driver.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <p className="font-medium">{driver.name}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>{driver.rating}</span>
            <span className="mx-1">•</span>
            <span>{driver.vehicle_model || driver.vehicle_type}</span>
          </div>
          <p className="text-sm font-semibold mt-1">{driver.license_plate}</p>
        </div>
        
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => window.open(`tel:${driver.phone}`, '_blank')}>
            <Phone className="h-4 w-4" />
          </Button>
          
          <Button size="icon" variant="outline" onClick={() => onContactDriver("Bonjour, je suis votre passager.")}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
