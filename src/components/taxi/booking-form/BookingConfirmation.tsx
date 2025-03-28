
import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  const viewRideDetails = () => {
    navigate(`/taxi/ride/${rideId}`);
  };
  
  return (
    <Card className="bg-white border-green-100 shadow-lg animate-in fade-in-50 zoom-in-95 duration-300">
      <CardHeader className="pb-2 bg-green-50 border-b border-green-100">
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Réservation confirmée
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm text-green-700 font-medium">
              Votre course a été réservée avec succès!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Référence: {rideId.substring(0, 8)}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <div className="h-12 w-0.5 bg-gray-200 mx-auto"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Départ</p>
                <p className="font-medium">{pickupAddress}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium">{destinationAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={viewRideDetails} 
          className="w-full"
        >
          Suivre ma course
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
