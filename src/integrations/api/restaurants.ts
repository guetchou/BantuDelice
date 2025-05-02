
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
      description: 'Description du restaurant test',
      is_open: true,
      phone: '+237 123456789',
      average_rating: 4.5,
      status: 'open'
    };
  },

  getMenuItems: async (restaurantId: string): Promise<ApiResponse<any[]>> => {
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
    console.log(`Updating status for restaurant ${restaurantId} to:`, statusData);
    return { success: true, is_open: statusData.is_open };
  },

  // Méthodes manquantes pour les heures spéciales
  getSpecialHours: async (restaurantId: string, filters?: any): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    console.log(`Getting special hours for restaurant ${restaurantId}`);
    return [
      { 
        id: '1', 
        restaurant_id: restaurantId,
        date: new Date().toISOString().split('T')[0], 
        is_closed: false,
        open_time: '08:00',
        close_time: '16:00',
        reason: 'Horaires spéciaux',
        created_at: new Date().toISOString()
      }
    ];
  },

  setSpecialHours: async (restaurantId: string, specialHoursData: any): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    console.log(`Setting special hours for restaurant ${restaurantId}`, specialHoursData);
    return { success: true, id: Date.now().toString() };
  },

  deleteSpecialHours: async (restaurantId: string, specialHoursId: string): Promise<ApiResponse<any>> => {
    // Simulation d'un appel API
    console.log(`Deleting special hours ${specialHoursId} for restaurant ${restaurantId}`);
    return { success: true };
  }
};
