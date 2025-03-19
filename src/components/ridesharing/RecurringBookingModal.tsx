
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RidesharingTrip } from '@/types/ridesharing';
import { CalendarDays, CreditCard, Loader2, Car } from "lucide-react";

interface RecurringBookingModalProps {
  trip: RidesharingTrip;
  driverName: string;
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: any) => void;
  isLoading?: boolean;
  selectedDays: string[];
}

const RecurringBookingModal: React.FC<RecurringBookingModalProps> = ({
  trip,
  driverName,
  isOpen,
  onClose,
  onBook,
  isLoading = false,
  selectedDays
}) => {
  const [seats, setSeats] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [days, setDays] = useState<{ id: string; label: string; checked: boolean }[]>([
    { id: "monday", label: "Lundi", checked: false },
    { id: "tuesday", label: "Mardi", checked: false },
    { id: "wednesday", label: "Mercredi", checked: false },
    { id: "thursday", label: "Jeudi", checked: false },
    { id: "friday", label: "Vendredi", checked: false },
    { id: "saturday", label: "Samedi", checked: false },
    { id: "sunday", label: "Dimanche", checked: false },
  ]);
  
  // Auto-select days if trip has recurrence pattern
  React.useEffect(() => {
    if (trip.recurrence_pattern?.days_of_week) {
      setDays(prevDays => prevDays.map(day => ({
        ...day,
        checked: trip.recurrence_pattern?.days_of_week?.includes(day.id as any) || false
      })));
    }
  }, [trip]);
  
  const handleDayToggle = (dayId: string, checked: boolean) => {
    setDays(prevDays => prevDays.map(day => 
      day.id === dayId ? { ...day, checked } : day
    ));
  };
  
  const handleSubmit = () => {
    const selectedDays = days.filter(day => day.checked).map(day => day.id);
    const bookingData = {
      seats,
      specialRequests,
      paymentMethod,
      tripId: trip.id,
      days: selectedDays,
      startDate: new Date().toISOString().split('T')[0], // current date as default start date
      autoConfirm: true
    };
    onBook(bookingData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Réserver un trajet régulier</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de réserver un trajet régulier avec {driverName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Trip summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Car className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">{trip.origin_address.split(',')[0]} → {trip.destination_address.split(',')[0]}</span>
              </div>
              <span className="text-sm font-medium">{trip.departure_time}</span>
            </div>
            
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">
                {trip.recurrence_pattern?.frequency === 'daily' 
                  ? 'Tous les jours'
                  : trip.recurrence_pattern?.frequency === 'weekdays'
                    ? 'Du lundi au vendredi'
                    : 'Jours spécifiques'}
              </span>
            </div>
          </div>
          
          {/* Number of seats */}
          <div className="space-y-2">
            <Label htmlFor="seats-count">Nombre de places</Label>
            <div className="flex">
              <Button
                type="button"
                variant="outline"
                className="rounded-r-none"
                onClick={() => setSeats(Math.max(1, seats - 1))}
                disabled={seats <= 1}
              >
                -
              </Button>
              <Input
                id="seats-count"
                type="number"
                min="1"
                max={trip.available_seats}
                value={seats}
                onChange={(e) => setSeats(Math.min(trip.available_seats, Math.max(1, parseInt(e.target.value) || 1)))}
                className="text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none"
                onClick={() => setSeats(Math.min(trip.available_seats, seats + 1))}
                disabled={seats >= trip.available_seats}
              >
                +
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {trip.available_seats} places disponibles
            </p>
          </div>
          
          {/* Days of the week */}
          <div className="space-y-3">
            <Label>Jours de réservation</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {days.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={day.id} 
                    checked={day.checked}
                    onCheckedChange={(checked) => handleDayToggle(day.id, checked as boolean)}
                  />
                  <Label htmlFor={day.id} className="cursor-pointer">{day.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Payment method */}
          <div className="space-y-2">
            <Label>Mode de paiement</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money">Mobile Money</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">En espèces</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Carte bancaire</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Special requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests">Demandes particulières (optionnel)</Label>
            <Textarea
              id="special-requests"
              placeholder="Lieu de rencontre précis, bagages, etc."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>
          
          {/* Total price */}
          <div className="flex justify-between items-center py-3 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Prix total par jour</p>
              <p className="text-2xl font-bold">{(trip.price_per_seat * seats).toLocaleString()} FCFA</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>{trip.price_per_seat.toLocaleString()} FCFA × {seats} place{seats > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || days.filter(d => d.checked).length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                Confirmer la réservation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringBookingModal;
