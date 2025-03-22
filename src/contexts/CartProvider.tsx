
import React, { createContext, useReducer } from 'react';
import { CartItem } from '@/types/cart';
import { CartContext, CartContextType } from './CartContext';

// Define the actions for our reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Define the state interface
interface CartState {
  items: CartItem[];
  total: number;
  count: number;
  totalItems: number;
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  count: 0,
  totalItems: 0
};

// Create the reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        
        return calculateCartTotals({
          ...state,
          items: updatedItems
        });
      }
      
      return calculateCartTotals({
        ...state,
        items: [...state.items, action.payload]
      });
    }
    
    case 'REMOVE_ITEM': {
      return calculateCartTotals({
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      });
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return calculateCartTotals({
          ...state,
          items: state.items.filter(item => item.id !== id)
        });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return calculateCartTotals({
        ...state,
        items: updatedItems
      });
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    default:
      return state;
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = state.items.length;
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    ...state,
    total,
    count,
    totalItems
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };
  
  const updateItemQuantity = (itemId: string, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: itemId, quantity }
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: itemId, quantity }
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateItemQuantity,
    updateQuantity,
    clearCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
