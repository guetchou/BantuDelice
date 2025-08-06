
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';
import { toast } from 'sonner';
import { MenuItem } from '@/types/menu';
import { Favorite } from '@/types/favorite';

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await apiService.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          menu_item_id,
          menu_items (
            id,
            name,
            description,
            price,
            image_url,
            restaurant_id,
            category
          ),
          restaurants:menu_items(restaurants(
            id,
            name
          ))
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    meta: {
      errorMessage: "Impossible de charger vos favoris"
    }
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (menuItemId: string) => {
      const { data: { user } } = await apiService.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('favorites')
        .insert([
          { menu_item_id: menuItemId, user_id: user.id }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success("Ajouté aux favoris");
    },
    onError: (error) => {
      console.error('Error adding favorite:', error);
      toast.error("Erreur lors de l'ajout aux favoris");
    }
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success("Retiré des favoris");
    },
    onError: (error) => {
      console.error('Error removing favorite:', error);
      toast.error("Erreur lors du retrait des favoris");
    }
  });

  const isFavorite = (menuItemId: string) => {
    return favorites?.some(favorite => favorite.menu_item_id === menuItemId) || false;
  };

  const addFavorite = (menuItemId: string) => {
    addFavoriteMutation.mutate(menuItemId);
  };

  const removeFavorite = (favoriteId: string) => {
    removeFavoriteMutation.mutate(favoriteId);
  };

  const toggleFavorite = (menuItem: MenuItem) => {
    const found = favorites?.find(fav => fav.menu_item_id === menuItem.id);
    if (found) {
      removeFavorite(found.id);
    } else {
      addFavorite(menuItem.id);
    }
  };

  return {
    favorites,
    isLoading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
};
