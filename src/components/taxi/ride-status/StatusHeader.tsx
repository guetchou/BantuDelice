
import React from 'react';
import { TaxiRideStatus } from '@/types/taxi';
import { CheckCircle, Clock, MapPin, Navigation, Ban, Car, Flag } from 'lucide-react';

interface StatusHeaderProps {
  rideId: string;
  status: TaxiRideStatus;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({ rideId, status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          title: 'En attente',
          description: 'Recherche d\'un chauffeur',
          icon: <Clock className="h-5 w-5 text-yellow-500" />
        };
      case 'driver_assigned':
      case 'accepted':
        return {
          title: 'Chauffeur attribué',
          description: 'Un chauffeur a accepté votre course',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        };
      case 'driver_en_route':
        return {
          title: 'En approche',
          description: 'Le chauffeur se dirige vers vous',
          icon: <Navigation className="h-5 w-5 text-blue-500" />
        };
      case 'driver_arrived':
        return {
          title: 'Chauffeur arrivé',
          description: 'Votre chauffeur vous attend',
          icon: <MapPin className="h-5 w-5 text-green-500" />
        };
      case 'ride_in_progress':
      case 'in_progress':
        return {
          title: 'En cours',
          description: 'Course en cours',
          icon: <Car className="h-5 w-5 text-blue-500" />
        };
      case 'arrived_at_destination':
        return {
          title: 'Arrivé',
          description: 'Arrivé à destination',
          icon: <Flag className="h-5 w-5 text-green-500" />
        };
      case 'completed':
        return {
          title: 'Terminée',
          description: 'Course terminée avec succès',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        };
      case 'cancelled':
        return {
          title: 'Annulée',
          description: 'Course annulée',
          icon: <Ban className="h-5 w-5 text-red-500" />
        };
      case 'rejected':
        return {
          title: 'Rejetée',
          description: 'Aucun chauffeur disponible',
          icon: <Ban className="h-5 w-5 text-red-500" />
        };
      default:
        return {
          title: 'État inconnu',
          description: 'Statut de la course inconnu',
          icon: <Clock className="h-5 w-5 text-gray-500" />
        };
    }
  };

  const { title, description, icon } = getStatusInfo();

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        {icon}
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
