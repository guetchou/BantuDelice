// Types spécifiques pour le module Restaurant
import type { BaseEntity, AddressInfo, ApiResponse, PaginatedResponse } from './global';

// ===== ENUMS RESTAURANT =====
export enum RestaurantStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  BUSY = 'busy',
  MAINTENANCE = 'maintenance',
  TEMPORARILY_CLOSED = 'temporarily_closed'
}

export enum CuisineType {
  AFRICAN = 'african',
  ASIAN = 'asian',
  EUROPEAN = 'european',
  AMERICAN = 'american',
  MEDITERRANEAN = 'mediterranean',
  FUSION = 'fusion',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  FAST_FOOD = 'fast_food',
  FINE_DINING = 'fine_dining'
}

export enum PriceRange {
  BUDGET = 'budget',
  MODERATE = 'moderate',
  EXPENSIVE = 'expensive',
  LUXURY = 'luxury'
}

export enum DeliveryType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
  DINE_IN = 'dine_in',
  ALL = 'all'
}

// ===== TYPES RESTAURANT =====
export interface RestaurantData extends BaseEntity {
  name: string;
  description: string;
  status: RestaurantStatus;
  cuisine: CuisineType[];
  priceRange: PriceRange;
  address: AddressInfo;
  contact: ContactInfo;
  hours: OperatingHours;
  delivery: DeliveryInfo;
  rating: RestaurantRatingInfo;
  images: ImageInfo[];
  features: RestaurantFeature[];
  menu?: MenuInfo;
  ownerId: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
  specialHours?: SpecialHours[];
}

export interface DayHours {
  open: boolean;
  openTime?: string; // HH:MM
  closeTime?: string; // HH:MM
  breakStart?: string; // HH:MM
  breakEnd?: string; // HH:MM
}

export interface SpecialHours {
  date: string; // YYYY-MM-DD
  open: boolean;
  openTime?: string;
  closeTime?: string;
  reason?: string;
}

export interface DeliveryInfo {
  available: boolean;
  types: DeliveryType[];
  minimumOrder: number;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  estimatedTime: {
    min: number; // minutes
    max: number; // minutes
  };
  deliveryRadius: number; // km
  zones: DeliveryZone[];
}

export interface DeliveryZone {
  name: string;
  deliveryFee: number;
  estimatedTime: {
    min: number;
    max: number;
  };
  coordinates: {
    center: {
      latitude: number;
      longitude: number;
    };
    radius: number; // km
  };
}

export interface RestaurantRatingInfo {
  average: number; // 1-5
  totalReviews: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  categories: {
    food: number;
    service: number;
    ambiance: number;
    value: number;
  };
}

export interface ImageInfo {
  id: string;
  url: string;
  alt: string;
  type: 'logo' | 'banner' | 'interior' | 'exterior' | 'food' | 'menu';
  order: number;
}

export interface RestaurantFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

export interface MenuInfo {
  id: string;
  categories: MenuCategory[];
  featured: string[]; // item IDs
  seasonal: SeasonalItem[];
  lastUpdated: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  available: boolean;
  popular: boolean;
  spicy: boolean;
  vegetarian: boolean;
  vegan: boolean;
  allergens: string[];
  nutrition?: NutritionInfo;
  customization?: CustomizationOption[];
  categoryId: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'single' | 'multiple' | 'quantity';
  required: boolean;
  maxSelections?: number;
  options: CustomizationChoice[];
}

export interface CustomizationChoice {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface SeasonalItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  image?: string;
}

// ===== TYPES API RESTAURANT =====
export interface CreateRestaurantRequest {
  name: string;
  description: string;
  cuisine: CuisineType[];
  priceRange: PriceRange;
  address: Omit<AddressInfo, 'id'>;
  contact: ContactInfo;
  hours: OperatingHours;
  delivery: DeliveryInfo;
  ownerId: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  status?: RestaurantStatus;
  cuisine?: CuisineType[];
  priceRange?: PriceRange;
  address?: AddressInfo;
  contact?: ContactInfo;
  hours?: OperatingHours;
  delivery?: DeliveryInfo;
  features?: RestaurantFeature[];
}

export interface RestaurantFilters {
  status?: RestaurantStatus[];
  cuisine?: CuisineType[];
  priceRange?: PriceRange[];
  deliveryType?: DeliveryType;
  rating?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // km
  };
  features?: string[];
}

export interface RestaurantSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'rating' | 'distance' | 'deliveryTime' | 'price';
  sortOrder?: 'asc' | 'desc';
  filters?: RestaurantFilters;
}

// ===== TYPES RÉPONSES API =====
export type RestaurantResponse = ApiResponse<RestaurantData>;
export type RestaurantListResponse = PaginatedResponse<RestaurantData>;
export type MenuResponse = ApiResponse<MenuInfo>;
export type RestaurantStatsResponse = ApiResponse<RestaurantStats>;

// ===== TYPES STATISTIQUES =====
export interface RestaurantStats {
  total: number;
  byStatus: Record<RestaurantStatus, number>;
  byCuisine: Record<CuisineType, number>;
  byPriceRange: Record<PriceRange, number>;
  performance: {
    averageRating: number;
    averageDeliveryTime: number;
    orderCompletionRate: number;
    customerSatisfaction: number;
  };
  revenue: {
    total: number;
    byMonth: Record<string, number>;
    byCuisine: Record<CuisineType, number>;
  };
}
