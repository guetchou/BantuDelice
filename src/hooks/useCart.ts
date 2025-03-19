
import { useContext } from 'react';
import { CartContext, CartContextType } from '@/contexts/CartContext';

/**
 * Hook to access the cart context
 * @returns The cart context
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return {
    cart: context.cart,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    clearCart: context.clearCart,
    applyDiscount: context.applyDiscount,
    removeDiscount: context.removeDiscount,
    updateQuantity: context.updateQuantity,
    subtotal: context.subtotal,
    totalItems: context.totalItems,
    discount: context.discount,
    discountCode: context.discountCode,
    state: context.state
  };
};

export default useCart;
