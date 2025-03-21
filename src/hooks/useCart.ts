
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';

interface UseCartReturn {
  cart: {
    items: CartItem[];
    restaurant_id?: string;
    discount_code?: string;
    discount_amount?: number;
  };
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string, amount: number) => void;
  removeDiscount: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  subtotal: number;
  totalItems: number;
  discount: number;
  discountCode: string | null;
}

export const useCart = (): UseCartReturn => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  const { 
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
  } = context;
  
  return {
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
  };
};

export default useCart;
