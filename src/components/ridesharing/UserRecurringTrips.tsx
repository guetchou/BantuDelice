
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Repeat, Calendar, Clock, MapPin, Users, CreditCard, MoreVertical, PauseCircle, PlayCircle, Settings } from "lucide-react";
import { RidesharingTrip, RidesharingRecurringBooking } from '@/types/ridesharing';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    if (pattern.days_of_week?.length) {
      const dayMap: Record<string, string> = {
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mer',
        thursday: 'Jeu',
        friday: 'Ven',
        saturday: 'Sam',
        sunday: 'Dim'
      };
      return pattern.days_of_week.map(day => dayMap[day]).join(', ');
    }
    return 'Personnalisé';
  };

  // Get booking status for a trip
  const getBookingForTrip = (tripId: string) => {
    return recurringBookings.find(booking => booking.trip_id === tripId);
  };

  // Render trips as driver
  const renderDriverTrips = () => {
    if (recurringTrips.length === 0) {
      return (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Repeat className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Aucun trajet régulier</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Vous n'avez pas encore créé de trajets réguliers. 
              Créez votre premier trajet régulier pour économiser du temps et de l'argent.
            </p>
            <Button className="mt-6">
              Créer un trajet régulier
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {recurringTrips.map((trip) => (
          <Card 
            key={trip.id} 
            className={`overflow-hidden hover:shadow-md transition-all ${
              trip.status === 'cancelled' ? 'bg-gray-50 opacity-75' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-primary/20 text-primary">Trajet récurrent</Badge>
                    <Badge variant={trip.status === 'active' ? 'default' : 'destructive'}>
                      {trip.status === 'active' ? 'Actif' : trip.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </Badge>
                    {trip.recurrence_pattern?.auto_accept_riders && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Acceptation auto
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Les passagers sont acceptés automatiquement</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
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
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{trip.recurrence_pattern && getRecurrenceText(trip.recurrence_pattern)}</span>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <Clock className="h-5 w-5 text-gray-500 mr-2" />
                        <span>Départ à {trip.departure_time}</span>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <Users className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{trip.available_seats} place(s) disponible(s)</span>
                      </div>
                      
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{trip.price_per_seat.toLocaleString()} FCFA par personne</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(trip.id)}>
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditTrip(trip.id)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {trip.status === 'active' ? (
                        <DropdownMenuItem onClick={() => onPauseTrip(trip.id)}>
                          <PauseCircle className="mr-2 h-4 w-4" />
                          Suspendre temporairement
                        </DropdownMenuItem>
                      ) : trip.status !== 'cancelled' && (
                        <DropdownMenuItem onClick={() => onResumeTrip(trip.id)}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Reprendre
                        </DropdownMenuItem>
                      )}
                      {trip.status !== 'cancelled' && (
                        <DropdownMenuItem 
                          onClick={() => onCancelTrip(trip.id)}
                          className="text-red-600"
                        >
                          Annuler définitivement
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render bookings as passenger
  const renderPassengerBookings = () => {
    if (recurringBookings.length === 0) {
      return (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Repeat className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Aucune réservation récurrente</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Vous n'avez pas encore réservé de trajets réguliers. 
              Recherchez et réservez un trajet régulier pour simplifier vos déplacements quotidiens.
            </p>
            <Button className="mt-6">
              Rechercher un trajet régulier
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {recurringBookings.map((booking) => {
          const trip = recurringTrips.find(t => t.id === booking.trip_id);
          if (!trip) return null;
          
          return (
            <Card 
              key={booking.id} 
              className={`overflow-hidden hover:shadow-md transition-all ${
                booking.status === 'cancelled' || trip.status === 'cancelled' ? 'bg-gray-50 opacity-75' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-primary/20 text-primary">Réservation récurrente</Badge>
                      <Badge variant={booking.status === 'active' ? 'default' : 'destructive'}>
                        {booking.status === 'active' 
                          ? 'Active' 
                          : booking.status === 'paused' 
                          ? 'Suspendue' 
                          : 'Annulée'}
                      </Badge>
                      {booking.auto_confirm && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Confirmation auto
                        </Badge>
                      )}
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
                          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                          <span>
                            {booking.booking_days.map(day => day.substring(0, 3)).join(', ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center mb-1">
                          <Clock className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Départ à {trip.departure_time}</span>
                        </div>
                        
                        <div className="flex items-center mb-1">
                          <Users className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{booking.seats_booked} place(s) réservée(s)</span>
                        </div>
                        
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                          <span>{(trip.price_per_seat * booking.seats_booked).toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(trip.id)}>
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {booking.status === 'active' ? (
                          <DropdownMenuItem onClick={() => onPauseTrip(booking.id)}>
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Suspendre temporairement
                          </DropdownMenuItem>
                        ) : booking.status !== 'cancelled' && (
                          <DropdownMenuItem onClick={() => onResumeTrip(booking.id)}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Reprendre
                          </DropdownMenuItem>
                        )}
                        {booking.status !== 'cancelled' && (
                          <DropdownMenuItem 
                            onClick={() => onCancelTrip(booking.id)}
                            className="text-red-600"
                          >
                            Annuler définitivement
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Mes trajets réguliers (conducteur)</h2>
        {renderDriverTrips()}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Mes réservations régulières (passager)</h2>
        {renderPassengerBookings()}
      </div>
    </div>
  );
};

export default UserRecurringTrips;
