const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  // Auth methods with proper types
  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    const token = this.getToken();
    if (!token) throw new Error('No token available');
    
    return this.request('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateUser(id: string, userData: any) {
    const token = this.getToken();
    if (!token) throw new Error('No token available');
    
    return this.request(`/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
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
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async signOut() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Restaurant methods
  async getRestaurants(filters?: unknown) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/restaurants${queryParams}`);
  }

  async getRestaurant(id: string) {
    return this.request(`/restaurants/${id}`);
  }

  async createRestaurant(data: unknown) {
    return this.request('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRestaurant(id: string, data: unknown) {
    return this.request(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRestaurant(id: string) {
    return this.request(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  // Menu methods
  async getMenuItems(restaurantId: string, filters?: unknown) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/restaurants/${restaurantId}/menu${queryParams}`);
  }

  async createMenuItem(restaurantId: string, data: unknown) {
    return this.request(`/restaurants/${restaurantId}/menu`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(restaurantId: string, itemId: string, data: unknown) {
    return this.request(`/restaurants/${restaurantId}/menu/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(restaurantId: string, itemId: string) {
    return this.request(`/restaurants/${restaurantId}/menu/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async getOrders(filters?: unknown) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/orders${queryParams}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: unknown) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id: string, data: unknown) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Tracking methods
  async getTrackingInfo(trackingNumber: string) {
    return this.request(`/tracking/${trackingNumber}`);
  }

  async startTracking(trackingNumber: string, driverId?: string) {
    return this.request(`/tracking/start/${trackingNumber}`, {
      method: 'POST',
      body: JSON.stringify({ driverId }),
    });
  }

  async updateLocation(trackingNumber: string, locationData: unknown) {
    return this.request(`/tracking/${trackingNumber}/location`, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  async stopTracking(trackingNumber: string) {
    return this.request(`/tracking/stop/${trackingNumber}`, {
      method: 'POST',
    });
  }

  // Colis methods
  async getColis(filters?: unknown) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/colis${queryParams}`);
  }

  async getColisByTracking(trackingNumber: string) {
    return this.request(`/colis/by-tracking/${trackingNumber}`);
  }

  async createColis(data: unknown) {
    return this.request('/colis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateColis(id: string, data: unknown) {
    return this.request(`/colis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteColis(id: string) {
    return this.request(`/colis/${id}`, {
      method: 'DELETE',
    });
  }

  // User methods
  async getUsers(filters?: unknown) {
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
  async getNotifications(filters?: unknown) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/notifications${queryParams}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async deleteNotification(id: string) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment methods
  async getPayments(filters?: unknown) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/payments${queryParams}`);
  }

  async createPayment(data: unknown) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPayment(id: string) {
    return this.request(`/payments/${id}`);
  }

  // Driver methods
  async getDrivers(filters?: unknown) {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`/drivers${queryParams}`);
  }

  async getDriver(id: string) {
    return this.request(`/drivers/${id}`);
  }

  async createDriver(data: unknown) {
    return this.request('/drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDriver(id: string, data: unknown) {
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

  // Feature flags methods
  async getFeatureFlags() {
    return this.request('/feature-flags');
  }

  async updateFeatureFlag(id: string, data: unknown) {
    return this.request(`/feature-flags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createFeatureFlag(data: unknown) {
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

  // Utility methods
  async uploadFile(file: File, path: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    return this.request('/upload', {
      method: 'POST',
      headers: Record<string, unknown>, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // Real-time subscriptions (WebSocket-like)
  subscribeToChannel(channel: string, callback: (data: unknown) => void) {
    // For now, we'll use polling. In the future, this could be WebSocket
    const interval = setInterval(async () => {
      try {
        const data = await this.request(`/realtime/${channel}`);
        callback(data);
      } catch (error) {
        console.error('Subscription error:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }
}

export const apiService = new ApiService();
export default apiService; 
