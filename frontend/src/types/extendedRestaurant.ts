
import { MenuItem, UserProfile } from '@/types/globalTypes';

export interface ExtendedMenuItem extends MenuItem {
  profit_margin?: number;
  popularity_score?: number;
  sales_volume?: number;
  last_ordered?: string;
}

export interface ExtendedUserProfile extends UserProfile {
  loyalty_points?: number;
  total_orders?: number;
  favorite_restaurants?: string[];
  payment_methods?: unknown[];
  last_login?: string;
  status?: 'active' | 'inactive' | 'suspended';
}
