
import { createContext } from 'react';
import { CartItem } from '@/types/cart';

export interface CartContextType {
  state: {
    items: CartItem[];
    total: number;
    count: number;
    totalItems: number;
  };
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void; // Make sure this is available
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  state: {
    items: [],
    total: 0,
    count: 0,
    totalItems: 0
  },
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
});
