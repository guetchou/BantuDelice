
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Clock, MapPin, Users, CreditCard, Calendar, Repeat } from "lucide-react";
import { RidesharingTrip } from '@/types/ridesharing';

interface RecurringBookingModalProps {
  trip: RidesharingTrip;
  driverName: string;
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: any) => Promise<void>;
  isLoading?: boolean;
  selectedDays?: string[];
}

const RecurringBookingModal: React.FC<RecurringBookingModalProps> = ({
  trip,
  driverName,
  isOpen,
  onClose,
  onBook,
  isLoading = false,
  selectedDays = []
}) => {
  const [seatsCount, setSeatsCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [bookingDays, setBookingDays] = useState<string[]>(
    selectedDays.length > 0 ? selectedDays : trip.recurrence_pattern?.days_of_week || []
  );
  
  const totalPricePerDay = trip.price_per_seat * seatsCount;
  
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };
  
  const handleDaySelect = (day: string, checked: boolean) => {
    if (checked) {
      setBookingDays(prev => [...prev, day]);
    } else {
      setBookingDays(prev => prev.filter(d => d !== day));
    }
  };
  
  const handleBook = () => {
    const bookingData = {
      trip_id: trip.id,
      seats_booked: seatsCount,
      special_requests: specialRequests,
      payment_method: paymentMethod,
      booking_days: bookingDays,
      auto_confirm: autoConfirm,
      start_date: trip.recurrence_pattern?.start_date
    };
    
    onBook(bookingData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Repeat className="h-5 w-5 mr-2" />
            Réserver un trajet régulier
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de réserver un trajet régulier avec {driverName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Trip summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Départ</p>
                <p className="font-medium">{trip.origin_address}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-destructive mr-2 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Arrivée</p>
                <p className="font-medium">{trip.destination_address}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <p>Départ à {trip.departure_time}</p>
            </div>
          </div>
          
          {/* Select days */}
          <div className="space-y-2">
            <Label>Jours de la semaine</Label>
            <p className="text-sm text-gray-500 mb-2">
              Sélectionnez les jours où vous souhaitez réserver ce trajet
            </p>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => {
                const isAvailable = trip.recurrence_pattern?.days_of_week?.includes(day);
                const isSelected = bookingDays.includes(day);
                
                return (
                  <div 
                    key={day}
                    className={`
                      flex flex-col items-center justify-center rounded-md p-2 border
                      ${!isAvailable ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 
                        isSelected ? 'bg-primary/10 border-primary' : 
                        'cursor-pointer hover:bg-gray-50'}
                    `}
                  >
                    <span className="text-xs">{dayLabels[day as keyof typeof dayLabels].substring(0, 3)}</span>
                    <Checkbox 
                      disabled={!isAvailable}
                      checked={isSelected}
                      className="mt-1"
                      onCheckedChange={(checked) => 
                        handleDaySelect(day, checked as boolean)
                      }
                    />
                  </div>
                );
              })}
            </div>
            {bookingDays.length === 0 && (
              <p className="text-sm text-red-500">Sélectionnez au moins un jour</p>
            )}
          </div>
          
          {/* Number of seats */}
          <div className="space-y-2">
            <Label htmlFor="seats-count">Nombre de places</Label>
            <div className="flex">
              <Button
                type="button"
                variant="outline"
                className="rounded-r-none"
                onClick={() => setSeatsCount(Math.max(1, seatsCount - 1))}
                disabled={seatsCount <= 1}
              >
                -
              </Button>
              <Input
                id="seats-count"
                type="number"
                min="1"
                max={trip.available_seats}
                value={seatsCount}
                onChange={(e) => setSeatsCount(Math.min(trip.available_seats, Math.max(1, parseInt(e.target.value) || 1)))}
                className="text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none"
                onClick={() => setSeatsCount(Math.min(trip.available_seats, seatsCount + 1))}
                disabled={seatsCount >= trip.available_seats}
              >
                +
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {trip.available_seats} places disponibles
            </p>
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
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet">Wallet Covoiturage</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Auto confirm */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="auto_confirm" 
              checked={autoConfirm}
              onCheckedChange={(checked) => setAutoConfirm(!!checked)}
            />
            <Label htmlFor="auto_confirm">
              Confirmer automatiquement mes réservations
            </Label>
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
              <p className="text-sm text-muted-foreground">Prix par jour</p>
              <p className="text-2xl font-bold">{totalPricePerDay.toLocaleString()} FCFA</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>{trip.price_per_seat.toLocaleString()} FCFA × {seatsCount} place{seatsCount > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-amber-50 rounded-md text-amber-700">
            <Calendar className="h-5 w-5 mr-2" />
            <p className="text-sm">
              Vous serez facturé {totalPricePerDay.toLocaleString()} FCFA pour chaque jour de trajet
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button 
            onClick={handleBook} 
            disabled={isLoading || bookingDays.length === 0}
          >
            Confirmer la réservation
            {isLoading && <span className="ml-2 animate-spin">⏳</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringBookingModal;
