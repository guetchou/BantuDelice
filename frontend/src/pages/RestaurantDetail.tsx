import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  CreditCard,
  Wifi,
  ParkingCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  preparation_time?: number;
  allergens?: string[];
  nutritional_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  review_count: number;
  cuisine_type: string;
  price_range: string;
  delivery_time: number;
  minimum_order: number;
  delivery_fee: number;
  image: string;
  banner_image: string;
  logo: string;
  opening_hours: {
    [key: string]: string;
  };
  features: string[];
  menu: MenuItem[];
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: { item: MenuItem; quantity: number } }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  // Données mockées pour la démonstration
  const mockRestaurant: Restaurant = {
    id: '1',
    name: 'Le Gourmet Congolais',
    description: 'Restaurant traditionnel congolais offrant les meilleurs plats de la cuisine africaine avec des ingrédients frais et locaux.',
    address: '123 Avenue de la Paix, Kinshasa',
    phone: '+242 123 456 789',
    rating: 4.8,
    review_count: 127,
    cuisine_type: 'Congolaise',
    price_range: 'FCFAFCFA',
    delivery_time: 25,
    minimum_order: 15,
    delivery_fee: 3,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    banner_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200',
    opening_hours: {
      'Lundi': '11:00 - 22:00',
      'Mardi': '11:00 - 22:00',
      'Mercredi': '11:00 - 22:00',
      'Jeudi': '11:00 - 22:00',
      'Vendredi': '11:00 - 23:00',
      'Samedi': '11:00 - 23:00',
      'Dimanche': '12:00 - 21:00'
    },
    features: ['Livraison', 'Réservation', 'WiFi', 'Parking'],
    menu: [
      {
        id: '1',
        name: 'Poulet Moambé',
        description: 'Poulet mijoté dans une sauce moambé traditionnelle avec des feuilles de manioc',
        price: 4500,    
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        category: 'Plats principaux',
        available: true,
        preparation_time: 20,
        allergens: ['Gluten'],
        nutritional_info: {
          calories: 450,
          protein: 35,
          carbs: 25,
          fat: 22  
        }
      },
      {
        id: '2',
        name: 'Fufu et Poisson Braisé',
        description: 'Fufu de manioc accompagné de poisson braisé aux herbes locales',
        price: 4000,
        image: 'images/restaurant_images/congolais/49785302-grille-poisson-avec-tomate-salsa-foufou-et-le-chili-pate-photo.jpg',
        category: 'Plats principaux',
        available: true,
        preparation_time: 25,
        allergens: ['Poisson'],
        nutritional_info: {
          calories: 380,
          protein: 28,
          carbs: 45,
          fat: 15
        }
      },
      {
        id: '3',
        name: 'Sauce Graine',
        description: 'Sauce graine traditionnelle avec viande et légumes',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Plats principaux',
        available: true,
        preparation_time: 30,
        allergens: ['Noix'],
        nutritional_info: {
          calories: 320,
          protein: 22,
          carbs: 18,
          fat: 28
        }
      },
      {
        id: '4',
        name: 'Attieke Poisson',
        description: 'Attieke (semoule de manioc) avec poisson grillé',
        price: 5500,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        category: 'Plats principaux',
        available: true,
        preparation_time: 18,
        allergens: ['Poisson'],
        nutritional_info: {
          calories: 290,
          protein: 25,
          carbs: 35,
          fat: 12
        }
      },
      {
        id: '5',
        name: 'Alloco',
        description: 'Bananes plantains frites servies avec sauce piment',
        price: 6000,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        category: 'Accompagnements',
        available: true,
        preparation_time: 10,
        allergens: [],
        nutritional_info: {
          calories: 180,
          protein: 2,
          carbs: 35,
          fat: 8
        }
      },
      {
        id: '6',
        name: 'Bissap',
        description: 'Jus d\'hibiscus traditionnel rafraîchissant',
        price: 1000,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        category: 'Boissons',
        available: true,
        preparation_time: 5,
        allergens: [],
        nutritional_info: {
          calories: 45,
          protein: 0,
          carbs: 12,
          fat: 0
        }
      }
    ]
  };

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setRestaurant(mockRestaurant);
      setLoading(false);
    }, 1000);
  }, [id]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        item,
        quantity: (prev[item.id]?.quantity || 0) + 1
      }
    }));
    toast.success(`${item.name} ajouté au panier`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId]) {
        if (newCart[itemId].quantity > 1) {
          newCart[itemId].quantity -= 1;
        } else {
          delete newCart[itemId];
        }
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, { item, quantity }) => {
      return total + (item.price * quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, { quantity }) => total + quantity, 0);
  };

  const filteredMenu = restaurant?.menu.filter(item => {
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  const categories = ['Tous', ...Array.from(new Set(restaurant?.menu.map(item => item.category) || []))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurant non trouvé</h2>
          <Button onClick={() => navigate('/restaurants')}>
            Retour aux restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header avec image de fond */}
      <div className="relative h-64 md:h-80">
        <img 
          src={restaurant.banner_image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Bouton retour */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-white hover:bg-white hover:text-black"
          onClick={() => navigate('/restaurants')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* Informations du restaurant */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-4 mb-2">
            <img 
              src={restaurant.logo} 
              alt={restaurant.name}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-orange-200">{restaurant.cuisine_type}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating} ({restaurant.review_count} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.delivery_time} min</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu principal */}
          <div className="lg:col-span-2">
            {/* Filtres et recherche */}
            <div className="mb-6 space-y-4">
              <Input
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu */}
            <div className="space-y-4">
              {filteredMenu.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{item.price.toFixed(2)} FCFA</p>
                          {item.preparation_time && (
                            <p className="text-xs text-gray-500">{item.preparation_time} min</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {item.allergens?.map(allergen => (
                            <Badge key={allergen} variant="secondary" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Panier */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Votre commande
                  {getCartItemCount() > 0 && (
                    <Badge variant="secondary">{getCartItemCount()}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(cart).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Votre panier est vide
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.values(cart).map(({ item, quantity }) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.price.toFixed(2)} FCFA</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{getCartTotal().toFixed(2)} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison</span>
                        <span>{restaurant.delivery_fee.toFixed(2)} FCFA</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{(getCartTotal() + restaurant.delivery_fee).toFixed(2)} FCFA</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => {
                        // Sauvegarder les données du panier
                        const cartData = {
                          items: Object.values(cart).map(({ item, quantity }) => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity,
                            restaurant: restaurant.name
                          })),
                          subtotal: getCartTotal(),
                          deliveryFee: restaurant.delivery_fee,
                          total: getCartTotal() + restaurant.delivery_fee,
                          restaurantId: restaurant.id,
                          restaurantName: restaurant.name
                        };
                        
                        localStorage.setItem('restaurant_cart', JSON.stringify(cartData));
                        
                        // Rediriger vers la page de checkout
                        navigate('/checkout');
                      }}
                    >
                      Commander maintenant
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 