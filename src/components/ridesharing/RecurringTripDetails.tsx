
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RidesharingTrip } from '@/types/ridesharing';
import { MapPin, Calendar, Clock, User, Star, Users, CreditCard, Car, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define RecurrencePattern type if it's not already defined in the types
type RecurrencePattern = {
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  days_of_week?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  start_date: string;
  end_date?: string;
  auto_accept_riders?: boolean;
};

interface RecurringTripDetailsProps {
  trip: RidesharingTrip;
  driverName: string;
  driverAvatar?: string;
  driverRating: number;
  totalTrips: number;
  isOpen: boolean;
  onClose: () => void;
  onBookTrip: (trip: RidesharingTrip) => void;
}

const RecurringTripDetails: React.FC<RecurringTripDetailsProps> = ({
  trip,
  driverName,
  driverAvatar,
  driverRating,
  totalTrips,
  isOpen,
  onClose,
  onBookTrip
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

  const handleBookTrip = () => {
    onBookTrip(trip);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du trajet régulier</DialogTitle>
          <DialogDescription>
            Trajet proposé par {driverName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Driver info */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              {driverAvatar ? (
                <img src={driverAvatar} alt={driverName} className="w-full h-full object-cover" />
              ) : (
                <div className="bg-primary/20 w-full h-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">{driverName}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{driverRating.toFixed(1)}</span>
                <span className="mx-2">•</span>
                <span>{totalTrips} trajets</span>
              </div>
            </div>
          </div>

          {/* Route details */}
          <div className="space-y-4 border-t border-b py-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Départ</p>
                <p className="font-medium">{trip.origin_address}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Arrivée</p>
                <p className="font-medium">{trip.destination_address}</p>
              </div>
            </div>
          </div>

          {/* Trip schedule */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Horaires</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Jours</p>
                  <p>{trip.recurrence_pattern && getRecurrenceText(trip.recurrence_pattern)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Heure de départ</p>
                  <p>{trip.departure_time}</p>
                </div>
              </div>
            </div>
            
            {trip.estimated_arrival_time && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Arrivée estimée</p>
                  <p>{trip.estimated_arrival_time}</p>
                </div>
              </div>
            )}
          </div>

          {/* Trip details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Détails</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Places disponibles</p>
                  <p>{trip.available_seats} place(s)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Prix par personne</p>
                  <p className="font-medium">{trip.price_per_seat.toLocaleString()} FCFA</p>
                </div>
              </div>
              
              {trip.vehicle_model && (
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Véhicule</p>
                    <p>{trip.vehicle_model} {trip.vehicle_color && `(${trip.vehicle_color})`}</p>
                  </div>
                </div>
              )}
              
              {trip.license_plate && (
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Plaque d'immatriculation</p>
                    <p>{trip.license_plate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Préférences</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                {trip.preferences.smoking_allowed ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Fumeur {trip.preferences.smoking_allowed ? 'autorisé' : 'non autorisé'}</span>
              </div>
              
              <div className="flex items-center">
                {trip.preferences.pets_allowed ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Animaux {trip.preferences.pets_allowed ? 'autorisés' : 'non autorisés'}</span>
              </div>
              
              <div className="flex items-center">
                {trip.preferences.music_allowed ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Musique {trip.preferences.music_allowed ? 'autorisée' : 'non autorisée'}</span>
              </div>
              
              <div className="flex items-center">
                {trip.preferences.air_conditioning ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Climatisation {trip.preferences.air_conditioning ? 'disponible' : 'non disponible'}</span>
              </div>
              
              <div className="flex items-center">
                {trip.preferences.luggage_allowed ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Bagages {trip.preferences.luggage_allowed ? 'autorisés' : 'non autorisés'}</span>
              </div>
              
              {trip.preferences.chatty_driver !== undefined && (
                <div className="flex items-center">
                  {trip.preferences.chatty_driver ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="text-sm">Conducteur {trip.preferences.chatty_driver ? 'bavard' : 'silencieux'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes or description if available */}
          {trip.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notes</h4>
              <p className="text-sm">{trip.description}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Fermer
          </Button>
          <Button 
            onClick={handleBookTrip}
            disabled={trip.status !== 'active' || trip.available_seats < 1}
          >
            Réserver ce trajet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringTripDetails;
