import { colisConfig } from '@/config/colisConfig';
import { apiClient, type ApiResponse } from '@/services/apiClient';
import { environment } from '@/config/environment';
import type { 
  PaginatedResponse as GlobalPaginatedResponse
} from '@/types/global';
import type { 
  ColisData,
  CreateColisRequest as GlobalCreateColisRequest,
  UpdateColisRequest as GlobalUpdateColisRequest,
  ColisFilters,
  ColisSearchParams,
  ColisStats,
  ColisNotification
} from '@/types/colis';

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
  private apiKey?: string;

  constructor() {
    this.apiKey = import.meta.env?.VITE_COLIS_API_KEY;
  }

  // Méthodes de base utilisant le client API centralisé
  async createColis(data: CreateColisRequest): Promise<ApiResponse<ColisApiData>> {
    return apiClient.post<ColisApiData>('/colis', data);
  }

  async getColis(id: string): Promise<ApiResponse<ColisApiData>> {
    return apiClient.get<ColisApiData>(`/colis/${id}`);
  }

  async updateColis(id: string, data: UpdateColisRequest): Promise<ApiResponse<ColisApiData>> {
    return apiClient.put<ColisApiData>(`/colis/${id}`, data);
  }

  async deleteColis(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/colis/${id}`);
  }

  async listColis(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<ApiResponse<{ colis: ColisApiData[]; total: number; page: number; limit: number }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    const endpoint = `/colis${query ? `?${query}` : ''}`;
    
    return apiClient.get<{ colis: ColisApiData[]; total: number; page: number; limit: number }>(endpoint);
  }

  async trackColis(trackingNumber: string): Promise<ApiResponse<TrackingResponse>> {
    return apiClient.get<TrackingResponse>(`/colis/tracking/${trackingNumber}`);
  }

  async updateTracking(id: string, event: Omit<TrackingEvent, 'id'>): Promise<ApiResponse<TrackingEvent>> {
    return apiClient.post<TrackingEvent>(`/colis/${id}/tracking`, event);
  }

  async calculatePricing(data: PricingRequest): Promise<ApiResponse<PricingResponse>> {
    return apiClient.post<PricingResponse>('/colis/pricing', data);
  }

  async getPricingList(): Promise<ApiResponse<Record<string, number>>> {
    return apiClient.get<Record<string, number>>('/colis/pricing');
  }

  async getNotifications(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: string;
  }): Promise<ApiResponse<{ notifications: NotificationApiData[]; total: number; unread: number }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.read !== undefined) searchParams.append('read', params.read.toString());
    if (params?.type) searchParams.append('type', params.type);

    const query = searchParams.toString();
    const endpoint = `/colis/notifications${query ? `?${query}` : ''}`;
    
    return apiClient.get<{ notifications: NotificationApiData[]; total: number; unread: number }>(endpoint);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`/colis/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return apiClient.patch<void>('/colis/notifications/read-all');
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/colis/notifications/${id}`);
  }

  async getStats(period?: string): Promise<ApiResponse<StatsApiData>> {
    const endpoint = period ? `/colis/stats?period=${period}` : '/colis/stats';
    return apiClient.get<StatsApiData>(endpoint);
  }

  async getAnalytics(params?: {
    period?: string;
    type?: string;
    city?: string;
  }): Promise<ApiResponse<unknown>> {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.append('period', params.period);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.city) searchParams.append('city', params.city);

    const query = searchParams.toString();
    const endpoint = `/colis/analytics${query ? `?${query}` : ''}`;
    
    return apiClient.get<unknown>(endpoint);
  }

  // Méthodes de paiement
  async initiatePayment(colisId: string, paymentData: {
    method: 'momo' | 'airtel' | 'card' | 'cash';
    amount: number;
    phoneNumber?: string;
  }): Promise<ApiResponse<{ paymentId: string; status: string; redirectUrl?: string }>> {
    return apiClient.post<{ paymentId: string; status: string; redirectUrl?: string }>(`/payments/initiate`, {
      colisId,
      ...paymentData
    });
  }

  async processPayment(paymentData: {
    amount: number;
    method: string;
    phoneNumber: string;
    orderId: string;
    description: string;
  }): Promise<ApiResponse<{ transactionId: string; status: string; amount: number }>> {
    return apiClient.post<{ transactionId: string; status: string; amount: number }>('/payments/process', paymentData);
  }

  // Méthodes d'expédition
  async createExpedition(expeditionData: any): Promise<ApiResponse<{ trackingNumber: string; success: boolean }>> {
    return apiClient.post<{ trackingNumber: string; success: boolean }>('/colis/expedier', expeditionData);
  }

  async sendNotification(notificationData: {
    trackingNumber: string;
    recipientEmail?: string;
    recipientPhone?: string;
    type: string;
    message: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/colis/notifications/send', notificationData);
  }

  async sendExpeditionNotification(notificationData: {
    trackingNumber: string;
    senderPhone: string;
    senderEmail?: string;
    recipientPhone: string;
    recipientEmail?: string;
    fromCity: string;
    toCity: string;
    amount: number;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/colis/notifications/send', notificationData);
  }

  // Méthodes utilitaires
  async uploadImage(colisId: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiClient.post<{ imageUrl: string }>(`/colis/${colisId}/upload`, formData, {
      headers: {
        // Ne pas définir Content-Type pour FormData
      }
    });
  }

  async downloadLabel(colisId: string): Promise<Blob> {
    const response = await fetch(`${environment.api.baseUrl}/colis/${colisId}/label`, {
      method: 'GET',
      headers: {
        'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du téléchargement: ${response.statusText}`);
    }

    return response.blob();
  }

  // Méthode de simulation pour les tests
  async simulateApiCall<T>(data: T, delay: number = 1000): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data,
        });
      }, delay);
    });
  }
}

// Instance singleton
export const colisApi = new ColisApiService(); 