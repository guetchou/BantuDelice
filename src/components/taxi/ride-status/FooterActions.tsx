
import React from 'react';
import { Button } from "@/components/ui/button";
import { TaxiRideStatus } from '@/types/taxi';
import { Ban, Star, CreditCard } from "lucide-react";
import { rideStateMachine } from '@/utils/rideStateMachine';

interface FooterActionsProps {
  status: TaxiRideStatus;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  onCancelRide: () => void;
  onOpenRating: () => void;
  isCancelling: boolean;
}

export const FooterActions: React.FC<FooterActionsProps> = ({
  status,
  paymentStatus,
  onCancelRide,
  onOpenRating,
  isCancelling
}) => {
  const rideState = rideStateMachine[status];

  return (
    <div className="flex flex-col space-y-3 pt-0">
      {status === 'completed' && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onOpenRating}
        >
          <Star className="h-4 w-4 mr-2" />
          Évaluer cette course
        </Button>
      )}
      
      {status === 'completed' && paymentStatus !== 'paid' && (
        <Button className="w-full">
          <CreditCard className="h-4 w-4 mr-2" />
          Payer maintenant
        </Button>
      )}
      
      {rideState.canCancel && (
        <Button 
          variant="outline" 
          className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={onCancelRide}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></span>
              Annulation...
            </span>
          ) : (
            <>
              <Ban className="h-4 w-4 mr-2" />
              Annuler la course
            </>
          )}
        </Button>
      )}
    </div>
  );
};
