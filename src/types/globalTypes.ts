
// ------------------ Restaurant ------------------
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  phone: string;
  status: 'open' | 'closed' | 'pending';
  banner_image_url?: string;
  average_rating?: number;
  average_prep_time?: number;
  price_range?: string;
  is_open?: boolean;
  business_hours?: string;
  website?: string;
  total_ratings?: number;
  trending?: boolean;
  latitude?: number;
  longitude?: number;
}

// ------------------ User Profile ------------------
export interface UserProfile {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'inactive';
}

export interface ExtendedUserProfile extends UserProfile {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'user' | 'admin' | 'restaurant_owner' | 'driver';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  last_login?: string;
}

// ------------------ CartItem & Options ------------------
export interface CartItemOption {
  id: string;
  name: string;
  value: string;
  price: number;
  quantity: number;
  price_adjustment: number;
}

export interface CartItem {
  id: string;
  menu_item_id?: string;
  name?: string;
  price?: number;
  quantity: number;
  options: CartItemOption[];
  combo_item?: boolean;
  restaurant_id?: string;
  special_instructions?: string;
  total?: number;
}

// ------------------ Menu Analysis ------------------
export interface ExtendedMenuAnalysisResult {
  lowProfitItems: any[];
  highProfitItems: any[];
  slowMovers: any[];
  fastMovers: any[];
  priceStats: {
    average: number;
    highest: number;
    lowest: number;
    median: number;
  };
  dietaryOptions: {
    vegetarianCount: number;
    vegetarianPercentage: number;
    veganCount: number;
    veganPercentage: number;
    glutenFreeCount: number;
    glutenFreePercentage: number;
  };
  insights: string[];
  menuSuggestions: {
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

// ------------------ Menu Promotion ------------------
export interface MenuPromotion {
  id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'amount' | 'fixed_amount';
  discount_value: number;
  valid_from: string;
  valid_to: string;
  promotion_hours?: { start: string; end: string; days?: string[] }[];
  conditions?: string;
  min_order_value?: number;
}

// ------------------ Ridesharing Trip ------------------
export interface RidesharingTrip {
  id: string;
  description: string;
  origin_address?: string;
  destination_address?: string;
  departure_time?: string;
  estimated_arrival_time?: string;
  available_seats?: number;
  price_per_seat?: number;
  vehicle_model?: string;
  vehicle_color?: string;
  license_plate?: string;
  preferences?: {
    smoking_allowed: boolean;
    pets_allowed: boolean;
    music_allowed: boolean;
    air_conditioning: boolean;
    luggage_allowed: boolean;
    chatty_driver?: boolean;
  };
  recurrence_pattern?: {
    frequency: string;
    days_of_week?: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  };
  status?: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
}

// ------------------ Business Rate Calculator Props ------------------
export interface BusinessRateCalculatorProps {
  formData: {
    companyName: string;
    contactEmail: string;
    monthlyRides: number;
    averageDistance: number;
    vehicleType: string;
  };
  showResult: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (value: number) => void;
  handleVehicleTypeChange: (value: string) => void;
  handleCalculate: () => void;
  handleSubmitRequest: () => void;
  getEstimate: () => void;
  isLoading: boolean;
  businessRateEstimate: {
    baseDiscount: number;
    volumeDiscount: number;
    totalDiscount: number;
    standardRate: number;
    businessRate: number;
    monthlySavings: number;
    annualSavings: number;
  };
}
