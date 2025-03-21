
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { type MenuItem } from '@/types/restaurant';
import { useCart } from '@/contexts/CartContext';

interface MenuItemProps {
  item: MenuItem;
  restaurantId: string;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, restaurantId }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  
  const cartItem = cart.items.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem?.quantity || 0;
  
  const handleAddToCart = () => {
    if (quantity === 0) {
      // Add item to cart
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        description: item.description,
        restaurant_id: restaurantId
      });
    } else {
      // Increase quantity
      updateQuantity(item.id, quantity + 1);
    }
  };
  
  const handleRemoveFromCart = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{item.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
            <div className="flex items-center space-x-2">
              <p className="font-semibold">{item.price.toLocaleString('fr-FR')} XAF</p>
              {item.preparation_time && (
                <span className="text-xs text-gray-500">
                  {item.preparation_time} min
                </span>
              )}
            </div>
          </div>
          
          {item.image_url && (
            <div className="ml-3 w-20 h-20 bg-gray-100 rounded overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="mt-3 flex justify-end">
          {quantity > 0 ? (
            <div className="flex items-center space-x-2">
              <Button 
                size="icon" 
                variant="outline" 
                onClick={handleRemoveFromCart}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center">{quantity}</span>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={handleAddToCart}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary/90"
            >
              Ajouter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemComponent;
