import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import MenuList from "@/components/menu/MenuList";
import CartSummary from "@/components/restaurant/CartSummary";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const RestaurantMenu = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch restaurant data
  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Fetch menu items
  const { data: menuItems, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menuItems', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id);

      if (error) throw error;
      return data;
    }
  });

  // Create order mutation
  const createOrder = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Get user's profile for delivery address
      const { data: profile } = await supabase
        .from('profiles')
        .select('addresses')
        .eq('id', user.id)
        .single();

      if (!profile?.addresses?.[0]) {
        toast({
          title: "Erreur",
          description: "Veuillez ajouter une adresse de livraison dans votre profil",
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: id,
          total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'pending',
          payment_status: 'pending',
          delivery_status: 'pending',
          estimated_preparation_time: restaurant?.estimated_preparation_time || 30,
          delivery_address: profile.addresses[0]
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
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
        title: "Commande créée",
        description: "Votre commande a été créée avec succès"
      });

      navigate('/orders');
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive"
      });
    }
  });

  const handleAddToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleCheckout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Non connecté",
          description: "Veuillez vous connecter pour commander",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      // Get user's profile for delivery address
      const { data: profile } = await supabase
        .from('profiles')
        .select('addresses')
        .eq('id', user.id)
        .single();

      if (!profile?.addresses?.[0]) {
        toast({
          title: "Erreur",
          description: "Veuillez ajouter une adresse de livraison dans votre profil",
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: id,
          total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'pending',
          payment_status: 'pending',
          delivery_status: 'pending',
          estimated_preparation_time: restaurant?.estimated_preparation_time || 30,
          delivery_address: profile.addresses[0]
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
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
        title: "Commande créée",
        description: "Votre commande a été créée avec succès"
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive"
      });
    }
  };

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!restaurant || !menuItems) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Restaurant non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <MenuList 
              items={menuItems} 
              onAddToCart={handleAddToCart}
            />
          </div>
          
          <div className="md:col-span-1">
            <CartSummary
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
