
import React, { createContext, useReducer, useEffect, useContext } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  restaurant_id: string;
  description?: string;
  options?: CartItemOption[];
  combo_item?: CartItem[];
}

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_RESTAURANT'; payload: string };

interface CartState {
  items: CartItem[];
  restaurant_id: string | null;
}

export interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (id: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const initialState: CartState = {
  items: [],
  restaurant_id: null
};

// Check for stored cart data
const storedCart = localStorage.getItem('cart');
const initialCartState = storedCart ? JSON.parse(storedCart) : initialState;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      // If item exists, increase its quantity
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        return { ...state, items: updatedItems };
      }
      
      // If item is from a different restaurant, replace cart
      if (state.restaurant_id && action.payload.restaurant_id !== state.restaurant_id) {
        return {
          items: [action.payload],
          restaurant_id: action.payload.restaurant_id
        };
      }
      
      // Add new item
      return {
        ...state,
        items: [...state.items, action.payload],
        restaurant_id: state.restaurant_id || action.payload.restaurant_id
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        restaurant_id: state.items.length === 1 ? null : state.restaurant_id
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        )
      };
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'SET_RESTAURANT':
      return {
        ...state,
        restaurant_id: action.payload
      };
    
    default:
      return state;
  }
}

export const CartContext = createContext<CartContextType>({
  state: initialCartState,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  setRestaurant: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  // Sync cart state with localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const setRestaurant = (id: string) => {
    dispatch({ type: 'SET_RESTAURANT', payload: id });
  };
  
  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const optionsTotal = item.options ? 
        item.options.reduce((sum, option) => sum + (option.price * option.quantity), 0) : 0;
      
      return total + itemTotal + optionsTotal;
    }, 0);
  };
  
  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider 
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setRestaurant,
        getTotalPrice,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
