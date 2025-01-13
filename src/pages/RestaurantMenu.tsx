import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MenuList from "@/components/menu/MenuList";
import CartDrawer from "@/components/cart/CartDrawer";
import OrderConfirmation from "@/components/restaurant/OrderConfirmation";
import DeliveryStatus from "@/components/restaurant/DeliveryStatus";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import { useRestaurant } from "@/components/restaurant/useRestaurant";
import { useToast } from "@/components/ui/use-toast";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('');
  const [orderAmount, setOrderAmount] = useState(0);

  const { data: restaurant, isLoading } = useRestaurant(restaurantId || '');

  useEffect(() => {
    const channel = supabase
      .channel('order-status')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'delivery_tracking',
        filter: `order_id=eq.${restaurantId}`
      }, payload => {
        setDeliveryStatus(payload.new.status);
        setShowDeliveryMap(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  const handlePaymentComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { error } = await supabase
        .from('orders')
        .insert({
          restaurant_id: restaurantId,
          user_id: session.user.id,
          status: 'pending',
          payment_status: 'completed',
          delivery_address: "Address to be implemented",
          total_amount: orderAmount
        });

      if (error) throw error;

      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès",
      });

      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !restaurant) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <RestaurantHeader 
          name={restaurant.name}
          address={restaurant.address}
          coordinates={[restaurant.longitude, restaurant.latitude]}
        />
        <CartDrawer onOrderAmount={setOrderAmount} />
      </div>

      <MenuList />

      <OrderConfirmation 
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onPaymentComplete={handlePaymentComplete}
        amount={orderAmount}
      />

      <DeliveryStatus 
        show={showDeliveryMap}
        status={deliveryStatus}
        restaurant={{
          latitude: restaurant.latitude,
          longitude: restaurant.longitude
        }}
      />
    </div>
  );
};

export default RestaurantMenu;