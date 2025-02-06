import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database } from '@/integrations/supabase/database.types';

type FavoriteItem = Database['public']['Tables']['favorites']['Row'];

const FavoritesList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      console.log('Fetching favorites');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          menu_item_id,
          menu_item:menu_items (
            id,
            name,
            description,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as FavoriteItem[];
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
      toast({
        title: "Favori supprimé",
        description: "Le plat a été retiré de vos favoris",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Chargement de vos favoris...</div>
      </div>
    );
  }

  if (!favorites?.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Vous n'avez pas encore de favoris</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes Favoris</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video">
              <img 
                src={favorite.menu_item.image_url || 'default-food-image.jpg'} 
                alt={favorite.menu_item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{favorite.menu_item.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{favorite.menu_item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">
                  {favorite.menu_item.price.toLocaleString()} FCFA
                </span>
                <Button 
                  variant="destructive"
                  onClick={() => removeFavoriteMutation.mutate(favorite.id)}
                >
                  Retirer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
