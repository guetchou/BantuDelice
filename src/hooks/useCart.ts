
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';

export function useCart() {
  const cartContext = useContext(CartContext);
  
  if (!cartContext) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { state, addToCart, removeFromCart, updateQuantity, updateOptions, clearCart } = cartContext;

  return {
    cart: state,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateOptions,
    clearCart,
    items: state.items,
    total: state.total
  };
}
