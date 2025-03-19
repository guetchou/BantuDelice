
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RidesharingTrip } from '@/types/ridesharing';
import { MapPin, Calendar, Clock, User, Star, Users, CreditCard } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const availableSeatsText = 
    trip.available_seats === 1 
      ? '1 place disponible' 
      : `${trip.available_seats} places disponibles`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={trip.status === 'active' ? 'default' : 'destructive'}>
                {trip.status === 'active' ? 'Actif' : trip.status === 'completed' ? 'Terminé' : 'Annulé'}
              </Badge>
              {/* Optional badges for trip attributes */}
              {trip.preferences.air_conditioning && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                  Climatisé
                </Badge>
              )}
              {!trip.preferences.smoking_allowed && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                  Non-fumeur
                </Badge>
              )}
            </div>
            
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mr-3">
                {driverAvatar ? (
                  <img src={driverAvatar} alt={driverName} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-primary/20 w-full h-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{driverName}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{driverRating.toFixed(1)}</span>
                  <span className="mx-1">•</span>
                  <span>{totalTrips} trajets</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Départ</p>
                    <p className="font-medium">{trip.origin_address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Arrivée</p>
                    <p className="font-medium">{trip.destination_address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{format(departureDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                </div>
                
                <div className="flex items-center mb-1">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Départ à {trip.departure_time}</span>
                </div>
                
                <div className="flex items-center mb-1">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{availableSeatsText}</span>
                </div>
                
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{trip.price_per_seat.toLocaleString()} FCFA par personne</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between mt-4 md:mt-0 md:ml-6">
            <p className="text-lg font-semibold">{trip.price_per_seat.toLocaleString()} FCFA</p>
            
            <div className="flex flex-col space-y-2 mt-2">
              <Button 
                onClick={onBookTrip}
                disabled={trip.status !== 'active' || trip.available_seats < 1}
              >
                Réserver
              </Button>
              
              <Button
                variant="outline"
                onClick={onViewDetails}
              >
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
