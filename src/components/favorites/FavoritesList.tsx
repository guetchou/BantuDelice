
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { Star, StarOff, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockData } from '@/utils/mockData';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  image_url: string;
  cuisine_type: string;
  average_rating: number;
}

interface FavoritesListProps {
  userId: string;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ userId }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock cart functionality that can be expanded later
  const addToCart = (item: any) => {
    console.log("Adding to cart:", item);
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre panier`
    });
  };

  useEffect(() => {
    if (!userId) return;
    
    fetchFavorites();
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get favorites from mock data
      const userFavorites = mockData.favorites.filter(fav => fav.user_id === userId);
      
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Could not load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      
      toast({
        title: "Success",
        description: "Restaurant removed from favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Could not remove from favorites",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <FavoritesListSkeleton />;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-10">
        <StarOff className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No favorites yet</h3>
        <p className="text-muted-foreground mt-2">
          Browse restaurants and add them to your favorites
        </p>
        <Button className="mt-4" asChild>
          <Link to="/restaurants">Browse Restaurants</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((favorite) => (
        <Card key={favorite.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <Link to={`/restaurant/${favorite.restaurant_id}`}>
                <img 
                  src={`https://source.unsplash.com/random/400x300/?restaurant,${favorite.restaurants.name}`}
                  alt={favorite.restaurants.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full"
                onClick={() => removeFavorite(favorite.id)}
              >
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </Button>
            </div>
            <div className="p-4">
              <Link to={`/restaurant/${favorite.restaurant_id}`}>
                <h3 className="text-lg font-medium hover:text-primary transition-colors">
                  {favorite.restaurants.name}
                </h3>
              </Link>
              <p className="text-muted-foreground text-sm mt-1">
                Added on {new Date(favorite.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0">
            <Button asChild variant="outline">
              <Link to={`/restaurant/${favorite.restaurant_id}`}>
                View Menu
              </Link>
            </Button>
            <Button variant="secondary" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Order Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const FavoritesListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={item} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FavoritesList;
