
export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: string;
  last_login?: string;
  preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

export interface UserPreferences {
  id?: string;
  user_id?: string;
  dietary_restrictions?: string[];
  favorite_cuisines?: string[];
  allergens?: string[];
  spice_level?: number;
  notification_preferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  default_payment_method?: string;
  saved_addresses?: {
    id: string;
    name: string;
    address: string;
    is_default: boolean;
  }[];
  created_at?: string;
  updated_at?: string;
}
