import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import FloatingPager from "@/components/ui/floating-pager";
import MenuFilters from "./MenuFilters";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
  dietary_preferences: string[];
  category: string;
  cuisine_type: string;
  customization_options: any;
  popularity_score: number;
  restaurant_id: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 6;

const MenuList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "" as "price_asc" | "price_desc" | "popularity" | "",
  });

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

  const { data: categories } = useQuery({
    queryKey: ['menuCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      return uniqueCategories.filter(Boolean);
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

  const handleFavorite = async (itemId: string) => {
    addToFavoritesMutation.mutate(itemId);
  };

  const handleRate = async (itemId: string, rating: number) => {
    addRatingMutation.mutate({ itemId, rating });
  };

  if (isLoading) {
    return <div>Chargement des plats...</div>;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = menuItems?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="relative min-h-screen">
      <MenuFilters
        categories={categories || []}
        onFilterChange={setFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {paginatedItems?.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {item.image_url && (
              <div className="relative">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => handleFavorite(item.id)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => handleRate(item.id, star)}
                        fill={star <= (item.popularity_score || 0) / 20 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-lg font-bold">{item.price / 100}€</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.dietary_preferences?.map((pref) => (
                  <Badge key={pref} variant="outline">{pref}</Badge>
                ))}
                {item.category && (
                  <Badge variant="secondary">{item.category}</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {menuItems && menuItems.length > ITEMS_PER_PAGE && (
        <FloatingPager
          totalItems={menuItems.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MenuList;