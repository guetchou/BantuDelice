
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/order';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Calculate total items and price
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add or update item in cart
  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => 
        item.menu_item_id === newItem.menu_item_id && 
        JSON.stringify(item.options) === JSON.stringify(newItem.options)
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity;
        
        toast({
          title: "Panier mis à jour",
          description: `${newItem.name} a été ajouté au panier`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        toast({
          title: "Ajouté au panier",
          description: `${newItem.name} a été ajouté au panier`,
        });
        
        return [...prevItems, { ...newItem, total: newItem.price * newItem.quantity }];
      }
    });
  };

  // Update item quantity
  const updateItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity, total: item.price * quantity } 
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        toast({
          title: "Retiré du panier",
          description: `${itemToRemove.name} a été retiré du panier`,
        });
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Panier vidé",
      description: "Tous les articles ont été retirés du panier",
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
