
import apiService from '@/services/api';
import { Restaurant, MenuItem, RestaurantFilters, MenuPromotion } from '@/types/restaurant';

// Define ApiResponse type
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const restaurantService = {
  // Get all restaurants with optional filters
  async getAll(filters?: RestaurantFilters): Promise<ApiResponse<Restaurant[]>> {
    try {
      let query = apiService.from('restaurants').select('*');

      // Apply filters if provided
      if (filters) {
        if (filters.cuisine) {
          query = query.in('cuisine_type', filters.cuisine);
        }
        
        if (filters.rating) {
          query = query.gte('average_rating', filters.rating);
        }
        
        if (filters.priceRange) {
          query = query.gte('price_range', filters.priceRange[0])
                       .lte('price_range', filters.priceRange[1]);
        }
        
        if (filters.openNow) {
          query = query.eq('is_open', true);
        }
        
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,cuisine_type.ilike.%${filters.search}%`);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return { data: null, error: error.message };
    }
  },

  // Alias for getAll to maintain compatibility
  async getAllRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
    const response = await this.getAll(filters);
    return response.data || [];
  },

  // Get a restaurant by ID
  async getById(id: string): Promise<ApiResponse<Restaurant>> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      return { data: null, error: error.message };
    }
  },

  // Alias for getById to maintain compatibility
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const response = await this.getById(id);
    return response.data;
  },

  // Get menu items for a restaurant
  async getMenuItems(restaurantId: string): Promise<ApiResponse<MenuItem[]>> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return { data: null, error: error.message };
    }
  },

  // Get menu items grouped by category
  async getMenu(restaurantId: string): Promise<ApiResponse<Record<string, MenuItem[]>>> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;

      // Group items by category
      const menu: Record<string, MenuItem[]> = {};
      data.forEach(item => {
        const category = item.category || 'Uncategorized';
        if (!menu[category]) {
          menu[category] = [];
        }
        menu[category].push(item);
      });

      return { data: menu, error: null };
    } catch (error) {
      console.error('Error fetching menu:', error);
      return { data: null, error: error.message };
    }
  },

  // Update menu item availability
  async updateMenuItemAvailability(itemId: string, available: boolean): Promise<ApiResponse<MenuItem>> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ available })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating menu item availability:', error);
      return { data: null, error: error.message };
    }
  },

  // Update menu item stock
  async updateMenuItemStock(itemId: string, stockLevel: number): Promise<ApiResponse<MenuItem>> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ stock_level: stockLevel })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating menu item stock:', error);
      return { data: null, error: error.message };
    }
  },

  // Update restaurant status (open/closed)
  async updateStatus(restaurantId: string, data: { is_open: boolean, reason?: string | null, estimated_reopening?: string | null }): Promise<ApiResponse<Restaurant>> {
    try {
      const { data: updatedData, error } = await supabase
        .from('restaurants')
        .update({ 
          is_open: data.is_open,
          status: data.is_open ? 'open' : 'closed',
          closure_reason: data.reason,
          estimated_reopening: data.estimated_reopening
        })
        .eq('id', restaurantId)
        .select()
        .single();

      if (error) throw error;

      return { data: updatedData, error: null };
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      return { data: null, error: error.message };
    }
  },

  // Get special hours for a restaurant
  async getSpecialHours(restaurantId: string): Promise<ApiResponse<unknown[]>> {
    try {
      const { data, error } = await supabase
        .from('restaurant_special_hours')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching special hours:', error);
      return { data: null, error: error.message };
    }
  },

  // Set special hours for a restaurant
  async setSpecialHours(restaurantId: string, specialHours: unknown): Promise<ApiResponse<unknown>> {
    try {
      const { data, error } = await supabase
        .from('restaurant_special_hours')
        .upsert({ 
          restaurant_id: restaurantId,
          ...specialHours
        })
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error setting special hours:', error);
      return { data: null, error: error.message };
    }
  },

  // Delete special hours for a restaurant
  async deleteSpecialHours(specialHoursId: string): Promise<ApiResponse<unknown>> {
    try {
      const { data, error } = await supabase
        .from('restaurant_special_hours')
        .delete()
        .eq('id', specialHoursId);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error deleting special hours:', error);
      return { data: null, error: error.message };
    }
  },

  // Update a restaurant
  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<ApiResponse<Restaurant>> {
    try {
      const { data: updatedData, error } = await supabase
        .from('restaurants')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data: updatedData, error: null };
    } catch (error) {
      console.error('Error updating restaurant:', error);
      return { data: null, error: error.message };
    }
  },

  // Create a new menu item
  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'created_at'>): Promise<ApiResponse<MenuItem>> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(menuItem)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating menu item:', error);
      return { data: null, error: error.message };
    }
  },

  // Update a menu item
  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> {
    try {
      const { data: updatedData, error } = await supabase
        .from('menu_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data: updatedData, error: null };
    } catch (error) {
      console.error('Error updating menu item:', error);
      return { data: null, error: error.message };
    }
  },

  // Delete a menu item
  async deleteMenuItem(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: null, error: null };
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return { data: null, error: error.message };
    }
  }
};

export default restaurantService;
