
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image_url?: string;
  restaurant_id: string;
  options?: CartItemOption[];
}

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getRestaurantId: () => string | null;
  canAddFromRestaurant: (restaurantId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    const restaurantId = getRestaurantId();
    
    // Check if adding from a different restaurant
    if (restaurantId && item.restaurant_id !== restaurantId) {
      toast({
        title: "Attention",
        description: "Votre panier contient des articles d'un autre restaurant. Voulez-vous vider votre panier?",
        variant: "destructive",
      });
      return;
    }
    
    // Check if item already exists
    const existingItemIndex = items.findIndex(i => 
      i.menu_item_id === item.menu_item_id && 
      JSON.stringify(i.options) === JSON.stringify(item.options)
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const newItems = [...items];
      newItems[existingItemIndex].quantity += item.quantity;
      newItems[existingItemIndex].total = 
        newItems[existingItemIndex].price * newItems[existingItemIndex].quantity;
      setItems(newItems);
    } else {
      // Add new item
      setItems([...items, { ...item, total: item.price * item.quantity }]);
    }
    
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier`,
    });
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity, total: item.price * quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getRestaurantId = () => {
    if (items.length === 0) return null;
    return items[0].restaurant_id;
  };

  const canAddFromRestaurant = (restaurantId: string) => {
    const currentRestaurantId = getRestaurantId();
    return !currentRestaurantId || currentRestaurantId === restaurantId;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      getRestaurantId,
      canAddFromRestaurant,
    }}>
      {children}
    </CartContext.Provider>
  );
};
