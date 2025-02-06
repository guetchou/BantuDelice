import { Database } from './database.types'

// Types de base pour les tables
export type Tables = Database['public']['Tables']
export type TablesInsert = {
  [K in keyof Tables]: Tables[K]['Insert']
}
export type TablesRow = {
  [K in keyof Tables]: Tables[K]['Row'] 
}

// Types spécifiques pour les tables taxi
export interface TaxiRating {
  id: string
  ride_id: string
  rating: number
  cleanliness: number
  punctuality: number
  driving_quality: number
  communication: number
  comment?: string
  created_at?: string
}

export interface TaxiPayment {
  id: string
  ride_id: string
  amount: number
  payment_method: string
  status: string
  transaction_id?: string
  created_at?: string
}

export interface TaxiRide {
  id: string
  user_id: string
  pickup_address: string
  destination_address: string
  pickup_time: string
  status: string
  driver_id?: string
  created_at?: string
  updated_at?: string
  estimated_price?: number
  actual_price?: number
  payment_status: string
  pickup_latitude?: number
  pickup_longitude?: number
  destination_latitude?: number
  destination_longitude?: number
  vehicle_type: string
  payment_method: string
  rating?: number
  rating_comment?: string
  driver?: {
    id: string
    current_latitude: number
    current_longitude: number
    user_id: string
    profiles?: {
      first_name: string | null
      last_name: string | null
      avatar_url: string | null
    } | null
  } | null
}

// Types pour les wallets et transactions
export interface WalletData {
  id: string
  user_id: string
  balance: number
  currency: string
  created_at?: string
  updated_at?: string
}

export interface TransactionData {
  id: string
  wallet_id: string
  type: string
  amount: number
  status: string
  description?: string
  reference_number?: string
  created_at?: string
}

// Types pour les profils et rôles utilisateurs
export interface UserProfile {
  id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  addresses?: string[]
  dietary_preferences?: string[]
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'user' | 'driver' | 'restaurant'
  created_at: string
}

// Types pour les commandes
export interface OrderData {
  id: string
  user_id: string
  restaurant_id: string
  status: string
  total_amount: number
  delivery_address: string
  payment_status: string
  delivery_status: string
  created_at: string
  updated_at?: string
  estimated_preparation_time?: number
  delivery_instructions?: string
}