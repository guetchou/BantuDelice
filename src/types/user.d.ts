
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
  phone?: string;
  status: UserStatus;
  last_login?: string;
}

export type UserRole = 'user' | 'admin' | 'superadmin' | 'restaurant_owner' | 'driver';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  phone?: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  status?: UserStatus;
  phone?: string;
  avatar_url?: string;
}
