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
      return data as FeaturedItem[];
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
    <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          En Vedette
        </h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {featuredItems.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 pl-6">
                <Card 
                  className="p-4 h-full hover:shadow-lg transition-all duration-300 cursor-pointer" 
                  onClick={() => handleItemClick(item)}
                >
                  {item.image_url && (
                    <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  )}
                  <Button className="w-full">
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
  );
};

export default FeaturedCarousel;