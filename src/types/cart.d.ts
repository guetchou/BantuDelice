
export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price?: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image_url?: string;
  restaurant_id?: string;
  description?: string;
  options?: CartItemOption[];
  category?: string;
  size?: string;
  special_instructions?: string;
  combo_item?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  delivery_fee: number;
  restaurant_id?: string;
}
