
import React from 'react';
import DeliveryRating from '@/components/delivery/DeliveryRating';

interface RestaurantRatingTabProps {
  orderId: string;
  restaurantId: string;
  hasRated: boolean;
  onRatingSubmitted: () => void;
}

const RestaurantRatingTab = ({ 
  orderId, 
  restaurantId, 
  hasRated, 
  onRatingSubmitted 
}: RestaurantRatingTabProps) => {
  return (
    <>
      {hasRated ? (
        <div className="text-center py-6">
          <p className="text-green-600 font-medium">
            Merci d'avoir évalué le restaurant !
          </p>
        </div>
      ) : (
        <DeliveryRating 
          orderId={orderId} 
          restaurantId={restaurantId}
          onRatingSubmitted={onRatingSubmitted}
        />
      )}
    </>
  );
};

export default RestaurantRatingTab;
