import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createApi } from 'unsplash-js';

// Initialize the Unsplash client
const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY
});

interface FeaturedItem {
  id: string;
  type: 'restaurant' | 'dish' | 'service';
  item_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  priority: number;
}

const FeaturedCarousel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: featuredItems, isLoading, error } = useQuery({
    queryKey: ['featuredItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_items')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false });
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les éléments en vedette",
          variant: "destructive",
        });
        throw error;
      }

      // Fetch random food images from Unsplash
      const foodPhotos = await unsplash.search.getPhotos({
        query: 'african food',
        perPage: 6,
      });

      // Fetch random restaurant images
      const restaurantPhotos = await unsplash.search.getPhotos({
        query: 'restaurant interior',
        perPage: 3,
      });

      // Fetch random service images
      const servicePhotos = await unsplash.search.getPhotos({
        query: 'food delivery service',
        perPage: 3,
      });

      // Enhance data with Unsplash images
      return data?.map((item, index) => ({
        ...item,
        image_url: item.type === 'dish' 
          ? foodPhotos.response?.results[index]?.urls.regular
          : item.type === 'restaurant'
            ? restaurantPhotos.response?.results[index % 3]?.urls.regular
            : servicePhotos.response?.results[index % 3]?.urls.regular
      })) as FeaturedItem[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Chargement...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !featuredItems) {
    return null;
  }

  const handleItemClick = (item: FeaturedItem) => {
    switch (item.type) {
      case 'restaurant':
        navigate(`/restaurant/${item.item_id}/menu`);
        break;
      case 'service':
        navigate(`/services/${item.item_id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-16">
      {/* Featured Items Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            En Vedette
          </h2>
          <Carousel className="w-full max-w-7xl mx-auto">
            <CarouselContent>
              {featuredItems.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 pl-6">
                  <Card 
                    className="group p-4 h-full hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm" 
                    onClick={() => handleItemClick(item)}
                  >
                    {item.image_url ? (
                      <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gradient-to-r from-orange-100 to-rose-100" />
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    )}
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white">
                      {item.type === 'restaurant' ? 'Voir le menu' : 'En savoir plus'}
                    </Button>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>
    </div>
  );
};

export default FeaturedCarousel;
