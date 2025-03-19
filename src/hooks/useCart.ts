
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { CartItem, CartContextType } from '@/types/cart';

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return {
    cart: context.cart,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    clearCart: context.clearCart,
    applyDiscount: context.applyDiscount,
    removeDiscount: context.removeDiscount
  };
};
