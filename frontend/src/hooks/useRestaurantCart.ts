import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string;
  restaurantName: string;
  options?: {
    name: string;
    price: number;
  }[];
}

interface UseRestaurantCartReturn {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  isEmpty: boolean;
  hasItemsFromRestaurant: (restaurantId: string) => boolean;
  getItemsFromRestaurant: (restaurantId: string) => CartItem[];
}

const CART_STORAGE_KEY = 'bantudelice_restaurant_cart';

export const useRestaurantCart = (): UseRestaurantCartReturn => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Ajouter un article au panier
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Vérifier si l'article existe déjà
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.id === item.id && 
        JSON.stringify(cartItem.options) === JSON.stringify(item.options)
      );

      if (existingItemIndex >= 0) {
        // Incrémenter la quantité si l'article existe déjà
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        
        toast.success(`Quantité de "${item.name}" mise à jour`);
        return updatedItems;
      } else {
        // Vérifier si l'article provient du même restaurant
        const hasDifferentRestaurant = prevItems.some(
          cartItem => cartItem.restaurantId !== item.restaurantId
        );

        if (hasDifferentRestaurant && prevItems.length > 0) {
          const confirmReplace = window.confirm(
            `Vous avez déjà des articles de "${prevItems[0].restaurantName}" dans votre panier. Voulez-vous les remplacer par des articles de "${item.restaurantName}" ?`
          );

          if (confirmReplace) {
            toast.success(`"${item.name}" ajouté au panier`);
            return [{ ...item, quantity: 1 }];
          } else {
            return prevItems;
          }
        }

        // Ajouter le nouvel article
        toast.success(`"${item.name}" ajouté au panier`);
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  // Supprimer un article du panier
  const removeItem = useCallback((itemId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      
      if (itemToRemove) {
        toast.success(`"${itemToRemove.name}" retiré du panier`);
      }
      
      return updatedItems;
    });
  }, []);

  // Mettre à jour la quantité d'un article
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      return updatedItems;
    });
  }, [removeItem]);

  // Vider le panier
  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('Panier vidé');
  }, []);

  // Obtenir la quantité d'un article
  const getItemQuantity = useCallback((itemId: string) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  }, [items]);

  // Obtenir le nombre total d'articles
  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  // Calculer le sous-total
  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const optionsTotal = item.options?.reduce((optSum, opt) => optSum + opt.price, 0) || 0;
      return total + itemTotal + (optionsTotal * item.quantity);
    }, 0);
  }, [items]);

  // Calculer les frais de livraison
  const getDeliveryFee = useCallback(() => {
    const subtotal = getSubtotal();
    // Frais de livraison gratuits pour les commandes > 10000 FCFA
    return subtotal > 10000 ? 0 : 1000;
  }, [getSubtotal]);

  // Calculer le total
  const getTotal = useCallback(() => {
    return getSubtotal() + getDeliveryFee();
  }, [getSubtotal, getDeliveryFee]);

  // Vérifier si le panier est vide
  const isEmpty = items.length === 0;

  // Vérifier si le panier contient des articles d'un restaurant spécifique
  const hasItemsFromRestaurant = useCallback((restaurantId: string) => {
    return items.some(item => item.restaurantId === restaurantId);
  }, [items]);

  // Obtenir les articles d'un restaurant spécifique
  const getItemsFromRestaurant = useCallback((restaurantId: string) => {
    return items.filter(item => item.restaurantId === restaurantId);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    getTotalItems,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    isEmpty,
    hasItemsFromRestaurant,
    getItemsFromRestaurant
  };
}; 