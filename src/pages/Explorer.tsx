
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Search, Heart, Star, Clock, Phone, Navigation, Share2, BookmarkPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

type Place = {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'attraction' | 'shopping';
  rating: number;
  address: string;
  image: string;
  distance: string;
  priceLevel: 1 | 2 | 3 | 4;
  openNow: boolean;
  phone?: string;
  featured?: boolean;
};

const places: Place[] = [
  {
    id: '1',
    name: 'Restaurant La Coupole',
    type: 'restaurant',
    rating: 4.7,
    address: 'Avenue Foch, Brazzaville',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    distance: '1.2 km',
    priceLevel: 3,
    openNow: true,
    phone: '+242-06-123-4567',
    featured: true
  },
  {
    id: '2',
    name: 'Radisson Blu M\'Bamou Palace Hotel',
    type: 'hotel',
    rating: 4.8,
    address: 'Corniche, Brazzaville',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    distance: '2.5 km',
    priceLevel: 4,
    openNow: true,
    phone: '+242-05-123-4567',
    featured: true
  },
  {
    id: '3',
    name: 'Basilique Sainte-Anne',
    type: 'attraction',
    rating: 4.6,
    address: 'Poto-Poto, Brazzaville',
    image: 'https://images.unsplash.com/photo-1518972458649-7e2f740499f3?q=80&w=2070&auto=format&fit=crop',
    distance: '3.7 km',
    priceLevel: 1,
    openNow: true
  },
  {
    id: '4',
    name: 'Le Grand Marché',
    type: 'shopping',
    rating: 4.3,
    address: 'Centre-ville, Brazzaville',
    image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2070&auto=format&fit=crop',
    distance: '1.8 km',
    priceLevel: 2,
    openNow: true
  },
  {
    id: '5',
    name: 'Mami Wata Restaurant',
    type: 'restaurant',
    rating: 4.5,
    address: 'Boulevard Marien Ngouabi, Brazzaville',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2070&auto=format&fit=crop',
    distance: '2.3 km',
    priceLevel: 3,
    openNow: true,
    phone: '+242-05-987-6543'
  },
  {
    id: '6',
    name: 'Centre Culturel Congolais',
    type: 'attraction',
    rating: 4.4,
    address: 'Rue des Arts, Brazzaville',
    image: 'https://images.unsplash.com/photo-1660475806450-ae67261c3cb7?q=80&w=1974&auto=format&fit=crop',
    distance: '4.1 km',
    priceLevel: 2,
    openNow: false
  },
];

export default function Explorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition(position);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const filteredPlaces = places.filter(place => {
    // Filter by search term
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type/tab
    const matchesType = activeTab === 'all' || place.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  const renderPriceLevel = (level: number) => {
    return '₣'.repeat(level);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-white">Explorer</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez les lieux populaires à proximité
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              className="pl-10 bg-black/30 border-gray-600 text-white h-12 rounded-full"
              placeholder="Rechercher des restaurants, hôtels, attractions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-md mx-auto bg-black/20 border border-gray-700">
              <TabsTrigger value="all" className="flex-1 text-white data-[state=active]:bg-teal-500/20">
                Tous
              </TabsTrigger>
              <TabsTrigger value="restaurant" className="flex-1 text-white data-[state=active]:bg-teal-500/20">
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="hotel" className="flex-1 text-white data-[state=active]:bg-teal-500/20">
                Hôtels
              </TabsTrigger>
              <TabsTrigger value="attraction" className="flex-1 text-white data-[state=active]:bg-teal-500/20">
                Attractions
              </TabsTrigger>
            </Tabs>
          </Tabs>
        </div>

        {filteredPlaces.filter(p => p.featured).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white">Lieux populaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPlaces.filter(p => p.featured).map(place => (
                <Card key={place.id} className="overflow-hidden bg-black/20 backdrop-blur-sm border-gray-700 hover:border-teal-500 transition-all">
                  <div className="h-64 relative">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button variant="outline" size="icon" className="bg-black/20 border-white/20 text-white hover:bg-black/40">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="bg-black/20 border-white/20 text-white hover:bg-black/40">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge className="bg-teal-500 mb-2">{
                        place.type === 'restaurant' ? 'Restaurant' : 
                        place.type === 'hotel' ? 'Hôtel' : 
                        place.type === 'attraction' ? 'Attraction' : 
                        'Shopping'
                      }</Badge>
                      <h3 className="text-xl font-semibold mb-1">{place.name}</h3>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{place.address}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 mr-1" />
                          <span className="text-white">{place.rating}</span>
                        </div>
                        <div className="text-gray-400">
                          {renderPriceLevel(place.priceLevel)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span className={place.openNow ? "text-green-400" : "text-red-400"}>
                          {place.openNow ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center text-gray-400">
                        <Navigation className="h-4 w-4 mr-1" />
                        <span>{place.distance}</span>
                      </div>
                      {place.phone && (
                        <div className="flex items-center text-gray-400">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{place.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button className="bg-teal-500 hover:bg-teal-600">
                      {place.type === 'restaurant' ? 'Réserver' : 
                       place.type === 'hotel' ? 'Voir les chambres' : 
                       'Plus d\'infos'}
                    </Button>
                    <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white">
                      <Navigation className="h-4 w-4 mr-2" />
                      Y aller
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">
            {activeTab === 'all' ? 'Tous les lieux' : 
             activeTab === 'restaurant' ? 'Restaurants' : 
             activeTab === 'hotel' ? 'Hôtels' : 
             activeTab === 'attraction' ? 'Attractions' : 
             'Boutiques'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map(place => (
              <Card 
                key={place.id} 
                className="overflow-hidden bg-black/20 backdrop-blur-sm border-gray-700 hover:border-teal-500 transition-all"
              >
                <div className="h-48 relative">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-black/40">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <Badge className={`${place.openNow ? 'bg-green-500' : 'bg-red-500'}`}>
                      {place.openNow ? 'Ouvert' : 'Fermé'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/60">
                      {place.type === 'restaurant' ? 'Restaurant' : 
                       place.type === 'hotel' ? 'Hôtel' : 
                       place.type === 'attraction' ? 'Attraction' : 
                       'Shopping'}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">{place.name}</CardTitle>
                  <CardDescription className="flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {place.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white">{place.rating}</span>
                    </div>
                    <div className="text-gray-400">
                      {renderPriceLevel(place.priceLevel)}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Navigation className="h-4 w-4 mr-1" />
                      <span>{place.distance}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    {place.type === 'restaurant' ? 'Réserver' : 
                     place.type === 'hotel' ? 'Voir' : 
                     'Plus d\'infos'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    Sauvegarder
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
