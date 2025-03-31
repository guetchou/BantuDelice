
export interface CartItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  name: string;
  price: number;
  total: number;
  options?: CartItemOption[];
  notes?: string;
  combo_item?: any;
}

export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  restaurant_id?: string;
  subtotal: number;
  tax: number;
  total: number;
  delivery_fee: number;
}
