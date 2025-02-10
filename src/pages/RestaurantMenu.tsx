
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Utensils, Clock, AlertTriangle, Info, Star, Leaf, Heart } from "lucide-react";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import MenuList from "@/components/menu/MenuList";
import CartSummary from "@/components/restaurant/CartSummary";
import { MenuItem } from "@/components/menu/types";
import { InventoryManager } from "@/components/inventory/InventoryManager";
import { LoyaltyStatus } from "@/components/loyalty/LoyaltyStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CartItem extends MenuItem {
  quantity: number;
}

const CATEGORIES = [
  { id: "all", label: "Tout" },
  { id: "entrees", label: "Entrées" },
  { id: "plats", label: "Plats principaux" },
  { id: "desserts", label: "Desserts" },
  { id: "boissons", label: "Boissons" }
];

const RestaurantMenu = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isRestaurantOwner, setIsRestaurantOwner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !id) return;

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('user_id')
        .eq('id', id)
        .maybeSingle();

      setIsRestaurantOwner(restaurant?.user_id === user.id);
    };

    checkOwnership();
  }, [id]);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      if (!id) throw new Error('Restaurant ID is required');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Restaurant not found');
      
      return {
        ...data,
        opening_hours: data.opening_hours ? JSON.parse(data.opening_hours as string) : null
      };
    },
    enabled: !!id
  });

  const { data: menuItems, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menuItems', id],
    queryFn: async () => {
      if (!id) throw new Error('Restaurant ID is required');

      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          inventory_levels(current_stock, reserved_stock)
        `)
        .eq('restaurant_id', id);

      if (error) throw error;
      return data.map((item: any) => ({
        ...item,
        available: item.inventory_levels?.[0]?.current_stock > item.inventory_levels?.[0]?.reserved_stock
      }));
    },
    enabled: !!id
  });

  const handleAddToCart = async (item: MenuItem) => {
    const { data: stockData } = await supabase
      .from('inventory_levels')
      .select('current_stock, reserved_stock')
      .eq('menu_item_id', item.id)
      .single();

    if (stockData && (stockData.current_stock - stockData.reserved_stock) <= 0) {
      toast({
        title: "Stock insuffisant",
        description: "Cet article n'est plus disponible pour le moment",
        variant: "destructive"
      });
      return;
    }

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

    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier`,
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
          ? { ...i: item, quantity }
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

  const filteredMenuItems = menuItems?.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  );

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RestaurantHeader restaurant={restaurant} />
      </motion.div>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <LoyaltyStatus />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Utensils className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">Notre Menu</h2>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNutritionalInfo(!showNutritionalInfo)}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Info nutritionnelles
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Afficher/masquer les informations nutritionnelles</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  {CATEGORIES.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <AnimatePresence mode="wait">
                    <MenuList 
                      items={filteredMenuItems || []}
                      onAddToCart={handleAddToCart}
                      showNutritionalInfo={showNutritionalInfo}
                    />
                  </AnimatePresence>
                </TabsContent>

                {CATEGORIES.slice(1).map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <AnimatePresence mode="wait">
                      <MenuList 
                        items={filteredMenuItems || []}
                        onAddToCart={handleAddToCart}
                        showNutritionalInfo={showNutritionalInfo}
                      />
                    </AnimatePresence>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-1/4"
          >
            <div className="sticky top-4">
              <CartSummary
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCheckout}
              />

              {restaurant.average_rating && (
                <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Note moyenne</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{restaurant.average_rating.toFixed(1)}/5</span>
                    </div>
                  </div>
                </div>
              )}

              {restaurant.specialties && restaurant.specialties.length > 0 && (
                <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                  <h3 className="font-semibold mb-2">Nos spécialités</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.specialties.map((specialty: string) => (
                      <Badge key={specialty} variant="secondary">
                        <Leaf className="h-3 w-3 mr-1" />
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {isRestaurantOwner && id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <InventoryManager restaurantId={id} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
