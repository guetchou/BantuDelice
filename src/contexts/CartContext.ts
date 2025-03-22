
import { createContext } from 'react';
import { CartItem } from '@/types/cart';

export interface CartContextType {
  state: {
    items: CartItem[];
    total: number;
    count: number;
  };
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  state: {
    items: [],
    total: 0,
    count: 0
  },
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {}
});
