
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
  created_at?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  address?: string;
  phone_number?: string;
  avatar_url?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: {
    language?: string;
    dark_mode?: boolean;
    notifications?: boolean;
    email_notifications?: boolean;
    push_notifications?: boolean;
  };
}
