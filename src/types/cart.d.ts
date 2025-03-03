
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant_id: string;
  options?: Record<string, any>;
  customization_options?: Array<{
    name: string;
    value: string;
    price: number;
  }>;
}

export interface CartState {
  items: CartItem[];
  total: number;
}
