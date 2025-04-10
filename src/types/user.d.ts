
export interface User {
  id: string;
  email: string;
  name?: string;
  created?: string;
  role?: string;
  avatar_url?: string;
  [key: string]: any; // For additional properties
}

export type UserRole = 'user' | 'admin' | 'super_admin' | 'restaurant_owner' | 'driver';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  dietary_preferences?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: UserRole;
}
