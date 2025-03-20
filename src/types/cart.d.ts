
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  description?: string;
  restaurant_id: string;
  options?: Array<{
    name: string;
    value: string;
    price: number;
  }>;
  special_instructions?: string;
  combo_item?: boolean;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  total: number;
  discountAmount?: number;
}

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: number }
  | { type: 'REMOVE_DISCOUNT' };

export interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyDiscount: (amount: number) => void;
  removeDiscount: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  state: Cart;
}
