
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Cart, CartAction, CartContextType } from '@/types/cart';

const initialState: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  total: 0,
  discountAmount: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + action.payload.quantity } 
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }
      
      // Calculate new totals
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        total: totalAmount - (state.discountAmount || 0)
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        total: totalAmount - (state.discountAmount || 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      
      const newItems = state.items.map(item => 
        item.id === action.payload.id 
          ? { ...item, quantity: action.payload.quantity } 
          : item
      );
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        total: totalAmount - (state.discountAmount || 0)
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    case 'APPLY_DISCOUNT': {
      return {
        ...state,
        discountAmount: action.payload,
        total: state.totalAmount - action.payload
      };
    }
    
    case 'REMOVE_DISCOUNT': {
      return {
        ...state,
        discountAmount: 0,
        total: state.totalAmount
      };
    }
    
    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const applyDiscount = (amount: number) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: amount });
  };
  
  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };
  
  return (
    <CartContext.Provider value={{ 
      cart: state, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      applyDiscount, 
      removeDiscount,
      state
    }}>
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
