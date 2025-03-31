
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
  addresses?: string[];
  dietary_preferences?: string[];
  status?: string;
  created_at?: string;
  last_login?: string;
  password?: string; // Pour les formulaires uniquement, jamais stocké
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  isAdmin?: boolean;
  login?: (email: string, password: string) => Promise<any>;
  register?: (email: string, password: string, userData: Partial<User>) => Promise<any>;
  logout?: () => Promise<void>;
  updateProfile?: (data: Partial<User>) => Promise<any>;
}

export type UserRole = 'user' | 'admin' | 'super_admin' | 'restaurant_owner' | 'driver';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  dietaryPreferences?: string[];
  favoriteRestaurants?: string[];
}
