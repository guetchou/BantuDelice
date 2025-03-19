
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { CartItem, MenuItem } from '@/types/cart';

export interface CartContextType {
  cart: CartItem[];
  subtotal: number;
  totalItems: number;
  discount: number | null;
  discountCode: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string, amount: number) => void;
  removeDiscount: () => void;
  state: {
    cart: CartItem[];
    subtotal: number;
    totalItems: number;
    discount: number | null;
    discountCode: string | null;
  };
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [discount, setDiscount] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // Calculate subtotal and total items whenever cart changes
  useEffect(() => {
    const newSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    setSubtotal(newSubtotal);
    setTotalItems(newTotalItems);
  }, [cart]);

  // Add item to cart or increment quantity if already exists
  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast.success(`Quantité modifiée (${updatedCart[existingItemIndex].quantity})`);
        return updatedCart;
      } else {
        // Add new item to cart
        toast.success('Ajouté au panier');
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== itemId);
      toast.success('Retiré du panier');
      return updatedCart;
    });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setDiscount(null);
    setDiscountCode(null);
  };

  // Apply discount
  const applyDiscount = (code: string, amount: number) => {
    setDiscount(amount);
    setDiscountCode(code);
    toast.success(`Code promo "${code}" appliqué`);
  };

  // Remove discount
  const removeDiscount = () => {
    setDiscount(null);
    setDiscountCode(null);
    toast.success('Code promo retiré');
  };

  // Create state object for easier access
  const state = {
    cart,
    subtotal,
    totalItems,
    discount,
    discountCode
  };

  return (
    <CartContext.Provider value={{
      cart,
      subtotal,
      totalItems,
      discount,
      discountCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyDiscount,
      removeDiscount,
      state
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
