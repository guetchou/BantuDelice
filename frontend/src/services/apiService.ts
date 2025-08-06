const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Token management methods
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: LoginRequest) {
    const response = await this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async register(userData: RegisterRequest) {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<User> {
    const token = this.getToken();
    if (!token) throw new Error('No token available');
    
    return this.request<User>('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const token = this.getToken();
    if (!token) throw new Error('No token available');
    
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // Restaurant methods
  async getRestaurants(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/restaurants${queryParams}`);
  }

  async getRestaurant(id: string) {
    return this.request(`/restaurants/${id}`);
  }

  // Menu methods
  async getMenuItems(restaurantId: string, filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/restaurants/${restaurantId}/menu${queryParams}`);
  }

  // Order methods
  async getOrders(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/orders${queryParams}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Colis methods
  async getColis(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/colis${queryParams}`);
  }

  async getColisByTracking(trackingNumber: string) {
    return this.request(`/colis/tracking/${trackingNumber}`);
  }

  // User methods
  async getUsers(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/users${queryParams}`);
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Notification methods
  async getNotifications(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/notifications${queryParams}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Payment methods
  async getPayments(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/payments${queryParams}`);
  }

  async createPayment(data: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPayment(id: string) {
    return this.request(`/payments/${id}`);
  }

  // Driver methods
  async getDrivers(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/drivers${queryParams}`);
  }

  async getDriver(id: string) {
    return this.request(`/drivers/${id}`);
  }

  async createDriver(data: any) {
    return this.request('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDriver(id: string, data: any) {
    return this.request(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDriver(id: string) {
    return this.request(`/drivers/${id}`, {
      method: 'DELETE',
    });
  }

  // Feature flags
  async getFeatureFlags() {
    return this.request('/feature-flags');
  }

  async updateFeatureFlag(id: string, data: any) {
    return this.request(`/feature-flags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createFeatureFlag(data: any) {
    return this.request('/feature-flags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteFeatureFlag(id: string) {
    return this.request(`/feature-flags/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload
  async uploadFile(file: File, path: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    return this.request('/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
  }

  // WebSocket subscription (mock)
  subscribeToChannel(channel: string, callback: (data: any) => void) {
    console.log(`Subscribing to channel: ${channel}`);
    // Mock implementation - in real app, this would connect to WebSocket
    return () => {
      console.log(`Unsubscribing from channel: ${channel}`);
    };
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService; 