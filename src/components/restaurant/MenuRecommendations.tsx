
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Star, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/hooks/useCart';

interface MenuRecommendationsProps {
  items: MenuItem[];
  title?: string;
}

const MenuRecommendations: React.FC<MenuRecommendationsProps> = ({ items, title = "Recommandés pour vous" }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  if (items.length === 0) {
    return null;
  }

  // Sort items by different criteria
  const sortedByRating = [...items].sort((a, b) => {
    const aRating = a.popularity_score || 0;
    const bRating = b.popularity_score || 0;
    return bRating - aRating;
  });

  const sortedByHealth = [...items].sort((a, b) => {
    // Higher is healthier in this example
    const aScore = a.nutritional_score || 0;
    const bScore = b.nutritional_score || 0;
    return bScore - aScore;
  });

  const sortedByPreparationTime = [...items].sort((a, b) => {
    // Lower is faster
    const aTime = a.preparation_time || 30;
    const bTime = b.preparation_time || 30;
    return aTime - bTime;
  });

  // Take only a few items for each category
  const topRated = sortedByRating.slice(0, 3);
  const quickestPrep = sortedByPreparationTime.slice(0, 3);
  const healthiest = sortedByHealth.slice(0, 3);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRated.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
              <div className="relative h-48">
                <img
                  src={item.image_url || `https://source.unsplash.com/random/300x200/?food,${item.name}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                    Populaire
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-lg">{(item.price / 100).toFixed(2)} €</span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span className="ml-1">
                      {((item.popularity_score || 0) / 20).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      restaurant_id: item.restaurant_id,
                      image_url: item.image_url,
                      description: item.description
                    });
                    
                    toast({
                      title: "Ajouté au panier",
                      description: `${item.name} a été ajouté à votre panier`,
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Prêts rapidement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickestPrep.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
              <div className="relative h-48">
                <img
                  src={item.image_url || `https://source.unsplash.com/random/300x200/?food,${item.name}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.preparation_time || 20} min
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-lg">{(item.price / 100).toFixed(2)} €</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      restaurant_id: item.restaurant_id,
                      image_url: item.image_url,
                      description: item.description
                    });
                    
                    toast({
                      title: "Ajouté au panier",
                      description: `${item.name} a été ajouté à votre panier`,
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MenuRecommendations;
