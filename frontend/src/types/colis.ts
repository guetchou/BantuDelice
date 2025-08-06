// Types spécifiques pour le module Colis
import type { BaseEntity, AddressInfo, ApiResponse, PaginatedResponse } from './global';

// ===== ENUMS COLIS =====
export enum ColisStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
  CANCELLED = 'cancelled'
}

export enum PackageType {
  PACKAGE = 'package',
  DOCUMENT = 'document',
  FRAGILE = 'fragile',
  HEAVY = 'heavy',
  BULKY = 'bulky'
}

export enum DeliverySpeed {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PREMIUM = 'premium',
  SAME_DAY = 'same_day'
}

export enum ServiceType {
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
  SAME_CITY = 'same_city',
  INTERCITY = 'intercity'
}

// ===== TYPES COLIS =====
export interface ColisData extends BaseEntity {
  trackingNumber: string;
  status: ColisStatus;
  sender: SenderInfo;
  recipient: RecipientInfo;
  package: PackageInfo;
  service: ServiceInfo;
  pricing: PricingInfo;
  tracking: TrackingInfo;
  userId?: string;
}

export interface SenderInfo extends AddressInfo {
  name: string;
  phone: string;
  email: string;
  company?: string;
}

export interface RecipientInfo extends AddressInfo {
  name: string;
  phone: string;
  email: string;
  company?: string;
  instructions?: string;
}

export interface PackageInfo {
  type: PackageType;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
  value?: number;
  insurance?: boolean;
}

export interface ServiceInfo {
  type: ServiceType;
  speed: DeliverySpeed;
  pickupDate: string;
  estimatedDelivery: string;
  specialHandling?: string[];
}

export interface PricingInfo {
  basePrice: number;
  insuranceCost: number;
  specialHandlingCost: number;
  totalPrice: number;
  currency: string;
  paymentMethod: ColisPaymentMethod;
  paid: boolean;
}

export interface TrackingInfo {
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: string;
  };
  history: TrackingEvent[];
  estimatedDelivery: string;
  actualDelivery?: string;
  signature?: string;
}

export interface TrackingEvent {
  id: string;
  status: ColisStatus;
  location: string;
  description: string;
  timestamp: string;
  operator?: string;
}

export interface ColisPaymentMethod {
  type: 'card' | 'mobile_money' | 'bank_transfer' | 'cash';
  details?: Record<string, unknown>;
}

// ===== TYPES API COLIS =====
export interface CreateColisRequest {
  sender: Omit<SenderInfo, 'id'>;
  recipient: Omit<RecipientInfo, 'id'>;
  package: PackageInfo;
  service: Omit<ServiceInfo, 'estimatedDelivery'>;
  userId?: string;
}

export interface UpdateColisRequest {
  status?: ColisStatus;
  currentLocation?: TrackingInfo['currentLocation'];
  trackingEvent?: Omit<TrackingEvent, 'id'>;
}

export interface ColisFilters {
  status?: ColisStatus[];
  dateFrom?: string;
  dateTo?: string;
  trackingNumber?: string;
  userId?: string;
}

export interface ColisSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: ColisFilters;
}

// ===== TYPES RÉPONSES API =====
export type ColisResponse = ApiResponse<ColisData>;
export type ColisListResponse = PaginatedResponse<ColisData>;
export type TrackingResponse = ApiResponse<TrackingInfo>;
export type ColisStatsResponse = ApiResponse<ColisStats>;

// ===== TYPES STATISTIQUES =====
export interface ColisStats {
  total: number;
  byStatus: Record<ColisStatus, number>;
  byType: Record<PackageType, number>;
  byService: Record<ServiceType, number>;
  revenue: {
    total: number;
    byMonth: Record<string, number>;
    byService: Record<ServiceType, number>;
  };
  performance: {
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
    customerSatisfaction: number;
  };
}

// ===== TYPES NOTIFICATIONS =====
export interface ColisNotification {
  id: string;
  type: 'status_update' | 'delivery_reminder' | 'pickup_reminder' | 'issue_alert';
  colisId: string;
  trackingNumber: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type ColisNotificationResponse = ApiResponse<ColisNotification[]>;

// Tous les types sont déjà exportés individuellement ci-dessus 