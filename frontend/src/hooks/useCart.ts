
import { useState, useCallback } from 'react';

// Types simplifiés pour le panier
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

/**
 * Hook simplifié pour gérer le panier d'achat
 * Version temporaire qui ne dépend pas de CartContext
 */
export const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0
  });

  const addToCart = useCallback((item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Mettre à jour la quantité si l'article existe déjà
        const updatedItems = prevCart.items.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
            : cartItem
        );
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          items: updatedItems,
          total: newTotal
        };
      } else {
        // Ajouter un nouvel article
        const newItem = { ...item, quantity: item.quantity || 1 };
        const newItems = [...prevCart.items, newItem];
        const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          items: newItems,
          total: newTotal
        };
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        items: updatedItems,
        total: newTotal
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        items: updatedItems,
        total: newTotal
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 });
  }, []);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    // État du panier
    cartState: cart,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateQuantity,
    clearCart,
    
    // Pour compatibilité avec les composants existants
    items: cart.items,
    total: cart.total,
    totalItems,
    updateItemQuantity: updateQuantity,
    state: {
      items: cart.items,
      total: cart.total,
      count: cart.items.length,
      totalItems
    },
    
    // Fonctionnalités étendues
    addToCart,
    removeFromCart,
    clearCartWithConfirmation: clearCart,
    isInCart: (itemId: string) => cart.items.some(item => item.id === itemId),
    getItemQuantity: (itemId: string) => {
      const item = cart.items.find(item => item.id === itemId);
      return item ? item.quantity : 0;
    },
    isEmpty: () => cart.items.length === 0,
    calculateTotalWithDelivery: (deliveryFee: number = 299) => cart.total + deliveryFee,
  };
};
