import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import MenuItemCustomization from "@/components/menu/MenuItemCustomization";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import MenuList from "@/components/menu/MenuList";
import OrderConfirmation from "@/components/restaurant/OrderConfirmation";
import DeliveryStatus from "@/components/restaurant/DeliveryStatus";
import { useRestaurant } from "@/components/restaurant/useRestaurant";
import { MenuItem } from "@/components/menu/types";

const RestaurantMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('');

  const { data: restaurant, isLoading } = useRestaurant(restaurantId);

  const handlePaymentComplete = async () => {
    try {
      if (!restaurantId) throw new Error('Restaurant ID is required');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour passer une commande",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from('orders')
        .insert([
          {
            restaurant_id: restaurantId,
            user_id: session.user.id,
            status: 'pending',
            payment_status: 'completed',
            delivery_address: "Address to be implemented",
          }
        ]);

      if (error) throw error;

      setShowPaymentModal(false);
      setShowDeliveryMap(true);
      setDeliveryStatus('preparing');
      
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès",
      });
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
    <CartProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <RestaurantHeader 
            name={restaurant.name}
            address={restaurant.address}
            coordinates={[restaurant.longitude, restaurant.latitude]}
          />
          <CartDrawer />
        </div>

        <MenuList />

        <MenuItemCustomization
          item={selectedItem!}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        <OrderConfirmation 
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          onPaymentComplete={handlePaymentComplete}
        />

        <DeliveryStatus 
          show={showDeliveryMap}
          status={deliveryStatus}
          restaurant={restaurant}
        />
      </div>
    </CartProvider>
  );
};

export default RestaurantMenu;