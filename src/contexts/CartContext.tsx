
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, CartState } from '@/types/cart';

interface CartContextType {
  cartState: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  // Adding the properties from CartContext.ts
  state: {
    items: CartItem[];
    total: number;
    count: number;
    totalItems: number;
  };
  updateItemQuantity: (itemId: string, quantity: number) => void;
}

const initialCartState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  delivery_fee: 0
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, setCartState] = useState<CartState>(initialCartState);

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const total = subtotal + tax + cartState.delivery_fee;
    return { subtotal, tax, total };
  };

  const addItem = (item: CartItem) => {
    // Ensure the item has menu_item_id and total properties
    const itemWithRequiredProps: CartItem = {
      ...item,
      menu_item_id: item.menu_item_id || item.id,
      total: item.price * item.quantity
    };

    setCartState(prevState => {
      const existingItem = prevState.items.find(i => i.id === itemWithRequiredProps.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevState.items.map(i => 
          i.id === itemWithRequiredProps.id 
            ? { ...i, quantity: i.quantity + itemWithRequiredProps.quantity, total: i.price * (i.quantity + itemWithRequiredProps.quantity) } 
            : i
        );
      } else {
        newItems = [...prevState.items, itemWithRequiredProps];
      }
      
      const { subtotal, tax, total } = calculateTotals(newItems);
      
      return {
        ...prevState,
        items: newItems,
        subtotal,
        tax,
        total,
        restaurant_id: itemWithRequiredProps.restaurant_id
      };
    });
  };

  const removeItem = (itemId: string) => {
    setCartState(prevState => {
      const newItems = prevState.items.filter(item => item.id !== itemId);
      const { subtotal, tax, total } = calculateTotals(newItems);
      
      return {
        ...prevState,
        items: newItems,
        subtotal,
        tax,
        total,
        restaurant_id: newItems.length > 0 ? prevState.restaurant_id : undefined
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartState(prevState => {
      const newItems = prevState.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity, total: item.price * quantity } 
          : item
      );
      
      const { subtotal, tax, total } = calculateTotals(newItems);
      
      return {
        ...prevState,
        items: newItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const clearCart = () => {
    setCartState(initialCartState);
  };

  // For compatibility with CartContext.ts
  const updateItemQuantity = updateQuantity;
  
  const state = {
    items: cartState.items,
    total: cartState.total,
    count: cartState.items.length,
    totalItems: cartState.items.reduce((sum, item) => sum + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={{ 
      cartState, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      state,
      updateItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};
