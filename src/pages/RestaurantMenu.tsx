
import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useMenuCombos } from '@/hooks/useMenuCombos';
import { useMenuPromotions } from '@/hooks/useMenuPromotions';
import MenuItemCard from '@/components/restaurant/MenuItemCard';
import CartSummary from '@/components/restaurant/CartSummary';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';
import RestaurantClosed from '@/components/orders/RestaurantClosed';
import MenuItemCustomization from '@/components/menu/MenuItemCustomization';
import type { CartItem } from '@/types/cart';
import type { MenuItem } from '@/types/menu';
import { useCart } from '@/hooks/useCart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Pizza, Coffee, Sandwich, Clock, Percent } from 'lucide-react';

export default function RestaurantMenu() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  
  // Redirect if restaurantId is missing
  if (!restaurantId) {
    navigate('/restaurants');
    return null;
  }

  const { data: restaurant, isLoading: isLoadingRestaurant, error: restaurantError } = useRestaurant(restaurantId);
  const { data: menuItems, isLoading: isLoadingMenu, error: menuError } = useMenuItems(restaurantId);
  const { addToCart, removeFromCart, cart, applyDiscount, removeDiscount } = useCart();
  const { getSuggestionsForItem } = useMenuCombos(menuItems);
  const { applyPromotionsToMenuItems, applyCouponToCart } = useMenuPromotions(restaurantId);

  // Appliquer les promotions aux items du menu
  const processedMenuItems = menuItems ? applyPromotionsToMenuItems(menuItems) : [];

  const handleAddToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    // Ouvrir le modal de personnalisation si l'item a des options
    if (item.id && processedMenuItems) {
      const menuItem = processedMenuItems.find(mi => mi.id === item.id);
      if (menuItem && (menuItem.customization_options || getSuggestionsForItem(menuItem).length > 0)) {
        setSelectedItem(menuItem);
        return;
      }
    }
    
    // Sinon, ajouter directement au panier
    const cartItem: CartItem = {
      ...item,
      quantity: 1
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre commande`,
    });
  }, [addToCart, processedMenuItems, getSuggestionsForItem, toast]);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    removeFromCart(itemId);
  }, [removeFromCart]);

  const handleCustomizedAddToCart = useCallback((item: CartItem) => {
    addToCart(item);
    
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre commande`,
    });
    
    setSelectedItem(null);
  }, [addToCart, toast]);

  const getCategories = useCallback(() => {
    if (!processedMenuItems || processedMenuItems.length === 0) return ["all"];
    
    const categories = Array.from(new Set(processedMenuItems.map(item => item.category)));
    return ["all", ...categories];
  }, [processedMenuItems]);

  const getFilteredItems = useCallback(() => {
    if (!processedMenuItems) return [];
    
    if (activeCategory === "all") return processedMenuItems;
    return processedMenuItems.filter(item => item.category === activeCategory);
  }, [processedMenuItems, activeCategory]);

  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) {
      toast({
        title: "Code promo invalide",
        description: "Veuillez entrer un code promo valide",
        variant: "destructive"
      });
      return;
    }
    
    const result = applyCouponToCart(
      couponCode, 
      cart.totalAmount, 
      cart.items
    );
    
    if (result.success) {
      toast({
        title: "Code promo appliqué",
        description: result.message
      });
      setAppliedCoupon(result);
      applyDiscount(result.discount);
    } else {
      toast({
        title: "Code promo invalide",
        description: result.message,
        variant: "destructive"
      });
    }
  }, [couponCode, cart, applyCouponToCart, applyDiscount, toast]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode('');
    removeDiscount();
    
    toast({
      title: "Code promo retiré",
      description: "Le code promo a été retiré de votre commande"
    });
  }, [removeDiscount, toast]);

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('pizza')) return <Pizza className="h-4 w-4" />;
    if (lowerCategory.includes('boisson') || lowerCategory.includes('drink')) return <Coffee className="h-4 w-4" />;
    if (lowerCategory.includes('sandwich')) return <Sandwich className="h-4 w-4" />;
    return null;
  };

  // Error handling
  if (restaurantError || menuError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <div className="text-center p-8 max-w-md">
          <p className="text-xl mb-4">Désolé, une erreur s'est produite lors du chargement des données</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/restaurants')}
          >
            Retour aux restaurants
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-orange-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p className="text-white">Chargement du restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant || !processedMenuItems) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl">Restaurant non trouvé</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/restaurants')}
          >
            Retour aux restaurants
          </Button>
        </div>
      </div>
    );
  }

  // Vérifier si le restaurant est fermé
  const isRestaurantClosed = !restaurant.is_open;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 text-white"
          onClick={() => navigate('/restaurants')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux restaurants
        </Button>

        {restaurant && <RestaurantHeader restaurant={restaurant} />}
        
        {isRestaurantClosed && (
          <div className="mt-4 mb-6">
            <RestaurantClosed 
              restaurantName={restaurant.name} 
              reason="Le restaurant est actuellement fermé"
              reopenTime={restaurant.special_days && restaurant.special_days[0]?.date}
            />
          </div>
        )}
        
        <div className="mt-8">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-6 bg-black/20 p-1 overflow-x-auto flex flex-nowrap">
              {getCategories().map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize data-[state=active]:bg-orange-500 whitespace-nowrap flex items-center gap-1"
                >
                  {getCategoryIcon(category)}
                  {category === "all" ? "Tout" : category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {/* Promotions en cours */}
                  {processedMenuItems.some(item => item.promotional_data?.is_on_promotion) && (
                    <div className="mb-6 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-orange-500/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Percent className="h-5 w-5 text-orange-500" />
                        <h3 className="text-lg font-semibold text-white">Promotions en cours</h3>
                      </div>
                      <div className="space-y-2">
                        {processedMenuItems
                          .filter(item => item.promotional_data?.is_on_promotion)
                          .slice(0, 3)
                          .map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-black/30 p-2 rounded">
                              <span className="text-white">{item.name}</span>
                              <Badge className="bg-orange-500">
                                {item.promotional_data?.discount_type === 'percentage' 
                                  ? `-${item.promotional_data.discount_value}%` 
                                  : `-${item.promotional_data.discount_value} XAF`}
                              </Badge>
                            </div>
                          ))}
                        {processedMenuItems.filter(item => item.promotional_data?.is_on_promotion).length > 3 && (
                          <p className="text-sm text-orange-300 mt-1">
                            +{processedMenuItems.filter(item => item.promotional_data?.is_on_promotion).length - 3} autres promotions
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Happy Hours */}
                  {processedMenuItems.some(item => 
                    item.promotional_data?.is_on_promotion && 
                    item.promotional_data?.promotion_hours
                  ) && (
                    <div className="mb-6 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold text-white">Happy Hours</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Des réductions sont appliquées automatiquement pendant les heures de promotion !
                      </p>
                    </div>
                  )}

                  {getFilteredItems().length === 0 ? (
                    <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-lg">
                      <p className="text-white">Aucun élément dans cette catégorie</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getFilteredItems().map((item) => (
                        <MenuItemCard 
                          key={item.id}
                          item={item}
                          onAddToCart={() => handleAddToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image_url: item.image_url,
                            description: item.description
                          })}
                          onRemoveFromCart={handleRemoveFromCart}
                          quantity={cart.items.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                          showNutritionalInfo={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-1 md:sticky md:top-4 self-start">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-800 p-4 mb-4">
                    <div className="space-y-3">
                      <h3 className="text-white font-medium">Avez-vous un code promo?</h3>
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Entrez votre code" 
                          value={couponCode} 
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={!!appliedCoupon}
                          className="bg-black/30 border-gray-700 text-white"
                        />
                        {appliedCoupon ? (
                          <Button 
                            variant="destructive" 
                            onClick={handleRemoveCoupon}
                          >
                            Retirer
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleApplyCoupon}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Appliquer
                          </Button>
                        )}
                      </div>
                      {appliedCoupon && (
                        <div className="text-green-400 text-sm">
                          {appliedCoupon.message}
                        </div>
                      )}
                    </div>
                  </div>
                
                  <CartSummary 
                    items={cart.items} 
                    onCheckout={() => {
                      toast({
                        title: "Paiement",
                        description: "Fonctionnalité de paiement en cours de développement",
                      });
                    }} 
                    onRemoveItem={handleRemoveFromCart}
                    onUpdateQuantity={(itemId, quantity) => {
                      const item = cart.items.find(item => item.id === itemId);
                      if (item) {
                        if (quantity <= 0) {
                          removeFromCart(itemId);
                        } else {
                          addToCart({
                            ...item,
                            quantity
                          });
                        }
                      }
                    }}
                    discount={cart.discountAmount}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal de personnalisation */}
      {selectedItem && (
        <MenuItemCustomization 
          item={selectedItem}
          onAddToCart={handleCustomizedAddToCart}
          onClose={() => setSelectedItem(null)}
          suggestedCombos={getSuggestionsForItem(selectedItem)}
        />
      )}
    </div>
  );
}
