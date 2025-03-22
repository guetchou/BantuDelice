
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurantService';
import { Restaurant, RestaurantFilters, MenuItem } from '@/types/restaurant';

export const useRestaurantData = () => {
  const queryClient = useQueryClient();

  // Get all restaurants with optional filters
  const useRestaurants = (filters?: RestaurantFilters) => {
    return useQuery({
      queryKey: ['restaurants', filters],
      queryFn: () => restaurantService.getAllRestaurants(filters),
    });
  };

  // Get a single restaurant by ID
  const useRestaurant = (id?: string) => {
    return useQuery({
      queryKey: ['restaurant', id],
      queryFn: async () => {
        if (!id) throw new Error('Restaurant ID is required');
        return restaurantService.getRestaurantById(id);
      },
      enabled: !!id,
    });
  };

  // Get menu items for a restaurant
  const useMenuItems = (restaurantId?: string) => {
    return useQuery({
      queryKey: ['menu-items', restaurantId],
      queryFn: async () => {
        if (!restaurantId) throw new Error('Restaurant ID is required');
        return restaurantService.getMenuItems(restaurantId);
      },
      enabled: !!restaurantId,
    });
  };

  // Update restaurant details
  const useUpdateRestaurant = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Restaurant> }) => 
        restaurantService.updateRestaurant(id, data),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['restaurant', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      }
    });
  };

  // Create a menu item
  const useCreateMenuItem = () => {
    return useMutation({
      mutationFn: ({ menuItem }: { menuItem: Omit<MenuItem, 'id' | 'created_at'> }) => 
        restaurantService.createMenuItem(menuItem),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['menu-items', data.restaurant_id] });
        }
      }
    });
  };

  // Update a menu item
  const useUpdateMenuItem = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<MenuItem> }) => 
        restaurantService.updateMenuItem(id, data),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['menu-items', data.restaurant_id] });
        }
      }
    });
  };

  // Delete a menu item
  const useDeleteMenuItem = () => {
    return useMutation({
      mutationFn: (id: string) => restaurantService.deleteMenuItem(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      }
    });
  };

  return {
    useRestaurants,
    useRestaurant,
    useMenuItems,
    useUpdateRestaurant,
    useCreateMenuItem,
    useUpdateMenuItem,
    useDeleteMenuItem
  };
};
