
import React from 'react';
import { Clock, CreditCard, Car } from "lucide-react";
import { TaxiRide } from '@/types/taxi';

interface RideDetailsProps {
  ride: TaxiRide;
}

export const RideDetails = ({ ride }: RideDetailsProps) => {
  const formatPrice = (price: number | undefined) => {
    if (!price) return 'N/A';
    return `${price.toLocaleString()} FCFA`;
  };

  const formatPaymentMethod = (method: string | undefined) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'credit_card': return 'Carte bancaire';
      case 'mobile_money': return 'Mobile Money';
      case 'wallet': return 'Portefeuille';
      default: return method || 'Non spécifié';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-muted-foreground">Heure de départ</p>
          <p className="font-medium">
            {ride.created_at ? new Date(ride.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-muted-foreground">Prix estimé</p>
          <p className="font-medium">{formatPrice(ride.estimated_price)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Car className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-muted-foreground">Type de véhicule</p>
          <p className="font-medium capitalize">{ride.vehicle_type || 'Standard'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-muted-foreground">Paiement</p>
          <p className="font-medium">{formatPaymentMethod(ride.payment_method)}</p>
        </div>
      </div>
    </div>
  );
};
