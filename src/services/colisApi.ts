import { colisConfig } from '@/config/colisConfig';

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ColisApiData {
  id: string;
  trackingNumber: string;
  status: string;
  sender: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
  };
  recipient: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
  };
  package: {
    type: string;
    weight: number;
    dimensions?: string;
    description: string;
    value?: number;
  };
  service: {
    type: string;
    insurance: boolean;
    fragile: boolean;
    express: boolean;
  };
  pricing: {
    basePrice: number;
    insuranceFee: number;
    expressFee: number;
    totalPrice: number;
  };
  tracking: {
    events: TrackingEvent[];
    estimatedDelivery: string;
    currentLocation?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: 'package' | 'truck' | 'check' | 'alert';
}

export interface CreateColisRequest {
  sender: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
  };
  recipient: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
  };
  package: {
    type: string;
    weight: number;
    dimensions?: string;
    description: string;
    value?: number;
  };
  service: {
    type: string;
    insurance: boolean;
    fragile: boolean;
    express: boolean;
  };
}

export interface UpdateColisRequest {
  status?: string;
  currentLocation?: string;
  events?: TrackingEvent[];
}

export interface TrackingResponse {
  colis: ColisApiData;
  events: TrackingEvent[];
  estimatedDelivery: string;
}

export interface PricingRequest {
  from: string;
  to: string;
  weight: number;
  type: string;
  insurance: boolean;
  express: boolean;
}

export interface PricingResponse {
  basePrice: number;
  insuranceFee: number;
  expressFee: number;
  totalPrice: number;
  estimatedDays: number;
}

export interface NotificationApiData {
  id: string;
  type: 'delivery' | 'update' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  colisId?: string;
  action?: {
    label: string;
    url: string;
  };
}

export interface StatsApiData {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  pending: number;
  totalRevenue: number;
  thisMonth: number;
  national: number;
  international: number;
  growthRate: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
}

// Classe principale pour l'API Colis
class ColisApiService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = colisConfig.api.baseUrl;
    this.apiKey = import.meta.env?.VITE_COLIS_API_KEY;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      defaultHeaders['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Méthodes pour les colis
  async createColis(data: CreateColisRequest): Promise<ApiResponse<ColisApiData>> {
    return this.request<ColisApiData>(colisConfig.api.endpoints.colis, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getColis(id: string): Promise<ApiResponse<ColisApiData>> {
    return this.request<ColisApiData>(`${colisConfig.api.endpoints.colis}/${id}`);
  }

  async updateColis(id: string, data: UpdateColisRequest): Promise<ApiResponse<ColisApiData>> {
    return this.request<ColisApiData>(`${colisConfig.api.endpoints.colis}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteColis(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`${colisConfig.api.endpoints.colis}/${id}`, {
      method: 'DELETE',
    });
  }

  async listColis(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<ApiResponse<{ colis: ColisApiData[]; total: number; page: number; limit: number }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${colisConfig.api.endpoints.colis}?${queryString}` : colisConfig.api.endpoints.colis;
    
    return this.request<{ colis: ColisApiData[]; total: number; page: number; limit: number }>(endpoint);
  }

  // Méthodes pour le suivi
  async trackColis(trackingNumber: string): Promise<ApiResponse<TrackingResponse>> {
    return this.request<TrackingResponse>(`${colisConfig.api.endpoints.tracking}/${trackingNumber}`);
  }

  async updateTracking(id: string, event: Omit<TrackingEvent, 'id'>): Promise<ApiResponse<TrackingEvent>> {
    return this.request<TrackingEvent>(`${colisConfig.api.endpoints.tracking}/${id}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  // Méthodes pour les tarifs
  async calculatePricing(data: PricingRequest): Promise<ApiResponse<PricingResponse>> {
    return this.request<PricingResponse>(colisConfig.api.endpoints.tarifs, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPricingList(): Promise<ApiResponse<Record<string, number>>> {
    return this.request<Record<string, number>>(colisConfig.api.endpoints.tarifs);
  }

  // Méthodes pour les notifications
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: string;
  }): Promise<ApiResponse<{ notifications: NotificationApiData[]; total: number; unread: number }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${colisConfig.api.endpoints.notifications}?${queryString}` : colisConfig.api.endpoints.notifications;
    
    return this.request<{ notifications: NotificationApiData[]; total: number; unread: number }>(endpoint);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`${colisConfig.api.endpoints.notifications}/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<void>(`${colisConfig.api.endpoints.notifications}/read-all`, {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`${colisConfig.api.endpoints.notifications}/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthodes pour les statistiques
  async getStats(period?: string): Promise<ApiResponse<StatsApiData>> {
    const endpoint = period ? `${colisConfig.api.endpoints.colis}/stats?period=${period}` : `${colisConfig.api.endpoints.colis}/stats`;
    return this.request<StatsApiData>(endpoint);
  }

  async getAnalytics(params?: {
    period?: string;
    type?: string;
    city?: string;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `${colisConfig.api.endpoints.colis}/analytics?${queryString}` : `${colisConfig.api.endpoints.colis}/analytics`;
    
    return this.request<any>(endpoint);
  }

  // Méthodes pour les paiements
  async initiatePayment(colisId: string, paymentData: {
    method: 'momo' | 'airtel' | 'card' | 'cash';
    amount: number;
    phoneNumber?: string;
  }): Promise<ApiResponse<{ paymentId: string; status: string; redirectUrl?: string }>> {
    return this.request<{ paymentId: string; status: string; redirectUrl?: string }>(`${colisConfig.api.endpoints.colis}/${colisId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async checkPaymentStatus(paymentId: string): Promise<ApiResponse<{ status: string; amount: number; method: string }>> {
    return this.request<{ status: string; amount: number; method: string }>(`${colisConfig.api.endpoints.colis}/payment/${paymentId}/status`);
  }

  // Méthodes utilitaires
  async uploadImage(colisId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<{ imageUrl: string }>(`${colisConfig.api.endpoints.colis}/${colisId}/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        // Ne pas définir Content-Type pour FormData
      },
    });
  }

  async downloadLabel(colisId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}${colisConfig.api.endpoints.colis}/${colisId}/label`, {
      headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
    });

    if (!response.ok) {
      throw new Error(`Failed to download label: ${response.status}`);
    }

    return response.blob();
  }

  // Méthodes de simulation pour le développement
  async simulateApiCall<T>(data: T, delay: number = 1000): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data,
          message: 'Simulation successful',
        });
      }, delay);
    });
  }
}

// Instance singleton
export const colisApi = new ColisApiService();

// Export des types pour utilisation externe
export type {
  ColisApiData,
  CreateColisRequest,
  UpdateColisRequest,
  TrackingResponse,
  PricingRequest,
  PricingResponse,
  NotificationApiData,
  StatsApiData,
}; 