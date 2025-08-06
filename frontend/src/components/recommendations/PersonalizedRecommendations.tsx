
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/hooks/useCart';

interface PersonalizedRecommendationsProps {
  userId: string;
  limit?: number;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ userId, limit = 4 }) => {
  const { addItem } = useCart();
  
  // Mock query for personalized recommendations
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations', userId, limit],
    queryFn: async () => {
      // Mock API call - in a real app this would call your backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock data
      return [
        {
          id: 'rec1',
          name: 'Burger Spécial',
          price: 1290,
          image_url: 'https://source.unsplash.com/random/300x200/?burger',
          description: 'Notre burger signature avec steak haché, fromage fondu et sauce spéciale',
          restaurant_id: 'restaurant1',
          available: true
        },
        {
          id: 'rec2',
          name: 'Pizza Margherita',
          price: 1190,
          image_url: 'https://source.unsplash.com/random/300x200/?pizza',
          description: 'Pizza traditionnelle avec sauce tomate, mozzarella et basilic frais',
          restaurant_id: 'restaurant2',
          available: true
        },
        {
          id: 'rec3',
          name: 'Salade César',
          price: 990,
          image_url: 'https://source.unsplash.com/random/300x200/?salad',
          description: 'Salade romaine, poulet grillé, croûtons, parmesan et sauce césar',
          restaurant_id: 'restaurant3',
          available: true
        },
        {
          id: 'rec4',
          name: 'Nouilles Sautées',
          price: 1090,
          image_url: 'https://source.unsplash.com/random/300x200/?noodles',
          description: 'Nouilles sautées aux légumes croquants et sauce soja',
          restaurant_id: 'restaurant4',
          available: true
        }
      ] as MenuItem[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recommandé pour vous</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(null).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-36 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recommandé pour vous</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-36 overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 h-10">{item.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">{(item.price / 100).toFixed(2)} FCFA </span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full hover:bg-primary/10"
                  onClick={() => addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    image_url: item.image_url,
                    description: item.description,
                    restaurant_id: item.restaurant_id,
                    menu_item_id: item.id,
                    total: item.price
                  })}
                >
                  <ShoppingCart className="h-4 w-4" />
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
