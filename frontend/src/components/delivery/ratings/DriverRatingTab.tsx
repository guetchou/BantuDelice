
import React from 'react';
import DeliveryDriverRating from '@/components/delivery/DeliveryDriverRating';

interface DriverRatingTabProps {
  deliveryId: string;
  orderId: string;
  driverId: string;
  hasRated: boolean;
  onRatingSubmitted: () => void;
}

const DriverRatingTab = ({ 
  deliveryId, 
  orderId, 
  driverId, 
  hasRated, 
  onRatingSubmitted 
}: DriverRatingTabProps) => {
  return (
    <>
      {hasRated ? (
        <div className="text-center py-6">
          <p className="text-green-600 font-medium">
            Merci d'avoir évalué le livreur !
          </p>
        </div>
      ) : (
        <DeliveryDriverRating
          deliveryId={deliveryId}
          orderId={orderId}
          driverId={driverId}
          onRatingSubmitted={onRatingSubmitted}
        />
      )}
    </>
  );
};

export default DriverRatingTab;
