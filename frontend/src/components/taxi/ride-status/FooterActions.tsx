
import React from 'react';
import { Button } from "@/components/ui/button";
import { Ban, Star, CreditCard } from "lucide-react";

interface FooterActionsProps {
  status: string;
  paymentStatus?: string;
  onCancelRide: () => Promise<void>;
  onOpenRating: () => void;
  isCancelling: boolean;
}

export const FooterActions = ({ 
  status, 
  paymentStatus, 
  onCancelRide, 
  onOpenRating, 
  isCancelling 
}: FooterActionsProps) => {
  if (status === 'completed') {
    return (
      <div className="flex gap-2 w-full">
        <Button 
          onClick={onOpenRating}
          className="flex-1"
        >
          <Star className="h-4 w-4 mr-2" />
          Évaluer le trajet
        </Button>
        
        {paymentStatus === 'pending' && (
          <Button variant="outline" className="flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            Payer
          </Button>
        )}
      </div>
    );
  }

  if (status === 'pending' || status === 'accepted') {
    return (
      <Button
        variant="destructive"
        onClick={onCancelRide}
        disabled={isCancelling}
        className="w-full"
      >
        <Ban className="h-4 w-4 mr-2" />
        {isCancelling ? 'Annulation...' : 'Annuler la course'}
      </Button>
    );
  }

  return null;
};
