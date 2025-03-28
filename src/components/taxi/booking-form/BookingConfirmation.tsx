
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Car, MapPin, Clock, Info } from 'lucide-react';

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
  const navigate = useNavigate();
  
  const handleViewRide = () => {
    navigate(`/taxi/ride/${rideId}`);
  };
  
  const handleBookAnother = () => {
    navigate(`/taxi/booking`, { replace: true });
    window.location.reload(); // Simple solution to reset the form
  };
  
  const estimatedArrival = (() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 7);
    return now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  })();
  
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Votre chauffeur est en route. Vous pouvez suivre votre course en temps réel.
      </p>
      
      <div className="w-full max-w-md bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-4 mb-4">
          <Car className="h-5 w-5 text-gray-500 mt-0.5" />
          <div className="flex-1 text-left">
            <p className="text-sm text-gray-500">Numéro de réservation</p>
            <p className="font-medium">{rideId.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4 mb-4">
          <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
          <div className="flex-1 text-left">
            <p className="text-sm text-gray-500">Départ</p>
            <p className="font-medium">{pickupAddress}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4 mb-4">
          <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
          <div className="flex-1 text-left">
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-medium">{destinationAddress}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
          <div className="flex-1 text-left">
            <p className="text-sm text-gray-500">Arrivée estimée du chauffeur</p>
            <p className="font-medium">{estimatedArrival}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleBookAnother}
        >
          Nouvelle réservation
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={handleViewRide}
        >
          Suivre ma course
        </Button>
      </div>
      
      <div className="mt-8 flex items-start gap-2 bg-blue-50 p-3 rounded-md text-sm text-blue-800 max-w-md">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-left">
          Vous recevrez une notification lorsque votre chauffeur sera proche.
          Assurez-vous d'être au point de rendez-vous à l'heure prévue.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
