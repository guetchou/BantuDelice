
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  restaurant_id: string;
  customization_options?: {
    name: string;
    value: string;
    price: number;
  }[];
  options?: Record<string, any>;
}

export interface Cart {
  items: CartItem[];
  total: number;
  restaurant_id?: string;
}
