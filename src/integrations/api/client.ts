
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  is_open?: boolean;
}

const apiClient = {
  restaurants: {
    getAll: async (filters?: any): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: [], 
        success: true 
      };
    },
    
    getById: async (id: string): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: {
          id,
          name: 'Restaurant Name',
          is_open: true,
          status: 'open'
        }, 
        success: true,
        is_open: true
      };
    },
    
    getMenuItems: async (restaurantId: string): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: [], 
        success: true 
      };
    },
    
    getMenu: async (restaurantId: string): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: [], 
        success: true 
      };
    },
    
    updateMenuItemAvailability: async (itemId: string, available: boolean): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: { id: itemId, available }, 
        success: true 
      };
    },
    
    updateMenuItemStock: async (itemId: string, inStock: number): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: { id: itemId, in_stock: inStock }, 
        success: true 
      };
    },
    
    updateStatus: async (restaurantId: string, status: any): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: { id: restaurantId, ...status }, 
        success: true 
      };
    },
    
    getSpecialHours: async (restaurantId: string, params: any): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: [], 
        success: true 
      };
    },
    
    setSpecialHours: async (restaurantId: string, hours: any): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: { id: restaurantId, ...hours }, 
        success: true 
      };
    },
    
    deleteSpecialHours: async (restaurantId: string, hoursId: string): Promise<ApiResponse<any>> => {
      // Mock implementation
      return { 
        data: { id: hoursId, deleted: true }, 
        success: true 
      };
    }
  }
};

export default apiClient;
