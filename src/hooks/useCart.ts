
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  const { 
    state, 
    addItem,
    removeItem,
    clearItems,
    updateDeliveryAddress, 
    updatePaymentMethod,
    updateDeliveryFee,
    updateSpecialInstructions,
    setState
  } = context;
  
  // Calculer le montant total du panier
  const calculateTotalAmount = () => {
    return state.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  // Calculer le nombre total d'articles dans le panier
  const calculateTotalItems = () => {
    return state.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };
  
  // Appliquer une réduction au panier
  const applyDiscount = (amount: number) => {
    const updatedState = {
      ...state,
      discountAmount: amount
    };
    setState(updatedState);
  };
  
  // Supprimer une réduction du panier
  const removeDiscount = () => {
    const updatedState = {
      ...state,
      discountAmount: 0
    };
    setState(updatedState);
  };
  
  return {
    cart: {
      ...state,
      totalAmount: calculateTotalAmount(),
      totalItems: calculateTotalItems()
    },
    addToCart: (item: CartItem) => addItem(item),
    removeFromCart: (itemId: string) => removeItem(itemId),
    clearCart: () => clearItems(),
    updateDeliveryAddress,
    updatePaymentMethod,
    updateDeliveryFee,
    updateSpecialInstructions,
    applyDiscount,
    removeDiscount
  };
};
