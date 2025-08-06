
import { useParams } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import OrderTracking from '@/components/orders/OrderTracking';
import OrderProgress from '@/components/orders/OrderProgress';
import LiveTracking from '@/components/delivery/LiveTracking';
import DeliveryAssignment from '@/components/delivery/DeliveryAssignment';
import { Card } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import apiService from '@/services/api';
import OrderHeader from '@/components/orders/OrderHeader';
import RestaurantClosed from '@/components/orders/RestaurantClosed';
import OrderSpecialInstructions from '@/components/orders/OrderSpecialInstructions';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrders();
  const [restaurantLocation, setRestaurantLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [restaurantInfo, setRestaurantInfo] = useState<{name: string, is_open: boolean} | null>(null);
  
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
            .select('latitude, longitude, name, is_open')
            .eq('id', order.restaurant_id)
            .single();
            
          if (restaurant) {
            setRestaurantLocation({
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0
            });
            setRestaurantInfo({
              name: restaurant.name,
              is_open: restaurant.is_open
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
      
      <OrderHeader orderId={orderId} restaurantName={restaurantInfo?.name} />
      
      {restaurantInfo && !restaurantInfo.is_open && (
        <RestaurantClosed restaurantName={restaurantInfo.name} />
      )}
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Statut de la commande</h2>
        <OrderProgress status={order.status} orderId={orderId} />
        
        <OrderSpecialInstructions 
          orderId={orderId} 
          status={order.status} 
          userId={order.user_id}
        />
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <OrderSummaryCard order={order} />

        {/* Composant de suivi en temps réel */}
        <OrderTracking orderId={orderId} />
      </div>

      {/* Assignation de livreur si nécessaire */}
      {order.status === 'prepared' && order.delivery_status !== 'assigned' && restaurantLocation && (
        <DeliveryAssignment restaurantId={order.restaurant_id} />
      )}

      {/* Carte de suivi de livraison */}
      <LiveTracking orderId={orderId} />
    </div>
  );
}
