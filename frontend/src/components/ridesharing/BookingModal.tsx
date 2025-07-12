
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Clock, CreditCard, Car, Calendar } from "lucide-react";
import { RidesharingTrip } from '@/types/ridesharing';

interface BookingModalProps {
  trip: RidesharingTrip;
  driverName: string;
  isOpen: boolean;
  onClose: () => void;
  onBook: (seatsCount: number, specialRequests?: string, paymentMethod?: string) => void;
  isLoading?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  trip,
  driverName,
  isOpen,
  onClose,
  onBook,
  isLoading = false
}) => {
  const [seatsCount, setSeatsCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  
  const handleBook = () => {
    onBook(seatsCount, specialRequests, paymentMethod);
  };
  
  const totalPrice = trip.price_per_seat * seatsCount;
  const departureDate = parseISO(trip.departure_date);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Réserver un trajet</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de réserver un trajet avec {driverName}
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
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <p>{format(departureDate, "EEEE d MMMM yyyy", { locale: fr })}</p>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <p>Départ à {trip.departure_time}</p>
            </div>
            
            <div className="flex items-center">
              <Car className="h-5 w-5 text-muted-foreground mr-2" />
              <p>{trip.vehicle_model}{trip.vehicle_color ? ` (${trip.vehicle_color})` : ''}</p>
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
              <p className="text-sm text-muted-foreground">Prix total</p>
              <p className="text-2xl font-bold">{totalPrice.toLocaleString()} FCFA</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4 mr-1" />
              <span>{trip.price_per_seat.toLocaleString()} FCFA × {seatsCount} place{seatsCount > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleBook} disabled={isLoading}>
            Confirmer la réservation
            {isLoading && <span className="ml-2 animate-spin">⏳</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
