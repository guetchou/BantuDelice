
export interface CartItemOption {
  name: string;
  value: string;
  price: number;
}

export interface CartItemCombo {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  restaurant_id: string;
  image_url?: string;
  quantity: number;
  category?: string;
  description?: string;
  options?: CartItemOption[];
  special_instructions?: string;
  customization_options?: Record<string, any>;
  combo_item?: CartItemCombo;
  dietary_preferences?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  allergens?: string[];
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount?: {
    code: string;
    amount: number;
    type: 'percentage' | 'fixed' | 'free_delivery';
  };
  deliveryFee: number;
  tax: number;
  tip?: number;
  total: number;
}

export interface PromotionCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed' | 'free_delivery';
  min_order_amount?: number;
  max_discount?: number;
  isValid: boolean;
  validationMessage?: string;
}
