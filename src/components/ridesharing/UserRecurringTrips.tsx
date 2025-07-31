import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RidesharingTrip, RidesharingRecurringBooking } from '@/types/ridesharing';
import { MapPin, Clock, Users, CreditCard, Pause, Play, X, Eye } from "lucide-react";

// Define RecurrencePattern type if it's not already defined in the types
type RecurrencePattern = {
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  days_of_week?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  start_date: string;
  end_date?: string;
  auto_accept_riders?: boolean;
};

interface UserRecurringTripsProps {
  recurringTrips: RidesharingTrip[];
  recurringBookings: RidesharingRecurringBooking[];
  onEditTrip: (tripId: string) => void;
  onPauseTrip: (tripId: string) => void;
  onResumeTrip: (tripId: string) => void;
  onCancelTrip: (tripId: string) => void;
  onViewDetails: (tripId: string) => void;
}

const UserRecurringTrips: React.FC<UserRecurringTripsProps> = ({
  recurringTrips,
  recurringBookings,
  onEditTrip,
  onPauseTrip,
  onResumeTrip,
  onCancelTrip,
  onViewDetails
}) => {
  const getRecurrenceText = (pattern: RecurrencePattern) => {
    if (pattern.frequency === 'daily') return 'Tous les jours';
    if (pattern.frequency === 'weekdays') return 'Du lundi au vendredi';
    if (pattern.frequency === 'weekly') {
      const dayMap: Record<string, string> = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
      };
      return pattern.days_of_week?.map(day => dayMap[day]).join(', ') || '';
    }
    return 'Personnalisé';
  };
  
  return (
    <div className="space-y-4">
      {recurringTrips.length > 0 ? (
        recurringTrips.map(trip => {
          const booking = recurringBookings.find(b => b.trip_id === trip.id);
          
          return (
            <Card key={trip.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={trip.status === 'active' ? 'default' : 'destructive'}>
                        {trip.status === 'active' ? 'Actif' : trip.status === 'completed' ? 'Terminé' : 'Annulé'}
                      </Badge>
                      {trip.is_recurring && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          Récurrent
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        ID: {trip.id}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                          <Clock className="h-5 w-5 text-gray-500 mr-2" />
                          {trip.recurrence_pattern && (
                            <span>
                              {getRecurrenceText(trip.recurrence_pattern)} à {trip.departure_time}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center mb-1">
                          <Users className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{trip.available_seats} place(s) disponible(s)</span>
                        </div>
                        
                        <div className="flex items-center mb-1">
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
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(trip.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      
                      {trip.status === 'active' && (
                        <>
                          {booking?.status === 'active' ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onPauseTrip(trip.id)}
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Suspendre
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onResumeTrip(trip.id)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Reprendre
                            </Button>
                          )}
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onCancelTrip(trip.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <h3 className="text-xl font-medium mb-2">Aucun trajet récurrent trouvé</h3>
            <p className="text-gray-500 mb-4">
              Vous n'avez pas encore créé de trajets récurrents.
            </p>
            <Button>Créer un trajet</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserRecurringTrips;
