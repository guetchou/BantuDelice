// Types spécifiques pour le module Taxi
import type { BaseEntity, AddressInfo, ApiResponse, PaginatedResponse } from './global';

// ===== ENUMS TAXI =====
export enum RideStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  ARRIVING = 'arriving',
  ARRIVED = 'arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum VehicleType {
  STANDARD = 'standard',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
  VAN = 'van',
  MOTORCYCLE = 'motorcycle'
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
  WALLET = 'wallet'
}

// ===== TYPES TAXI =====
export interface RideData extends BaseEntity {
  status: RideStatus;
  pickup: LocationInfo;
  destination: LocationInfo;
  vehicleType: VehicleType;
  driver?: DriverInfo;
  passenger: PassengerInfo;
  pricing: RidePricing;
  payment: PaymentInfo;
  route?: RouteInfo;
  rating?: TaxiRatingInfo;
  userId: string;
}

export interface LocationInfo extends AddressInfo {
  name?: string;
  instructions?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface DriverInfo extends BaseEntity {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  vehicle: VehicleInfo;
  rating: number;
  totalRides: number;
  isOnline: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export interface VehicleInfo {
  id: string;
  type: VehicleType;
  model: string;
  color: string;
  plateNumber: string;
  year: number;
  features: string[];
}

export interface PassengerInfo {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  rating: number;
  totalRides: number;
}

export interface RidePricing {
  basePrice: number;
  distancePrice: number;
  timePrice: number;
  surgeMultiplier: number;
  totalPrice: number;
  currency: string;
  estimatedPrice: number;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: string;
}

export interface RouteInfo {
  distance: number; // en km
  duration: number; // en minutes
  polyline: string;
  waypoints: LocationInfo[];
  trafficInfo?: {
    level: 'low' | 'medium' | 'high';
    delay: number; // en minutes
  };
}

export interface TaxiRatingInfo {
  rating: number; // 1-5
  comment?: string;
  categories: {
    cleanliness: number;
    punctuality: number;
    service: number;
    safety: number;
  };
  createdAt: string;
}

// ===== TYPES API TAXI =====
export interface CreateRideRequest {
  pickup: Omit<LocationInfo, 'id'>;
  destination: Omit<LocationInfo, 'id'>;
  vehicleType: VehicleType;
  paymentMethod: PaymentMethod;
  userId: string;
}

export interface UpdateRideRequest {
  status?: RideStatus;
  driverId?: string;
  currentLocation?: DriverInfo['currentLocation'];
  route?: RouteInfo;
}

export interface RideFilters {
  status?: RideStatus[];
  dateFrom?: string;
  dateTo?: string;
  vehicleType?: VehicleType;
  userId?: string;
  driverId?: string;
}

export interface RideSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: RideFilters;
}

// ===== TYPES RÉPONSES API =====
export type RideResponse = ApiResponse<RideData>;
export type RideListResponse = PaginatedResponse<RideData>;
export type DriverResponse = ApiResponse<DriverInfo>;
export type DriverListResponse = PaginatedResponse<DriverInfo>;
export type RideStatsResponse = ApiResponse<RideStats>;

// ===== TYPES STATISTIQUES =====
export interface RideStats {
  total: number;
  byStatus: Record<RideStatus, number>;
  byVehicleType: Record<VehicleType, number>;
  revenue: {
    total: number;
    byMonth: Record<string, number>;
    byVehicleType: Record<VehicleType, number>;
  };
  performance: {
    averageRating: number;
    averageWaitTime: number;
    completionRate: number;
    customerSatisfaction: number;
  };
}

// ===== TYPES NOTIFICATIONS =====
export interface RideNotification {
  id: string;
  type: 'driver_assigned' | 'driver_arriving' | 'ride_completed' | 'payment_processed' | 'issue_alert';
  rideId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type RideNotificationResponse = ApiResponse<RideNotification[]>; 