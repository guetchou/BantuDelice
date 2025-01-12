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
  const { data: featuredItems, isLoading } = useQuery({
    queryKey: ['featuredItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_items')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as FeaturedItem[];
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
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
    <section className="py-12 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          En Vedette
        </h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {featuredItems?.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-4 h-full hover:shadow-lg transition-shadow cursor-pointer" 
                      onClick={() => handleItemClick(item)}>
                  {item.image_url && (
                    <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  )}
                  <Button className="w-full">
                    {item.type === 'restaurant' ? 'Voir le menu' : 'En savoir plus'}
                  </Button>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedCarousel;