
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { CartItem, CartItemOption } from '@/types/cart';
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
    if (!item.menu_item_id) {
      item.menu_item_id = item.id;
    }
    
    if (!item.total) {
      item.total = item.price * item.quantity;
    }
    
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
    if (context.cartState.items.length > 0) {
      context.clearCart();
      toast.info("Panier vidé", {
        description: "Tous les articles ont été retirés du panier",
      });
    }
  };
  
  // Vérifie si un article est déjà dans le panier
  const isInCart = (itemId: string): boolean => {
    return context.cartState.items.some(item => item.id === itemId);
  };
  
  // Obtient la quantité d'un article dans le panier
  const getItemQuantity = (itemId: string): number => {
    const item = context.cartState.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  // Vérifie si le panier est vide
  const isEmpty = (): boolean => {
    return context.cartState.items.length === 0;
  };
  
  // Calcule le total avec frais de livraison
  const calculateTotalWithDelivery = (deliveryFee: number = 299): number => {
    return context.cartState.total + deliveryFee;
  };
  
  // Pour compatibilité avec les composants existants
  const items = context.cartState.items;
  const total = context.cartState.total;
  const totalItems = context.cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const updateItemQuantity = context.updateQuantity;
  
  // Add state property for compatibility with existing components
  const state = {
    items: context.cartState.items,
    total: context.cartState.total,
    count: context.cartState.items.length,
    totalItems: totalItems
  };
  
  return {
    // État du panier
    cartState: context.cartState,
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    
    // Pour compatibilité avec les composants existants
    items,
    total,
    totalItems,
    updateItemQuantity,
    state,
    
    // Fonctionnalités étendues
    addToCart,
    removeFromCart,
    clearCartWithConfirmation,
    isInCart,
    getItemQuantity,
    isEmpty,
    calculateTotalWithDelivery,
  };
};
