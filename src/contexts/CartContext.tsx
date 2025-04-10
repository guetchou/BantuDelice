import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '@/types/order';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      // Check if item already exists
      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
      
      // If item already exists, update quantity
      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
          total: (existingItem.quantity + item.quantity) * item.price
        };
        toast.success(`Quantité de ${item.name} mise à jour`);
        return updatedItems;
      }
      
      // Otherwise add new item
      toast.success(`${item.name} ajouté au panier`);
      return [...currentItems, { ...item, total: item.price * item.quantity }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} retiré du panier`);
      }
      return currentItems.filter(item => item.id !== itemId);
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity, total: quantity * item.price } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Panier vidé');
  };

  const getItemQuantity = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItemQuantity,
      clearCart,
      getItemQuantity,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
