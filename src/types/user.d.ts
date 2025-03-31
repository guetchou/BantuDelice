
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
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin?: boolean;
}
