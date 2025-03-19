
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { MenuItem } from '@/types/menu';
import { Skeleton } from "@/components/ui/skeleton";

const PersonalizedRecommendations = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['personalizedRecommendations'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Récupérer l'historique des commandes et préférences
        const { data: orderHistory } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .limit(10);

        // Récupérer les plats populaires similaires avec leur note moyenne
        const { data: menuItems } = await supabase
          .from('menu_items')
          .select(`
            *,
            ratings(rating)
          `)
          .order('popularity_score', { ascending: false })
          .limit(6);

        // Transformer les données pour inclure la note moyenne
        const recommendations = menuItems?.map(item => {
          const ratings = item.ratings as { rating: number }[] || [];
          const avgRating = ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
            : 0;

          return {
            ...item,
            ratings: undefined // Remove the ratings array as it's not part of MenuItem type
          } as MenuItem;
        }) || [];

        return recommendations;
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }
    }
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url || '',
      quantity: 1,
      restaurant_id: item.restaurant_id
    });
    
    toast.success(`${item.name} a été ajouté à votre panier`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Recommandations pour vous</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recommandations pour vous</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img 
                src={item.image_url || '/images/default-food.jpg'} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">{item.price.toLocaleString()} FCFA</span>
                <Button 
                  onClick={() => handleAddToCart(item)}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Commander
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
