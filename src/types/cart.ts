
export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
  price_adjustment: number;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  description: string;
  price: number;
  total: number;
  image_url: string;
  quantity: number;
  options: CartItemOption[];
  restaurant_id: string;
  special_instructions?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
