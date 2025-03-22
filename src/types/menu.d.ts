
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  restaurant_id: string;
  available: boolean;
  category: string;
  image_url?: string;
  created_at: string;
  
  // Additional fields used in algorithms
  popularity_score?: number;
  profit_margin?: number;
  
  // Dietary information
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  is_spicy?: boolean;
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: MenuItemOptionChoice[];
  required: boolean;
  multiple: boolean;
}

export interface MenuItemOptionChoice {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface MenuPromotion {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  discount_type: "percentage" | "fixed_amount" | "free_delivery";
  discount_value: number;
  active: boolean;
  valid_from?: string;
  valid_to?: string;
  promotion_hours?: {
    days: string[];
    start_time: string;
    end_time: string;
  };
  conditions?: {
    min_order_value?: number;
    applicable_items?: string[];
    max_uses_per_customer?: number;
  };
  menu_item_ids?: string[];
  coupon_code?: string;
  is_active?: boolean;
}
