
import React, { createContext, useReducer, useContext } from 'react';

// Define the cart item types
export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  restaurant_id: string;
  image_url?: string;
  description?: string;
  special_instructions?: string;
  options?: CartItemOption[];
}

// Define cart state
export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  restaurantId: string | null;
}

// Define action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'ADD_INSTRUCTIONS'; payload: { id: string; instructions: string } }
  | { type: 'CLEAR_CART' };

// Initial cart state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
  restaurantId: null,
};

// Create context with type
export interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  addInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  state: initialState,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  addInstructions: () => {},
  clearCart: () => {},
});

// Reducer function to handle cart actions
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = action.payload;
      
      // Check if item from different restaurant
      if (state.restaurantId && item.restaurant_id !== state.restaurantId && state.items.length > 0) {
        // Replace cart with item from new restaurant
        const newState = {
          ...initialState,
          items: [item],
          totalItems: item.quantity,
          subtotal: item.price * item.quantity,
          tax: (item.price * item.quantity) * 0.1, // 10% tax
          deliveryFee: 1000, // Default delivery fee
          restaurantId: item.restaurant_id,
        };
        
        newState.total = newState.subtotal + newState.tax + newState.deliveryFee;
        return newState;
      }
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        
        const newSubtotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const newTax = newSubtotal * 0.1;
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: newSubtotal,
          tax: newTax,
          total: newSubtotal + newTax + state.deliveryFee,
          restaurantId: state.restaurantId || item.restaurant_id,
        };
      } else {
        // Add new item
        const updatedItems = [...state.items, item];
        const newSubtotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const newTax = newSubtotal * 0.1;
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          subtotal: newSubtotal,
          tax: newTax,
          total: newSubtotal + newTax + state.deliveryFee,
          restaurantId: state.restaurantId || item.restaurant_id,
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemId = action.payload;
      const updatedItems = state.items.filter(i => i.id !== itemId);
      
      // Clear restaurant ID if cart is empty
      const newRestaurantId = updatedItems.length > 0 ? state.restaurantId : null;
      const newSubtotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const newTax = newSubtotal * 0.1;
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: newSubtotal,
        tax: newTax,
        total: newSubtotal + newTax + state.deliveryFee,
        restaurantId: newRestaurantId,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      const newSubtotal = updatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const newTax = newSubtotal * 0.1;
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: newSubtotal,
        tax: newTax,
        total: newSubtotal + newTax + state.deliveryFee,
      };
    }
    
    case 'ADD_INSTRUCTIONS': {
      const { id, instructions } = action.payload;
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, special_instructions: instructions } : item
      );
      
      return {
        ...state,
        items: updatedItems,
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    default:
      return state;
  }
};

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };
  
  const addInstructions = (itemId: string, instructions: string) => {
    dispatch({ type: 'ADD_INSTRUCTIONS', payload: { id: itemId, instructions } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        addInstructions,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
