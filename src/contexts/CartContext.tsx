
import React, { createContext, useReducer, ReactNode } from 'react';
import { CartItem, Cart, CartAction, CartContextType } from '@/types/cart';
import { toast } from 'sonner';

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  total: 0,
  discountAmount: 0
};

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let updatedItems;

      if (existingItemIndex >= 0) {
        // L'item existe déjà, on met à jour la quantité
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + (action.payload.quantity || 1)
        };
      } else {
        // Nouvel item à ajouter
        updatedItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
        total: totalAmount - (state.discountAmount || 0)
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = updatedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
        total: totalAmount - (state.discountAmount || 0)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      const totalItems = updatedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
        total: totalAmount - (state.discountAmount || 0)
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialCart,
        discountAmount: 0 // Réinitialiser aussi la réduction
      };

    case 'APPLY_DISCOUNT': {
      const discountAmount = action.payload;
      return {
        ...state,
        discountAmount,
        total: state.totalAmount - discountAmount
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
};

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
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

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    applyDiscount,
    removeDiscount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
