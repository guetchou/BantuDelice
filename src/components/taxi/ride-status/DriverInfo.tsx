
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MessageCircle, Star, Car } from "lucide-react";
import { TaxiDriver } from '@/types/taxi';

interface DriverInfoProps {
  driver: TaxiDriver;
  onContactDriver: () => void;
}

export const DriverInfo = ({ driver, onContactDriver }: DriverInfoProps) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
      <h4 className="font-medium">Votre chauffeur</h4>
      
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={driver.profile_image} alt={driver.name} />
          <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <p className="font-medium">{driver.name}</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-muted-foreground">{driver.rating}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = `tel:+242061234567`}
          >
            <Phone className="h-3 w-3" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={onContactDriver}
          >
            <MessageCircle className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Car className="h-3 w-3" />
        <span>{driver.vehicle_model} - {driver.license_plate}</span>
      </div>
    </div>
  );
};
