
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  description?: string;
  category?: string;
  restaurant_id: string; // Added restaurant_id
  customization_options: Record<string, any>;
  options?: { name: string; value: string; price: number; }[];
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  items: CartItem[];
}
