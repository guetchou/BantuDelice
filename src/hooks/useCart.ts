
import { useContext } from 'react';
import { CartContext, CartContextType } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';

/**
 * Hook pour gérer le panier d'achat
 * Facilite l'accès au contexte du panier et ajoute des fonctionnalités utiles
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  // Fonction étendue pour ajouter un article avec notification
  const addToCart = (item: CartItem) => {
    if (!item.quantity) {
      item.quantity = 1;
    }
    
    context.addItem(item);
    
    toast.success("Article ajouté", {
      description: `${item.name} a été ajouté au panier`,
    });
  };
  
  // Fonction étendue pour supprimer un article avec notification
  const removeFromCart = (itemId: string, itemName?: string) => {
    context.removeItem(itemId);
    
    toast.info("Article supprimé", {
      description: itemName 
        ? `${itemName} a été retiré du panier` 
        : "L'article a été retiré du panier",
    });
  };
  
  // Fonction pour vider le panier avec confirmation
  const clearCartWithConfirmation = () => {
    if (context.state.items.length > 0) {
      context.clearCart();
      toast.info("Panier vidé", {
        description: "Tous les articles ont été retirés du panier",
      });
    }
  };
  
  // Vérifie si un article est déjà dans le panier
  const isInCart = (itemId: string): boolean => {
    return context.state.items.some(item => item.id === itemId);
  };
  
  // Obtient la quantité d'un article dans le panier
  const getItemQuantity = (itemId: string): number => {
    const item = context.state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  // Vérifie si le panier est vide
  const isEmpty = (): boolean => {
    return context.state.items.length === 0;
  };
  
  // Calcule le total avec frais de livraison
  const calculateTotalWithDelivery = (deliveryFee: number = 299): number => {
    return context.state.total + deliveryFee;
  };
  
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
    
    // Fonctionnalités étendues
    addToCart,
    removeFromCart,
    clearCartWithConfirmation,
    isInCart,
    getItemQuantity,
    isEmpty,
    calculateTotalWithDelivery,
    
    // Pour le passage au composant CartSection
    state: context.state
  };
};
