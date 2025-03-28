
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface BookingConfirmationProps {
  rideId: string;
  pickupAddress: string;
  destinationAddress: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  rideId,
  pickupAddress,
  destinationAddress
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Check className="text-green-500 w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2">
        Réservation confirmée !
      </h2>
      
      <p className="text-muted-foreground text-center mb-6">
        Votre taxi est en route pour venir vous chercher
      </p>
      
      <div className="w-full space-y-4 mb-6">
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Point de départ</p>
            <p className="font-medium">{pickupAddress}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 text-sm">
          <Navigation className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Destination</p>
            <p className="font-medium">{destinationAddress}</p>
          </div>
        </div>
      </div>
      
      <div className="w-full space-y-4">
        <Button asChild className="w-full bg-primary">
          <Link to={`/taxi/ride/${rideId}`}>
            Suivre votre course <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full">
          <Link to="/taxi">
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
