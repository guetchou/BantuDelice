
import { useContext } from 'react';
import { CartContext, CartContextType } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return {
    // État du panier
    items: context.state.items,
    total: context.state.total,
    count: context.state.count,
    totalItems: context.state.totalItems,
    
    // Actions du panier
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateItemQuantity: context.updateItemQuantity,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    
    // Pour le passage au composant CartSection
    state: context.state
  };
};
