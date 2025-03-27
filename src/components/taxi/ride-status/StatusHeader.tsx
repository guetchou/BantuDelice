
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaxiRideStatus } from '@/types/taxi';

interface StatusHeaderProps {
  rideId: string;
  status: TaxiRideStatus;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({ rideId, status }) => {
  const getStatusInfo = (status: TaxiRideStatus) => {
    switch (status) {
      case 'pending':
        return { badge: 'En attente', variant: 'outline' };
      case 'driver_assigned':
        return { badge: 'Accepté', variant: 'outline' };
      case 'driver_en_route':
        return { badge: 'En route', variant: 'outline' };
      case 'driver_arrived':
        return { badge: 'Arrivé', variant: 'outline' };
      case 'ride_in_progress':
        return { badge: 'En cours', variant: 'outline' };
      case 'arrived_at_destination':
        return { badge: 'Arrivé', variant: 'outline' };
      case 'completed':
        return { badge: 'Terminé', variant: 'outline' };
      case 'cancelled':
        return { badge: 'Annulé', variant: 'destructive' };
      case 'rejected':
        return { badge: 'Rejeté', variant: 'destructive' };
      default:
        return { badge: 'Inconnu', variant: 'outline' };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-lg">Suivi de votre course</CardTitle>
      <Badge variant={statusInfo.variant === 'destructive' ? 'destructive' : 'outline'} className="uppercase">
        {statusInfo.badge}
      </Badge>
    </div>
  );
};
