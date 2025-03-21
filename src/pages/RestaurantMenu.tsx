
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Info, Filter, Star, Plus, Clock, PlusCircle, MinusCircle } from 'lucide-react';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';
import FilterBar from '@/components/restaurant/FilterBar';
import useCart from '@/hooks/useCart';
import { MenuItem } from '@/types/menu';
import { Restaurant } from '@/types/restaurant';
import { useMenuItems } from '@/hooks/useMenuItems';

const RestaurantMenu = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const {
    items,
    categories,
    loading: menuLoading,
    popular: popularItems,
    error
  } = useMenuItems(id || '');

  useEffect(() => {
    if (!id) return;
    
    const fetchRestaurant = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast({
          title: "Error",
          description: "Could not load restaurant details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [id, toast]);

  if (loading || menuLoading) {
    return <RestaurantMenuSkeleton />;
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
        <p>Sorry, we couldn't find the restaurant you're looking for.</p>
        <Button className="mt-4" asChild>
          <Link to="/restaurants">Browse Restaurants</Link>
        </Button>
      </div>
    );
  }

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  // Group menu items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="container mx-auto px-4 mb-16">
      <RestaurantHeader restaurant={restaurant} />
      
      <div className="mt-8">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-6">
            <div className="sticky top-16 z-10 bg-white pt-4 pb-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
              
              <div className="overflow-x-auto pb-2">
                <div className="flex space-x-2">
                  <Button
                    variant={activeCategory === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory('all')}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {activeCategory === 'all' && popularItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Popular Items
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularItems.map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image_url: item.image_url,
                          description: item.description || '',
                          restaurant_id: restaurant.id
                        });
                        
                        toast({
                          title: "Added to cart",
                          description: `${item.name} has been added to your cart`,
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeCategory === 'all' ? (
              // When showing all categories, group by category
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium sticky top-32 bg-white py-2 z-10" id={category.toLowerCase().replace(/\s+/g, '-')}>
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image_url: item.image_url,
                            description: item.description || '',
                            restaurant_id: restaurant.id
                          });
                          
                          toast({
                            title: "Added to cart",
                            description: `${item.name} has been added to your cart`,
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // When filtered by category, just show items
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image_url: item.image_url,
                        description: item.description || '',
                        restaurant_id: restaurant.id
                      });
                      
                      toast({
                        title: "Added to cart",
                        description: `${item.name} has been added to your cart`,
                      });
                    }}
                  />
                ))}
              </div>
            )}
            
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-muted-foreground mt-2">
                  Try selecting a different category
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Reviews</h2>
              <p className="text-muted-foreground">
                This section is coming soon!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Restaurant Information</h2>
              <p className="text-muted-foreground">
                This section is coming soon!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        )}
        {!item.image_url && (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <Info className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {item.is_vegetarian && (
          <Badge className="absolute top-2 right-2 bg-green-500">
            Vegetarian
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <span className="font-medium">${item.price}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{item.preparation_time || '15-20'} mins</span>
          </div>
          <Button
            size="sm"
            onClick={onAddToCart}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RestaurantMenuSkeleton = () => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {Array(6).fill(null).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
