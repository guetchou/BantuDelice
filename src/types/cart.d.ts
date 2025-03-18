
export interface CartItem {
  id: string;
  menu_item_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  quantity: number;
  options?: { name: string; value: string; price: number }[];
  instructions?: string;
  restaurant_id?: string;
  customization_options?: Record<string, any>;
}

export interface CartState {
  items: CartItem[];
  restaurant?: {
    id: string;
    name: string;
  };
}
