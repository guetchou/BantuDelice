
import { useParams } from 'react-router-dom';
import { useSmartRecommendations } from '@/hooks/useSmartRecommendations';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';
import { MenuItem } from '@/types/menu';

export const RecommendationSection = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const { data: recommendations, isLoading } = useSmartRecommendations(restaurantId || '');
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Recommandations personnalisées</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
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

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Vous pourriez aussi aimer</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.slice(0, 3).map((item) => (
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
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">{item.price.toLocaleString()} FCFA</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => toggleFavorite(item)}
                    className={isFavorite(item.id) ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(item.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button 
                    onClick={() => handleAddToCart(item)}
                    size="icon"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
