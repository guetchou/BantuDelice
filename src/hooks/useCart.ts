
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';
import { useLoyalty } from '@/contexts/LoyaltyContext';
import { toast } from 'sonner';

export const useCart = () => {
  const context = useContext(CartContext);
  const { loyaltyPoints } = useLoyalty();
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  const { 
    state, 
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
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
  
  // Appliquer une réduction en utilisant des points de fidélité
  const applyLoyaltyPoints = (points: number) => {
    // Vérifier si l'utilisateur a suffisamment de points
    if (!loyaltyPoints || loyaltyPoints.points < points) {
      toast.error("Vous n'avez pas assez de points de fidélité");
      return false;
    }
    
    // Calculer la valeur de la réduction (1 point = 1 FCFA)
    const discountAmount = points;
    
    // Vérifier que la réduction n'est pas supérieure au total
    const totalAmount = calculateTotalAmount();
    if (discountAmount > totalAmount) {
      toast.error("La réduction ne peut pas être supérieure au montant total");
      return false;
    }
    
    // Appliquer la réduction
    const updatedState = {
      ...state,
      discountAmount,
      loyaltyPointsUsed: points
    };
    
    setState(updatedState);
    toast.success(`${points} points utilisés pour une réduction de ${discountAmount} FCFA`);
    return true;
  };
  
  // Annuler l'utilisation des points de fidélité
  const cancelLoyaltyPointsUsage = () => {
    const updatedState = {
      ...state,
      discountAmount: 0,
      loyaltyPointsUsed: 0
    };
    setState(updatedState);
    toast.info("Utilisation des points de fidélité annulée");
  };
  
  return {
    cart: {
      ...state,
      totalAmount: calculateTotalAmount(),
      totalItems: calculateTotalItems()
    },
    addToCart: (item: CartItem) => addItemToCart(item),
    removeFromCart: (itemId: string) => removeItemFromCart(itemId),
    clearCart: () => clearItems(),
    updateDeliveryAddress,
    updatePaymentMethod,
    updateDeliveryFee,
    updateSpecialInstructions,
    applyDiscount,
    removeDiscount,
    applyLoyaltyPoints,
    cancelLoyaltyPointsUsage
  };
};
