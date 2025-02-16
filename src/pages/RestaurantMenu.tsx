
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useMenuItems } from '@/hooks/useMenuItems';
import MenuItemCard from '@/components/restaurant/MenuItemCard';
import CartSummary from '@/components/restaurant/CartSummary';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';
import type { CartItem } from '@/types/cart';
import { useCart } from '@/hooks/useCart';

export default function RestaurantMenu() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  if (!restaurantId) throw new Error('Restaurant ID is required');

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: menuItems, isLoading: isLoadingMenu } = useMenuItems(restaurantId);
  const { addToCart, removeFromCart, cart } = useCart();

  const handleAddToCart = useCallback((item: CartItem) => {
    addToCart(item);
  }, [addToCart]);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    removeFromCart(itemId);
  }, [removeFromCart]);

  if (isLoadingRestaurant || isLoadingMenu) {
    return <div>Loading...</div>;
  }

  if (!restaurant || !menuItems) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard 
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  quantity={cart.items.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                />
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <CartSummary items={cart.items} onCheckout={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
