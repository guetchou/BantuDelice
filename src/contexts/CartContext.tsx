
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, CartState } from '@/types/cart';

interface CartContextType {
  cartState: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const initialCartState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  delivery_fee: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, setCartState] = useState<CartState>(initialCartState);

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const total = subtotal + tax + cartState.delivery_fee;
    return { subtotal, tax, total };
  };

  const addItem = (item: CartItem) => {
    setCartState(prevState => {
      const existingItem = prevState.items.find(i => i.id === item.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevState.items.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newItems = [...prevState.items, item];
      }
      
      const { subtotal, tax, total } = calculateTotals(newItems);
      
      return {
        ...prevState,
        items: newItems,
        subtotal,
        tax,
        total,
        restaurant_id: item.restaurant_id
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
        item.id === itemId ? { ...item, quantity } : item
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

  return (
    <CartContext.Provider value={{ cartState, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
