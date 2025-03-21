
import { apiRequest } from "./core";

// Restaurant functions
export const restaurantApi = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/restaurants${queryString}`, 'GET', null, false);
  },
  
  getById: async (id: string) => {
    return apiRequest(`/restaurants/${id}`, 'GET', null, false);
  },
  
  getMenu: async (id: string) => {
    return apiRequest(`/restaurants/${id}/menu`, 'GET', null, false);
  },
  
  // New methods for availability management
  updateMenuItemAvailability: async (itemId: string, available: boolean) => {
    return apiRequest(`/availability/menu-items/${itemId}`, 'PATCH', { available });
  },
  
  updateMenuItemStock: async (itemId: string, stockLevel: number) => {
    return apiRequest(`/availability/menu-items/${itemId}`, 'PATCH', { stock_level: stockLevel });
  },
  
  updateStatus: async (restaurantId: string, statusData: any) => {
    return apiRequest(`/availability/restaurants/${restaurantId}`, 'PATCH', statusData);
  },
  
  getSpecialHours: async (restaurantId: string, options: any = {}) => {
    const queryParams = new URLSearchParams();
    
    if (options.from_date) {
      queryParams.append('from_date', options.from_date);
    }
    
    if (options.to_date) {
      queryParams.append('to_date', options.to_date);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/availability/restaurants/${restaurantId}/special-hours${queryString}`, 'GET');
  },
  
  setSpecialHours: async (restaurantId: string, specialHours: any) => {
    return apiRequest(`/availability/restaurants/${restaurantId}/special-hours`, 'POST', specialHours);
  },
  
  deleteSpecialHours: async (restaurantId: string, specialHoursId: string) => {
    return apiRequest(`/availability/restaurants/${restaurantId}/special-hours/${specialHoursId}`, 'DELETE');
  }
};
