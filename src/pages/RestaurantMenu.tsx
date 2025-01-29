import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import MenuList from '@/components/menu/MenuList';
import CartSummary from '@/components/restaurant/CartSummary';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine_type: string;
  estimated_preparation_time: number;
  image_url?: string;
}

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const { state: cartState, addToCart, removeFromCart, updateQuantity } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
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
    setIsCheckingOut(true);
    try {
      // Implement checkout logic here
      toast({
        title: "Commande en cours",
        description: "Redirection vers le paiement...",
      });
      // Navigate to checkout or show payment modal
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la commande",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoadingRestaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant non trouvé</h1>
        <Button onClick={() => window.history.back()}>Retour</Button>
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
    </div>
  );
};

export default RestaurantMenu;