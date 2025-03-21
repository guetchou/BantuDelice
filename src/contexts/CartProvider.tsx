
import React, { useState, ReactNode } from 'react';
import { CartContext } from './CartContext';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addToCart = (item: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // If yes, update quantity
        return prevItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } 
            : i
        );
      } else {
        // If not, add new item with quantity 1 if not specified
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
    
    toast.success(`${item.name} ajouté au panier`);
  };
  
  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.info("Article retiré du panier");
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    toast.info("Panier vidé");
  };
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
