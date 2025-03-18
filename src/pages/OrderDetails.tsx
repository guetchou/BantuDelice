
import { useParams } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import OrderTracking from '@/components/orders/OrderTracking';
import OrderProgress from '@/components/orders/OrderProgress';
import LiveTracking from '@/components/delivery/LiveTracking';
import DeliveryAssignment from '@/components/delivery/DeliveryAssignment';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrders();
  const [restaurantLocation, setRestaurantLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    if (orderId) {
      // Fetch restaurant location for the delivery tracking
      const fetchRestaurantLocation = async () => {
        const { data: order } = await supabase
          .from('orders')
          .select('restaurant_id')
          .eq('id', orderId)
          .single();
          
        if (order) {
          const { data: restaurant } = await supabase
            .from('restaurants')
            .select('latitude, longitude')
            .eq('id', order.restaurant_id)
            .single();
            
          if (restaurant) {
            setRestaurantLocation({
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0
            });
          }
        }
      };
      
      fetchRestaurantLocation();
    }
  }, [orderId]);

  if (!orderId) {
    return <div>Commande non trouvée</div>;
  }

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Détails de la commande #{order.id.slice(0, 8)}</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Statut de la commande</h2>
        <OrderProgress status={order.status} orderId={orderId} />
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Status:</p>
              <Badge>{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Total:</p>
              <p className="font-medium">{order.total_amount.toLocaleString()} XAF</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Adresse:</p>
              <p className="text-right max-w-[200px]">{order.delivery_address}</p>
            </div>
            {order.delivery_instructions && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <p className="font-medium mb-1">Instructions:</p>
                <p>{order.delivery_instructions}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Composant de suivi en temps réel */}
        <OrderTracking orderId={orderId} />
      </div>

      {/* Assignation de livreur si nécessaire */}
      {order.status === 'prepared' && order.delivery_status !== 'assigned' && restaurantLocation && (
        <DeliveryAssignment 
          orderId={orderId}
          restaurantLocation={restaurantLocation}
          deliveryAddress={order.delivery_address || ''}
        />
      )}

      {/* Carte de suivi de livraison */}
      <LiveTracking orderId={orderId} />
    </div>
  );
}
