
import React from 'react';
import { TaxiRide } from '@/types/taxi';
import { formatPrice } from '@/components/taxi/booking-form/bookingFormUtils';
import { formatCurrency } from '@/utils/formatters';

interface RideDetailsProps {
  ride: TaxiRide;
}

export const RideDetails: React.FC<RideDetailsProps> = ({ ride }) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-muted-foreground">Type de véhicule</p>
        <p className="font-medium capitalize">{ride.vehicle_type}</p>
      </div>
      
      <div>
        <p className="text-muted-foreground">Méthode de paiement</p>
        <p className="font-medium capitalize">{
          ride.payment_method === 'cash' 
            ? 'Espèces' 
            : ride.payment_method === 'card' 
              ? 'Carte' 
              : ride.payment_method === 'mobile_money'
                ? 'Mobile Money'
                : ride.payment_method
        }</p>
      </div>
      
      <div>
        <p className="text-muted-foreground">Prix estimé</p>
        <p className="font-medium">{formatCurrency(ride.estimated_price)}</p>
      </div>
      
      <div>
        <p className="text-muted-foreground">Heure de prise en charge</p>
        <p className="font-medium">{
          ride.pickup_time_type === 'now'
            ? 'Immédiat'
            : new Date(ride.pickup_time).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
        }</p>
      </div>
    </div>
  );
};
