
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import MenuItemCard from '@/components/restaurant/MenuItemCard';
import { 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  Heart, 
  Share2, 
  Info, 
  Search,
  ChevronDown,
  Percent
} from 'lucide-react';

// Mock data
const restaurant = {
  id: '1',
  name: 'Le Délice Africain',
  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  rating: 4.8,
  reviews: 243,
  cuisine: 'Africaine, Fusion',
  address: 'Avenue de la Paix, Brazzaville',
  deliveryTime: '30-45',
  deliveryFee: '800 FCFA',
  minimumOrder: '3000 FCFA',
  isOpen: true,
  distance: '2.5 km',
  description: 'Le Délice Africain vous propose une cuisine authentique avec des ingrédients locaux et des saveurs traditionnelles revisitées. Notre chef réinterprète les classiques de la gastronomie congolaise.',
  categories: ['Populaires', 'Entrées', 'Plats principaux', 'Accompagnements', 'Boissons', 'Desserts']
};

const menuItems = [
  {
    id: '1',
    name: 'Poulet Moambe',
    description: 'Poulet mijoté dans une sauce à base de noix de palme, servi avec du riz et des légumes verts.',
    price: 5000,
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Plats principaux',
    preparation_time: 25,
    promotional_data: {
      is_on_promotion: true,
      discount_type: 'percentage',
      discount_value: 15
    }
  },
  {
    id: '2',
    name: 'Poisson Braisé',
    description: 'Poisson entier assaisonné avec des épices locales, grillé et servi avec des bananes plantains.',
    price: 6500,
    image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    category: 'Plats principaux',
    preparation_time: 30
  },
  {
    id: '3',
    name: 'Salade Ndolé',
    description: 'Feuilles de ndolé cuites avec de la viande de bœuf et des crevettes, mélangées à une sauce aux arachides.',
    price: 4000,
    image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1078&q=80',
    category: 'Entrées',
    preparation_time: 15
  },
  {
    id: '4',
    name: 'Jus de Gingembre',
    description: 'Boisson rafraîchissante à base de gingembre frais et de citron.',
    price: 1500,
    image_url: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
    category: 'Boissons',
    preparation_time: 5
  }
];

const RestaurantDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState('Populaires');
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  
  const handleAddToCart = (itemId: string) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };
  
  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] > 1) {
        newItems[itemId] -= 1;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };
  
  const totalItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = menuItems.reduce((sum, item) => {
    const quantity = cartItems[item.id] || 0;
    return sum + (item.price * quantity);
  }, 0);
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Restaurant Header */}
      <div className="relative rounded-xl overflow-hidden h-64 mb-6">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{restaurant.rating}</span>
                <span className="text-gray-300">({restaurant.reviews} avis)</span>
                <span className="mx-2">•</span>
                <span>{restaurant.cuisine}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{restaurant.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bike className="h-4 w-4" />
                  <span className="text-sm">{restaurant.deliveryTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Percent className="h-4 w-4" />
                  <span className="text-sm">Min. {restaurant.minimumOrder}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-black/20 hover:bg-black/40">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-black/20 hover:bg-black/40">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-black/20 hover:bg-black/40">
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant info & Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Menu */}
        <div className="lg:col-span-2">
          {/* Status & Delivery Info */}
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">{restaurant.isOpen ? 'Ouvert' : 'Fermé'}</Badge>
                <span className="text-sm text-gray-500">
                  Ouvert jusqu'à 23:00
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  Livraison: {restaurant.deliveryTime} min
                </span>
              </div>
            </div>
          </Card>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Rechercher un plat" 
              className="pl-10"
            />
          </div>
          
          {/* Categories & Menu */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {restaurant.categories.map(category => (
                <Button 
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={
                    activeCategory === category 
                      ? "bg-orange-500 hover:bg-orange-600 whitespace-nowrap" 
                      : "whitespace-nowrap"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{activeCategory}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems
                .filter(item => 
                  activeCategory === 'Populaires' || item.category === activeCategory
                )
                .map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={() => handleAddToCart(item.id)}
                    onRemoveFromCart={handleRemoveFromCart}
                    quantity={cartItems[item.id] || 0}
                  />
                ))
              }
            </div>
          </div>
        </div>
        
        {/* Right column - Cart */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Votre commande</h2>
              
              {totalItems > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {menuItems
                      .filter(item => cartItems[item.id] > 0)
                      .map(item => (
                        <div key={item.id} className="flex justify-between">
                          <div className="flex gap-2">
                            <span className="font-medium">{cartItems[item.id]}x</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">
                            {(item.price * (cartItems[item.id] || 0)).toLocaleString()} FCFA
                          </span>
                        </div>
                      ))
                    }
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{totalPrice.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frais de livraison</span>
                      <span>{restaurant.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2">
                      <span>Total</span>
                      <span>{(totalPrice + 800).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Commander
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Bike className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500 mb-6">
                    Ajoutez des articles du menu pour commencer votre commande.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;
