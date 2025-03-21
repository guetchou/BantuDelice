
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Cart, CartItem, CartContextType, CartState } from '@/types/cart';

// Initial state
const initialCart: Cart = {
  items: [],
  restaurant_id: undefined,
  discount_code: undefined,
  discount_amount: undefined
};

const initialState: CartState = {
  isOpen: false,
  items: [],
  restaurant_id: undefined,
  discount_code: undefined,
  discount_amount: undefined
};

// Define action types
type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: { code: string; amount: number } }
  | { type: 'REMOVE_DISCOUNT' }
  | { type: 'TOGGLE_CART' };

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        return {
          ...state,
          items: updatedItems,
          restaurant_id: state.restaurant_id || action.payload.restaurant_id
        };
      }
      
      // Add new item
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        restaurant_id: state.restaurant_id || action.payload.restaurant_id
      };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        ).filter(item => item.quantity > 0)
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        restaurant_id: undefined,
        discount_code: undefined,
        discount_amount: undefined
      };
      
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount_code: action.payload.code,
        discount_amount: action.payload.amount
      };
      
    case 'REMOVE_DISCOUNT':
      return {
        ...state,
        discount_code: undefined,
        discount_amount: undefined
      };
      
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };
      
    default:
      return state;
  }
};

// Create context
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Context provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Calculate totals
  const subtotal = state.items.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );
  
  const totalItems = state.items.reduce((total, item) => 
    total + item.quantity, 0
  );
  
  const discount = state.discount_amount || 0;
  const discountCode = state.discount_code || null;
  
  // Item actions
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { ...item, quantity: 1 } 
    });
  };
  
  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
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
  
  const applyDiscount = (code: string, amount: number) => {
    dispatch({ 
      type: 'APPLY_DISCOUNT', 
      payload: { code, amount } 
    });
  };
  
  const removeDiscount = () => {
    dispatch({ type: 'REMOVE_DISCOUNT' });
  };
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  // Create the cart object from state
  const cart: Cart = {
    items: state.items,
    restaurant_id: state.restaurant_id,
    discount_code: state.discount_code,
    discount_amount: state.discount_amount
  };
  
  // Context value
  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    applyDiscount,
    removeDiscount,
    updateQuantity,
    subtotal,
    totalItems,
    discount,
    discountCode,
    state
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook for easy context use
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
