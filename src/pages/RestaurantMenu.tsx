import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MobilePayment from "@/components/MobilePayment";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import MenuItemCard from "@/components/restaurant/MenuItemCard";
import CartSummary from "@/components/restaurant/CartSummary";
import DeliveryMap from "@/components/DeliveryMap";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import MenuItemCustomization from "@/components/menu/MenuItemCustomization";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
  image_url: string | null;
}

const RestaurantMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeliveryMap, setShowDeliveryMap] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('');

  // Fetch restaurant details
  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Restaurant not found');
      return data as Restaurant;
    },
    enabled: !!restaurantId
  });

  // Fetch menu items
  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID is required');

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('available', true);
      
      if (error) throw error;
      return (data || []) as MenuItem[];
    },
    enabled: !!restaurantId
  });

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
    toast({
      title: "Article ajouté",
      description: `${item.name} a été ajouté au panier`,
    });
  };

  const handlePaymentComplete = async () => {
    try {
      if (!restaurantId) throw new Error('Restaurant ID is required');

      // Get the current user's session
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
            user_id: session.user.id, // Add the user_id
            total_amount: cart.reduce((total, item) => total + item.price, 0),
            status: 'pending',
            payment_status: 'completed',
            delivery_address: "Address to be implemented", // TODO: Add address input
          }
        ]);

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }

      setShowPaymentModal(false);
      setShowDeliveryMap(true);
      setDeliveryStatus('preparing');
      setCart([]);
      
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

  if (!restaurant) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onAddToCart={() => setSelectedItem(item)}
            />
          ))}
        </div>

        <MenuItemCustomization
          item={selectedItem!}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paiement mobile</DialogTitle>
            </DialogHeader>
            <MobilePayment 
              amount={cart.reduce((total, item) => total + item.price, 0)} 
              onPaymentComplete={handlePaymentComplete}
            />
          </DialogContent>
        </Dialog>

        {showDeliveryMap && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Suivi de la livraison</h3>
            <div className="mb-4">
              <span className="text-sm font-medium">
                Statut: {deliveryStatus === 'preparing' ? 'En préparation' : 'En livraison'}
              </span>
            </div>
            <DeliveryMap 
              latitude={restaurant.latitude}
              longitude={restaurant.longitude}
            />
          </div>
        )}
      </div>
    </CartProvider>
  );
};

export default RestaurantMenu;
