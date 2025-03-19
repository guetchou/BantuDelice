
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  description?: string;
  restaurant_id: string;
  customizations?: Record<string, any>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  restaurantId: string | null;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(currentItems => {
      // Check if cart is empty or if item is from the same restaurant
      if (currentItems.length > 0) {
        const firstItemRestaurantId = currentItems[0].restaurant_id;
        if (newItem.restaurant_id !== firstItemRestaurantId) {
          toast.error("Vous ne pouvez commander que d'un restaurant à la fois", {
            description: "Videz votre panier avant d'ajouter des articles d'un autre restaurant."
          });
          return currentItems;
        }
      }

      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...currentItems, { ...newItem, quantity }];
      }
    });
    
    toast.success(`${newItem.name} ajouté au panier`);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    toast.info("Article retiré du panier");
  }, []);

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info("Panier vidé");
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const restaurantId = items.length > 0 ? items[0].restaurant_id : null;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItemQuantity,
      clearCart,
      itemCount,
      subtotal,
      restaurantId
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
