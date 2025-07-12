
import { ApiResponse } from './base';
import { fetchWithAuth } from './base';
import { Restaurant } from '@/types/globalTypes';

export const restaurantApi = {
  // Existing methods with real implementations
  getAll: async (filters?: any): Promise<ApiResponse<Restaurant[]>> => {
    let queryParams = '';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      queryParams = `?${params.toString()}`;
    }
    return fetchWithAuth<Restaurant[]>(`/restaurants${queryParams}`);
  },
  
  getById: async (id: string): Promise<ApiResponse<Restaurant>> => {
    return fetchWithAuth<Restaurant>(`/restaurants/${id}`);
  },
  
  getMenuItems: async (restaurantId: string): Promise<ApiResponse<any[]>> => {
    return fetchWithAuth<any[]>(`/restaurants/${restaurantId}/menu-items`);
  },
  
  getMenu: async (restaurantId: string): Promise<ApiResponse<any[]>> => {
    return fetchWithAuth<any[]>(`/restaurants/${restaurantId}/menu`);
  },
  
  updateMenuItemAvailability: async (itemId: string, available: boolean): Promise<ApiResponse<any>> => {
    return fetchWithAuth(`/menu-items/${itemId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ available }),
    });
  },
  
  updateMenuItemStock: async (itemId: string, stock: number): Promise<ApiResponse<any>> => {
    return fetchWithAuth(`/menu-items/${itemId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    });
  },
  
  // Adding missing methods with real implementations
  updateStatus: async (restaurantId: string, isOpen: boolean): Promise<ApiResponse<any>> => {
    return fetchWithAuth(`/restaurants/${restaurantId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ is_open: isOpen }),
    });
  },
  
  getSpecialHours: async (restaurantId: string, params?: any): Promise<ApiResponse<any>> => {
    let queryParams = '';
    if (params) {
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) urlParams.append(key, String(value));
      });
      queryParams = `?${urlParams.toString()}`;
    }
    return fetchWithAuth(`/restaurants/${restaurantId}/special-hours${queryParams}`);
  },
  
  setSpecialHours: async (restaurantId: string, specialHours: any): Promise<ApiResponse<any>> => {
    return fetchWithAuth(`/restaurants/${restaurantId}/special-hours`, {
      method: 'POST',
      body: JSON.stringify(specialHours),
    });
  },
  
  deleteSpecialHours: async (restaurantId: string, day: string): Promise<ApiResponse<any>> => {
    return fetchWithAuth(`/restaurants/${restaurantId}/special-hours/${day}`, {
      method: 'DELETE',
    });
  }
};
