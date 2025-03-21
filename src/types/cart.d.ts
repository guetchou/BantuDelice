
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  description?: string;
  restaurant_id: string;
  options?: CartItemOption[];
  special_instructions?: string;
}

export interface CartItemOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  restaurant_id?: string;
  discount_code?: string;
  discount_amount?: number;
  delivery_address?: string;
  delivery_fee?: number;
  payment_method?: string;
  special_instructions?: string;
}

export interface CartState {
  isOpen: boolean;
  items: CartItem[];
  restaurant_id?: string;
  discount_code?: string;
  discount_amount?: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string, amount: number) => void;
  removeDiscount: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  subtotal: number;
  totalItems: number;
  discount: number;
  discountCode: string | null;
  state: CartState;
}
