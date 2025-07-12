import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "./types";

interface MenuFilters {
  search: string;
  category: string;
  sortBy: "price_asc" | "price_desc" | "popularity" | "";
}

export const useMenuItems = (filters: MenuFilters) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems', filters],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('available', true);

      if (filters.search) {
        query = query.textSearch('search_vector', filters.search);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popularity':
          query = query.order('popularity_score', { ascending: false });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as MenuItem[];
    }
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('favorites')
        .upsert([
          {
            user_id: session.session.user.id,
            menu_item_id: itemId,
          }
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Ajouté aux favoris",
        description: "Le plat a été ajouté à vos favoris",
      });
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout aux favoris",
        variant: "destructive",
      });
    }
  });

  const addRatingMutation = useMutation({
    mutationFn: async ({ itemId, rating }: { itemId: string; rating: number }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('ratings')
        .upsert([
          {
            user_id: session.session.user.id,
            menu_item_id: itemId,
            rating,
          }
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Note ajoutée",
        description: "Votre note a été enregistrée",
      });
    },
    onError: (error) => {
      console.error('Error adding rating:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la note",
        variant: "destructive",
      });
    }
  });

  return {
    menuItems,
    isLoading,
    addToFavorites: addToFavoritesMutation.mutate,
    addRating: addRatingMutation.mutate,
  };
};