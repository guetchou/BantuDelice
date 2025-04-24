
import { ApiResponse } from '@/types/restaurant';

// Voici une API fictive pour les restaurants
export const restaurantApi = {
  // Méthodes existantes
  getAll: async (filters?: any): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return { data: [] };
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return { 
      id, 
      name: 'Restaurant Test',
      address: '123 Rue de Test',
      is_open: true,
      average_rating: 4.5
    };
  },

  getMenuItems: async (restaurantId: string): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return [];
  },

  getMenu: async (restaurantId: string): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return [];
  },

  // Ajout des méthodes manquantes
  updateMenuItemAvailability: async (itemId: string, available: boolean): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return { success: true };
  },

  updateMenuItemStock: async (itemId: string, stock: number): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return { success: true };
  },

  // Méthodes manquantes pour gérer les statuts des restaurants
  updateStatus: async (restaurantId: string, statusData: any): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return { success: true };
  },

  // Méthodes manquantes pour les heures spéciales
  getSpecialHours: async (restaurantId: string): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return [];
  },

  setSpecialHours: async (restaurantId: string, specialHoursData: any): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return { success: true };
  },

  deleteSpecialHours: async (restaurantId: string, specialHoursId: string): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    return { success: true };
  }
};
