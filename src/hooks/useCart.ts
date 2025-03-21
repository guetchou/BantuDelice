
import { useContext } from 'react';
import { CartContext, CartContextType } from '@/contexts/CartContext';

// Hook personnalisé pour accéder au contexte du panier
const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default useCart;
