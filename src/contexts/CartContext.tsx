
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  restaurant_id: string;
  options?: CartItemOption[];
  total: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getRestaurantId: () => string | null;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    // Check if adding from a different restaurant
    const currentRestaurantId = getRestaurantId();
    if (currentRestaurantId && currentRestaurantId !== item.restaurant_id && items.length > 0) {
      toast({
        title: "Panier d'un autre restaurant",
        description: "Votre panier contient des articles d'un autre restaurant. Voulez-vous le vider et ajouter ce nouvel article ?",
        variant: "destructive",
        action: (
          <button 
            className="bg-primary text-white px-3 py-1 rounded"
            onClick={() => {
              setItems([{ ...item, total: item.price * item.quantity }]);
            }}
          >
            Oui, vider
          </button>
        ),
      });
      return;
    }

    // Check if item already exists
    const existingItemIndex = items.findIndex((i) => 
      i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += item.quantity;
      updatedItems[existingItemIndex].total = 
        updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity;
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([...items, { ...item, total: item.price * item.quantity }]);
    }

    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier.`,
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity, total: item.price * quantity };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const getRestaurantId = () => {
    return items.length > 0 ? items[0].restaurant_id : null;
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getSubtotal,
        getRestaurantId,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
