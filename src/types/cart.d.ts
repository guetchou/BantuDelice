
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  menu_item_id: string;
  special_instructions?: string;
  image_url?: string;
  options?: {
    name: string;
    value: string;
    price?: number;
  }[];
}

export interface CartState {
  items: CartItem[];
  total: number;
  restaurant_id?: string;
  restaurant_name?: string;
}
