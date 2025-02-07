
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Tag, Clock, Percent } from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  end_date: string;
  restaurant: {
    name: string;
    banner_image_url: string;
  };
}

const RestaurantPromotions = () => {
  const navigate = useNavigate();
  
  const { data: promotions, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_promotions')
        .select(`
          *,
          restaurant:restaurants(name, banner_image_url)
        `)
        .eq('active', true)
        .gt('end_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Promotion[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!promotions?.length) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Offres Spéciales
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ 
                  backgroundImage: `url(${promo.restaurant.banner_image_url || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'})` 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold">{promo.restaurant.name}</h3>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{promo.title}</h4>
                  {promo.discount_type === 'percentage' && (
                    <span className="flex items-center text-orange-500">
                      <Percent className="w-4 h-4 mr-1" />
                      {promo.discount_value}%
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">{promo.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDistance(new Date(promo.end_date), new Date(), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    {promo.discount_type === 'free_delivery' 
                      ? 'Livraison gratuite'
                      : promo.discount_type === 'fixed_amount'
                      ? `${promo.discount_value} FCFA`
                      : `${promo.discount_value}% de réduction`
                    }
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/restaurant/${promo.restaurant_id}`)}
                >
                  Voir le menu
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantPromotions;
