
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from 'sonner';

const FavoritesList = () => {
  const navigate = useNavigate();
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (favorite: any) => {
    const menuItem = favorite.menu_items;

    addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image_url: menuItem.image_url || '',
      quantity: 1,
      restaurant_id: menuItem.restaurant_id
    });
    
    toast.success(`${menuItem.name} a été ajouté à votre panier`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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

  if (!favorites?.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Heart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">Vous n'avez pas encore de favoris</h3>
        <p className="text-gray-500 mb-6">Explorez nos restaurants et ajoutez vos plats préférés à votre liste de favoris</p>
        <Button onClick={() => navigate('/restaurants')}>
          Explorer les restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img 
                src={favorite.menu_items.image_url || '/images/default-food.jpg'} 
                alt={favorite.menu_items.name}
                className="w-full h-full object-cover"
              />
              {favorite.restaurants?.name && (
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {favorite.restaurants.name}
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{favorite.menu_items.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{favorite.menu_items.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">
                  {favorite.menu_items.price.toLocaleString()} FCFA
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                  <Button 
                    onClick={() => handleAddToCart(favorite)}
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

export default FavoritesList;
