import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Restaurant, BusinessHours, MenuItem, RestaurantFilters } from '@/types/restaurant';

export const restaurantService = {
  // Get all restaurants with optional filters
  getAllRestaurants: async (filters?: RestaurantFilters): Promise<Restaurant[]> => {
    try {
      console.log('Fetching restaurants with filters:', filters);
      
      let query = supabase
        .from('restaurants')
        .select('*');

      if (filters) {
        // Apply cuisine type filter if provided
        if (filters.cuisine && filters.cuisine.length > 0) {
          query = query.in('cuisine_type', filters.cuisine);
        }
        
        // Apply rating filter if provided
        if (filters.rating) {
          query = query.gte('average_rating', filters.rating);
        }
        
        // Apply open now filter if provided
        if (filters.openNow) {
          query = query.eq('is_open', true);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
      }

      return data as Restaurant[];
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de charger les restaurants');
      return [];
    }
  },

  // Get a single restaurant by ID
  getRestaurantById: async (id: string): Promise<Restaurant | null> => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      // Parse business hours from JSON if needed
      let businessHours: BusinessHours;
      try {
        if (data.business_hours) {
          businessHours = typeof data.business_hours === 'string' 
            ? JSON.parse(data.business_hours)
            : data.business_hours as unknown as BusinessHours;
          
          data.business_hours = businessHours;
        }
      } catch (e) {
        console.error("Error parsing business hours:", e);
      }

      return data as Restaurant;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de charger les détails du restaurant');
      return null;
    }
  },

  // Get menu items for a restaurant
  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }

      return data as MenuItem[];
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de charger le menu');
      return [];
    }
  },

  // Update restaurant details
  updateRestaurant: async (id: string, restaurantData: Partial<Restaurant>): Promise<Restaurant | null> => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update(restaurantData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating restaurant:', error);
        throw error;
      }

      toast.success('Restaurant mis à jour avec succès');
      return data as Restaurant;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de mettre à jour le restaurant');
      return null;
    }
  },

  // Create a menu item
  createMenuItem: async (menuItem: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem | null> => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          ...menuItem,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating menu item:', error);
        throw error;
      }

      toast.success('Plat ajouté avec succès');
      return data as MenuItem;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible d\'ajouter le plat');
      return null;
    }
  },

  // Update a menu item
  updateMenuItem: async (id: string, menuItemData: Partial<MenuItem>): Promise<MenuItem | null> => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(menuItemData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating menu item:', error);
        throw error;
      }

      toast.success('Plat mis à jour avec succès');
      return data as MenuItem;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de mettre à jour le plat');
      return null;
    }
  },

  // Delete a menu item
  deleteMenuItem: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting menu item:', error);
        throw error;
      }

      toast.success('Plat supprimé avec succès');
      return true;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de supprimer le plat');
      return false;
    }
  },

  // Update restaurant status
  updateStatus: async (id: string, isOpen: boolean): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update({ is_open: isOpen })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating restaurant status:', error);
        throw error;
      }

      toast.success('Statut du restaurant mis à jour');
      return data;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de mettre à jour le statut du restaurant');
      return null;
    }
  },

  // Get special hours for a restaurant
  getSpecialHours: async (restaurantId: string): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('special_hours')
        .eq('id', restaurantId)
        .single();

      if (error) {
        console.error('Error fetching special hours:', error);
        throw error;
      }

      return data.special_hours || {};
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de charger les heures spéciales');
      return {};
    }
  },

  // Set special hours for a restaurant
  setSpecialHours: async (restaurantId: string, specialHours: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update({ special_hours: specialHours })
        .eq('id', restaurantId)
        .select();

      if (error) {
        console.error('Error updating special hours:', error);
        throw error;
      }

      toast.success('Heures spéciales mises à jour');
      return data;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de mettre à jour les heures spéciales');
      return null;
    }
  },
  
  // Delete special hours for a restaurant
  deleteSpecialHours: async (restaurantId: string, dateKey: string): Promise<any> => {
    try {
      // First get the current special hours
      const { data: currentData, error: fetchError } = await supabase
        .from('restaurants')
        .select('special_hours')
        .eq('id', restaurantId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Remove the specific date from special hours
      const specialHours = currentData.special_hours || {};
      delete specialHours[dateKey];
      
      // Update with the modified special_hours
      const { data, error } = await supabase
        .from('restaurants')
        .update({ special_hours: specialHours })
        .eq('id', restaurantId)
        .select();

      if (error) throw error;

      toast.success('Heures spéciales supprimées');
      return data;
    } catch (err) {
      console.error('Restaurant service error:', err);
      toast.error('Impossible de supprimer les heures spéciales');
      return null;
    }
  }
};
