import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import MenuList from '@/components/menu/MenuList';
import CartSummary from '@/components/restaurant/CartSummary';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import OrderConfirmation from '@/components/restaurant/OrderConfirmation';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine_type: string;
  estimated_preparation_time: number;
  latitude: number;
  longitude: number;
}

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state: cartState, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour commander",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate, toast]);

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du restaurant",
          variant: "destructive",
        });
        throw error;
      }

      return data as Restaurant;
    },
  });

  const handleCheckout = async () => {
    if (!cartState.items.length) {
      toast({
        title: "Panier vide",
        description: "Veuillez ajouter des articles à votre panier",
        variant: "destructive",
      });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          total_amount: cartState.total,
          status: 'pending',
          payment_status: 'completed',
          delivery_status: 'pending',
          estimated_preparation_time: restaurant?.estimated_preparation_time || 30
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartState.items.map(item => ({
        order_id: order.id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès",
      });

      clearCart();
      setShowPayment(false);
      navigate('/orders');
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la commande",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MenuList />
          </div>
          
          <div className="lg:sticky lg:top-4">
            <CartSummary
              items={cartState.items}
              onCheckout={handleCheckout}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          </div>
        </div>
      </div>

      <OrderConfirmation 
        open={showPayment}
        onOpenChange={setShowPayment}
        onPaymentComplete={handlePaymentComplete}
        amount={cartState.total}
      />
    </div>
  );
};

export default RestaurantMenu;