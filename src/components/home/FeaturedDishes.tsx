
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createApi } from 'unsplash-js';

// Initialize the Unsplash client
const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
console.log('Unsplash Access Key in FeaturedDishes:', unsplashAccessKey ? 'Present' : 'Missing');

const unsplash = createApi({
  accessKey: unsplashAccessKey || '',
  // Ajout des headers d'authentification explicites
  headers: {
    Authorization: `Client-ID ${unsplashAccessKey}`
  }
});

interface FeaturedDish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

const FeaturedDishes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: featuredDishes, isLoading } = useQuery({
    queryKey: ['featuredDishes'],
    queryFn: async () => {
      console.log('Fetching featured dishes');
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('popularity_score', { ascending: false })
        .limit(6);
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les plats en vedette",
          variant: "destructive",
        });
        throw error;
      }

      if (!unsplashAccessKey) {
        console.error('Unsplash API key is missing');
        return data as FeaturedDish[];
      }

      try {
        // Fetch food images from Unsplash with proper error handling
        const foodPhotos = await unsplash.search.getPhotos({
          query: 'african food dish cuisine',
          perPage: 6,
        });

        if (foodPhotos.errors) {
          console.error('Unsplash API errors:', foodPhotos.errors);
          // Return dishes without images rather than failing
          return data as FeaturedDish[];
        }

        return data?.map((dish, index) => ({
          ...dish,
          image_url: foodPhotos.response?.results[index]?.urls.regular || null
        })) as FeaturedDish[];
      } catch (error) {
        console.error('Error fetching Unsplash images:', error);
        toast({
          title: "Attention",
          description: "Impossible de charger les images des plats",
          variant: "destructive",
        });
        // Return dishes without images rather than failing completely
        return data as FeaturedDish[];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Chargement des plats...</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Plats en Vedette
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDishes?.map((dish) => (
            <Card 
              key={dish.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {dish.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={dish.image_url} 
                    alt={dish.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-600">
                    {dish.price.toLocaleString('fr-FR')} FCFA
                  </span>
                  <Button 
                    onClick={() => navigate(`/menu/${dish.id}`)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Commander
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;
