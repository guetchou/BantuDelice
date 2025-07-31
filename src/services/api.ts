const API_BASE_URL = 'http://localhost:3001';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  CATERER = 'CATERER',
  BAKER = 'BAKER',
  GROCER = 'GROCER',
  PHARMACIST = 'PHARMACIST',
  CLEANER = 'CLEANER',
  LAUNDRY = 'LAUNDRY',
  BEAUTY_SALON = 'BEAUTY_SALON',
  BARBER = 'BARBER',
  FITNESS_TRAINER = 'FITNESS_TRAINER',
  TUTOR = 'TUTOR',
  TECHNICIAN = 'TECHNICIAN',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  MUSICIAN = 'MUSICIAN',
  TRANSLATOR = 'TRANSLATOR',
  LAWYER = 'LAWYER',
  ACCOUNTANT = 'ACCOUNTANT',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  role?: UserRole;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  permissions?: string[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  address: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginRequest) {
    return this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest) {
    return this.request<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request<User>('/auth/profile');
  }

  // Services endpoints
  async getServices(category?: string) {
    const params = category ? `?category=${category}` : '';
    return this.request<Service[]>(`/services${params}`);
  }

  async getService(id: string) {
    return this.request<Service>(`/services/${id}`);
  }

  // Orders endpoints
  async getOrders() {
    return this.request<Order[]>('/orders');
  }

  async getMyOrders() {
    return this.request<Order[]>('/orders/my-orders');
  }

  async createOrder(orderData: Partial<Order>) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Users endpoints
  async getUsers() {
    return this.request<User[]>('/users');
  }

  async updateUser(id: string, userData: Partial<User>) {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Payments endpoints
  async processPayment(paymentData: any) {
    return this.request<any>('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Notifications endpoints
  async sendSMS(phoneNumber: string, message: string) {
    return this.request<{ message: string }>('/notifications/sms', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, message }),
    });
  }

  async sendEmail(email: string, subject: string, message: string) {
    return this.request<{ message: string }>('/notifications/email', {
      method: 'POST',
      body: JSON.stringify({ email, subject, message }),
    });
  }
}

export const apiService = new ApiService(); 