
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Users, CreditCard, Star, Calendar } from "lucide-react";
import { RidesharingTrip } from '@/types/ridesharing';

interface TripCardProps {
  trip: RidesharingTrip;
  driverName: string;
  driverAvatar?: string;
  driverRating: number;
  totalTrips: number;
  onBookTrip: () => void;
  onViewDetails: () => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  driverName,
  driverAvatar,
  driverRating,
  totalTrips,
  onBookTrip,
  onViewDetails
}) => {
  const departureDate = parseISO(trip.departure_date);
  
  // Format preferences as badges
  const getPreferenceBadges = () => {
    const badges = [];
    
    if (!trip.preferences.smoking_allowed) {
      badges.push(<Badge key="non-smoking" className="bg-blue-500/20 text-blue-600 border-blue-500/30">Non-fumeur</Badge>);
    }
    
    if (trip.preferences.air_conditioning) {
      badges.push(<Badge key="ac" className="bg-teal-500/20 text-teal-600 border-teal-500/30">Climatisé</Badge>);
    }
    
    if (trip.preferences.music_allowed) {
      badges.push(<Badge key="music" className="bg-indigo-500/20 text-indigo-600 border-indigo-500/30">Musique</Badge>);
    }
    
    if (trip.preferences.pets_allowed) {
      badges.push(<Badge key="pets" className="bg-amber-500/20 text-amber-600 border-amber-500/30">Animaux autorisés</Badge>);
    }
    
    if (trip.preferences.luggage_allowed) {
      badges.push(<Badge key="luggage" className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Bagages autorisés</Badge>);
    }
    
    return badges;
  };
  
  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Driver info */}
          <div className="flex items-start">
            <Avatar className="h-16 w-16">
              <AvatarImage src={driverAvatar} />
              <AvatarFallback>{driverName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h3 className="text-lg font-medium">{driverName}</h3>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{driverRating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-2">({totalTrips} trajets)</span>
              </div>
              {trip.vehicle_model && (
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <span>{trip.vehicle_model}</span>
                  {trip.vehicle_color && <span className="ml-1">({trip.vehicle_color})</span>}
                </div>
              )}
            </div>
          </div>
          
          {/* Trip details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">Départ</p>
                  <p className="font-medium">{trip.origin_address}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{trip.departure_time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">Arrivée</p>
                  <p className="font-medium">{trip.destination_address}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{trip.estimated_arrival_time}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span>{format(departureDate, "EEEE d MMMM yyyy", { locale: fr })}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-gray-500 mr-2" />
                <span>{trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} disponible{trip.available_seats > 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                <span>{trip.price_per_seat.toLocaleString()} FCFA par personne</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {getPreferenceBadges()}
              </div>
            </div>
          </div>
          
          {/* Price and actions */}
          <div className="flex flex-col justify-between">
            <div className="text-2xl font-bold text-right">
              {trip.price_per_seat.toLocaleString()} FCFA
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <Button onClick={onBookTrip} size="sm">
                Réserver
              </Button>
              <Button onClick={onViewDetails} variant="outline" size="sm">
                Détails
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
