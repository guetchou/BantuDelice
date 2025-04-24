
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CartState } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
}

const initialCart: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  delivery_fee: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>(() => {
    // Try to load cart from localStorage
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    return savedCart ? JSON.parse(savedCart) : initialCart;
  });
  
  const { toast } = useToast();

  // Calculate cart totals whenever items change
  useEffect(() => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const total = subtotal + tax + cart.delivery_fee;
    
    setCart(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [cart.items, cart.delivery_fee]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if item already exists in cart
      const existingItemIndex = prev.items.findIndex(i => i.id === item.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...prev.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + item.quantity;
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          total: existingItem.price * newQuantity
        };
      } else {
        // Add new item
        updatedItems = [...prev.items, item];
      }

      const newRestaurantId = item.restaurant_id;
      const currentRestaurantId = prev.restaurant_id;

      // If we're adding an item from a different restaurant, clear the cart first
      if (currentRestaurantId && newRestaurantId && currentRestaurantId !== newRestaurantId && prev.items.length > 0) {
        toast({
          title: "Panier vidé",
          description: "Vous avez commencé une commande dans un nouveau restaurant.",
        });
        return {
          ...initialCart,
          items: [item],
          restaurant_id: newRestaurantId
        };
      }

      return {
        ...prev,
        items: updatedItems,
        restaurant_id: prev.restaurant_id || newRestaurantId
      };
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      
      // If cart becomes empty, reset restaurant_id
      const restaurant_id = updatedItems.length > 0 ? prev.restaurant_id : undefined;
      
      return {
        ...prev,
        items: updatedItems,
        restaurant_id
      };
    });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            total: item.price * quantity
          };
        }
        return item;
      });
      
      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart(initialCart);
  };

  // Check if item is in cart
  const isInCart = (itemId: string) => {
    return cart.items.some(item => item.id === itemId);
  };

  // Get quantity of an item in cart
  const getItemQuantity = (itemId: string) => {
    const item = cart.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default { CartProvider, useCart };
