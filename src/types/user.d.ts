
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  // Propriétés supplémentaires demandées
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  status?: UserStatus;
  password?: string;
  last_login?: string;
}

export type UserRole = 'user' | 'admin' | 'restaurant' | 'driver' | 'superadmin' | 'restaurant_owner';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserPreferences {
  language: string;
  dark_mode: boolean;
  notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone?: string;
  role?: UserRole;
  avatar_url?: string;
  // Propriétés supplémentaires
  first_name?: string;
  last_name?: string;
}

export interface UserUpdateRequest {
  email?: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
  avatar_url?: string;
  // Propriétés supplémentaires
  first_name?: string;
  last_name?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  address?: string;
  phone_number?: string;
  avatar_url?: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}
