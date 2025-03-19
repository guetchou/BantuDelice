
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard, 
  User, 
  Star, 
  Car, 
  Phone, 
  Repeat, 
  CheckCircle2 
} from "lucide-react";
import { RidesharingTrip } from '@/types/ridesharing';

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
  const [selectedDays, setSelectedDays] = useState<string[]>(trip.recurrence_pattern?.days_of_week || []);
  
  const handleSelectDay = (day: string, checked: boolean) => {
    if (checked) {
      setSelectedDays(prev => [...prev, day]);
    } else {
      setSelectedDays(prev => prev.filter(d => d !== day));
    }
  };
  
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
  
  const getRecurrenceText = (pattern?: RecurrencePattern) => {
    if (!pattern) return "Non spécifié";
    
    if (pattern.frequency === 'daily') return 'Tous les jours';
    if (pattern.frequency === 'weekdays') return 'Du lundi au vendredi';
    
    const dayMap: Record<string, string> = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };
    
    return pattern.days_of_week?.map(day => dayMap[day]).join(', ') || 'Personnalisé';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Repeat className="h-5 w-5 mr-2" />
            Détails du trajet régulier
          </DialogTitle>
          <DialogDescription>
            Informations sur le trajet régulier de {driverName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Driver info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
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
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Trip details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Détails du trajet</h4>
                <div className="space-y-3">
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
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <p>Départ à {trip.departure_time}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <p>Arrivée estimée à {trip.estimated_arrival_time}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Récurrence & Détails</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <p>{getRecurrenceText(trip.recurrence_pattern)}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <p>{trip.available_seats} place(s) disponible(s)</p>
                  </div>
                  
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                    <p>{trip.price_per_seat.toLocaleString()} FCFA par personne</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-gray-500 mr-2" />
                    <p>{trip.vehicle_model || "Non spécifié"} {trip.vehicle_color ? `(${trip.vehicle_color})` : ""}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Préférences</h4>
              <div className="flex flex-wrap gap-2">
                {getPreferenceBadges()}
              </div>
            </div>
            
            {trip.recurrence_pattern?.auto_accept_riders && (
              <div className="flex items-center p-3 bg-green-50 rounded-md text-green-700">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <p className="text-sm">Confirmation automatique - Les passagers sont acceptés sans validation du conducteur</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Sélectionnez les jours qui vous conviennent</h4>
              <div className="grid grid-cols-7 gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const dayLabel = {
                    monday: 'Lun',
                    tuesday: 'Mar',
                    wednesday: 'Mer',
                    thursday: 'Jeu',
                    friday: 'Ven',
                    saturday: 'Sam',
                    sunday: 'Dim'
                  };
                  const isAvailable = trip.recurrence_pattern?.days_of_week?.includes(day);
                  const isSelected = selectedDays.includes(day);
                  
                  return (
                    <div 
                      key={day}
                      className={`
                        flex flex-col items-center justify-center rounded-md p-2 border
                        ${!isAvailable ? 'bg-gray-100 opacity-50 cursor-not-allowed' : isSelected ? 'bg-primary/10 border-primary' : 'cursor-pointer hover:bg-gray-50'}
                      `}
                    >
                      <span>{dayLabel[day as keyof typeof dayLabel]}</span>
                      <Checkbox 
                        disabled={!isAvailable}
                        checked={isSelected}
                        className="mt-1"
                        onCheckedChange={(checked) => 
                          handleSelectDay(day, checked as boolean)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => onBookTrip(trip)}>
            Réserver ce trajet régulier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringTripDetails;
