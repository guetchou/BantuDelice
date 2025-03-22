
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return {
    ...context,
    state: context.state,
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateItemQuantity: context.updateItemQuantity,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    items: context.state.items,
    total: context.state.total,
    count: context.state.count,
    totalItems: context.state.totalItems
  };
};
