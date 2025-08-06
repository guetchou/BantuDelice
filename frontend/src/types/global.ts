// Types globaux unifiés pour l'application BantuDelice

// ===== TYPES DE BASE =====
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ===== TYPES API =====
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ===== TYPES UTILISATEUR =====
export interface UserData extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  preferences?: UserPreferences;
}

export type UserRole = 'user' | 'admin' | 'driver' | 'restaurant' | 'enterprise';

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  shareLocation: boolean;
  shareData: boolean;
  analytics: boolean;
}

// ===== TYPES ADRESSE =====
export interface AddressInfo {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// ===== TYPES GÉNÉRIQUES =====
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: string | number | boolean | Array<string | number>;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// ===== TYPES FORMULAIRES =====
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'custom';
  value?: string | number;
  message: string;
}

// ===== TYPES ÉVÉNEMENTS =====
export interface AppEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

// ===== TYPES CONFIGURATION =====
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxFileSize: number;
    maxUploads: number;
    rateLimit: number;
  };
}

// ===== TYPES UTILITAIRES =====
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingData<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'failed';

// Tous les types sont déjà exportés individuellement ci-dessus 