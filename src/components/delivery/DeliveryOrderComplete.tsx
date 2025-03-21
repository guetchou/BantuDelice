
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, User } from 'lucide-react';
import { useDeliveryOrderRating } from '@/hooks/delivery/useDeliveryOrderRating';
import RestaurantRatingTab from './ratings/RestaurantRatingTab';
import DriverRatingTab from './ratings/DriverRatingTab';

interface DeliveryOrderCompleteProps {
  orderId: string;
  restaurantId: string;
}

const DeliveryOrderComplete = ({ orderId, restaurantId }: DeliveryOrderCompleteProps) => {
  const {
    deliveryRequest,
    loading,
    hasRatedDelivery,
    hasRatedDriver,
    tablesExist,
    handleRatingSubmitted,
    handleDriverRatingSubmitted
  } = useDeliveryOrderRating(orderId);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Chargement des informations...</p>
        </CardContent>
      </Card>
    );
  }

  // Si pas de livraison trouvée
  if (!deliveryRequest && tablesExist.delivery_requests) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluez votre expérience</CardTitle>
        <CardDescription>
          Votre avis nous aide à améliorer nos services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="restaurant">
          <TabsList className="w-full">
            <TabsTrigger value="restaurant" className="flex-1">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Restaurant
            </TabsTrigger>
            {deliveryRequest && deliveryRequest.assigned_driver_id && tablesExist.delivery_driver_ratings && (
              <TabsTrigger value="driver" className="flex-1">
                <User className="w-4 h-4 mr-2" />
                Livreur
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="restaurant" className="pt-4">
            <RestaurantRatingTab
              orderId={orderId}
              restaurantId={restaurantId}
              hasRated={hasRatedDelivery}
              onRatingSubmitted={handleRatingSubmitted}
            />
          </TabsContent>
          
          {deliveryRequest && deliveryRequest.assigned_driver_id && tablesExist.delivery_driver_ratings && (
            <TabsContent value="driver" className="pt-4">
              <DriverRatingTab
                deliveryId={deliveryRequest.id}
                orderId={orderId}
                driverId={deliveryRequest.assigned_driver_id}
                hasRated={hasRatedDriver}
                onRatingSubmitted={handleDriverRatingSubmitted}
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeliveryOrderComplete;
