

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
  restaurant_id: string;
  created_at: string;
  updated_at?: string;
  customization_options?: Record<string, any>;
  popularity_score?: number;
  rating?: number;
  preparation_time?: number;
  dietary_preferences?: string[];
  cuisine_type?: string;
  ingredients?: string[];
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  allergens?: string[];
  is_featured?: boolean;
  is_combo?: boolean;
  combo_items?: string[]; // IDs of included menu items
  combo_discount?: number; // Discount percentage for the combo
  stock_level?: number;
  promotional_data?: {
    is_on_promotion: boolean;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    valid_from?: string;
    valid_to?: string;
    promotion_hours?: {
      start: string; // HH:MM format
      end: string; // HH:MM format
      days: string[]; // e.g., ["monday", "tuesday"]
    };
    conditions?: string[];
  };
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuPromotion {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount' | 'free_item';
  discount_value: number;
  menu_item_ids?: string[];
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  conditions?: string[];
  coupon_code?: string;
  min_order_value?: number;
  max_uses_per_customer?: number;
  promotion_hours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
    days: string[]; // e.g., ["monday", "tuesday"]
  };
}

