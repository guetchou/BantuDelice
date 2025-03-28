
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  ArrowRight,
  Info,
  Star,
  User,
  Calendar as CalendarIcon,
  Heart,
  HeartOff
} from 'lucide-react';
import RideForm from '@/components/covoiturage/RideForm';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Données simulées pour la démo
const recentTrips = [
  {
    id: 'trip1',
    origin: 'Centre-ville, Brazzaville',
    destination: 'Aéroport Maya-Maya, Brazzaville',
    date: new Date(Date.now() + 3600000 * 24 * 2).toISOString(),
    price: 2000,
    driver: {
      id: 'driver1',
      name: 'Thomas Ndolo',
      rating: 4.8,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
    },
    seats: 3,
    status: 'upcoming'
  },
  {
    id: 'trip2',
    origin: 'Talangaï, Brazzaville',
    destination: 'Université Marien Ngouabi, Brazzaville',
    date: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    price: 1500,
    driver: {
      id: 'driver2',
      name: 'Marie Loemba',
      rating: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'
    },
    seats: 2,
    status: 'completed'
  },
  {
    id: 'trip3',
    origin: 'Pointe-Noire Centre',
    destination: 'Plage BASM, Pointe-Noire',
    date: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    price: 2500,
    driver: {
      id: 'driver3',
      name: 'Jean Moungala',
      rating: 4.7,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
    },
    seats: 4,
    status: 'completed'
  }
];

// Trajets réguliers simulés
const recurringTrips = [
  {
    id: 'rec1',
    origin: 'Bacongo, Brazzaville',
    destination: 'Centre-ville, Brazzaville',
    days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    time: '08:00',
    returnTime: '18:00',
    price: 1000,
    driver: {
      id: 'driver4',
      name: 'Alain Massamba',
      rating: 4.9,
      profileImage: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300'
    },
    passengers: 2,
    seats: 4,
    status: 'active'
  },
  {
    id: 'rec2',
    origin: 'Moungali, Brazzaville',
    destination: 'Zone Industrielle, Brazzaville',
    days: ['Lundi', 'Mercredi', 'Vendredi'],
    time: '07:30',
    returnTime: '17:30',
    price: 1200,
    driver: {
      id: 'driver5',
      name: 'Christelle Moukila',
      rating: 4.7,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'
    },
    passengers: 1,
    seats: 3,
    status: 'active'
  }
];

// Trajets favoris simulés
const favoriteTrips = [
  {
    id: 'fav1',
    origin: 'Aéroport Maya-Maya, Brazzaville',
    destination: 'Centre-ville, Brazzaville',
    price: 2000,
    seats: 3
  },
  {
    id: 'fav2',
    origin: 'Université Marien Ngouabi, Brazzaville',
    destination: 'Bacongo, Brazzaville',
    price: 1500,
    seats: 2
  }
];

export default function Covoiturage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [createMode, setCreateMode] = useState<'single' | 'recurring' | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['fav1']);
  
  const handleSearch = () => {
    if (!searchOrigin || !searchDestination) {
      toast.error("Veuillez entrer une origine et une destination");
      return;
    }
    
    // Simuler une recherche
    toast.success("Recherche en cours", {
      description: `Trajets de ${searchOrigin} à ${searchDestination}`
    });
    
    // Reset search
    setSearchOrigin('');
    setSearchDestination('');
  };
  
  const handleCreateRide = (type: 'single' | 'recurring') => {
    setCreateMode(type);
  };
  
  const handleCancelCreate = () => {
    setCreateMode(null);
  };
  
  const handleToggleFavorite = (tripId: string) => {
    setFavorites(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId) 
        : [...prev, tripId]
    );
    
    // Show notification
    const isFavorite = favorites.includes(tripId);
    toast.success(
      isFavorite 
        ? "Retiré des favoris" 
        : "Ajouté aux favoris"
    );
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Covoiturage</h1>
      
      {!createMode ? (
        <div className="space-y-8">
          <Tabs 
            defaultValue="search" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="search" className="text-sm">Rechercher</TabsTrigger>
              <TabsTrigger value="my-trips" className="text-sm">Mes trajets</TabsTrigger>
              <TabsTrigger value="favorites" className="text-sm">Favoris</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Trouver un trajet</h2>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Lieu de départ"
                          className="pl-10"
                          value={searchOrigin}
                          onChange={(e) => setSearchOrigin(e.target.value)}
                        />
                      </div>
                      
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Destination"
                          className="pl-10"
                          value={searchDestination}
                          onChange={(e) => setSearchDestination(e.target.value)}
                        />
                      </div>
                      
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="date"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleSearch}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700" 
                  onClick={() => handleCreateRide('single')}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Proposer un trajet
                </Button>
                
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700" 
                  onClick={() => handleCreateRide('recurring')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Trajet régulier
                </Button>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Trajets populaires</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { origin: 'Centre-ville', destination: 'Aéroport Maya-Maya', price: 2000 },
                    { origin: 'Bacongo', destination: 'Université Marien Ngouabi', price: 1500 },
                    { origin: 'Pointe-Noire', destination: 'Brazzaville', price: 15000 }
                  ].map((trip, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-green-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Départ</p>
                                <p className="font-medium">{trip.origin}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-orange-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Destination</p>
                                <p className="font-medium">{trip.destination}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-3 border-t">
                            <span className="font-semibold text-primary">
                              {trip.price.toLocaleString('fr-FR')} FCFA
                            </span>
                            <Button size="sm" variant="ghost">
                              Rechercher
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="my-trips" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes trajets</h2>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handleCreateRide('single')}
                >
                  <Car className="h-4 w-4" />
                  Nouveau trajet
                </Button>
              </div>
              
              <Tabs defaultValue="upcoming">
                <TabsList>
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="recurring">Réguliers</TabsTrigger>
                  <TabsTrigger value="past">Passés</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4 mt-4">
                  {recentTrips
                    .filter(trip => trip.status === 'upcoming')
                    .map(trip => (
                      <Card key={trip.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{formatDate(trip.date)}</span>
                                </div>
                                <Badge className="bg-blue-500">{trip.seats} places</Badge>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-green-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-500">Départ</p>
                                  <p className="font-medium">{trip.origin}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-orange-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-500">Destination</p>
                                  <p className="font-medium">{trip.destination}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-between items-end">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={trip.driver.profileImage} />
                                  <AvatarFallback>{trip.driver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{trip.driver.name}</p>
                                  <div className="flex items-center text-sm">
                                    <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                                    <span>{trip.driver.rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  {trip.price.toLocaleString('fr-FR')} FCFA
                                </p>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="mt-2"
                                >
                                  Détails
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                  {recentTrips.filter(trip => trip.status === 'upcoming').length === 0 && (
                    <div className="text-center py-12">
                      <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucun trajet à venir</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-4">
                        Vous n'avez pas de trajets planifiés pour l'instant. Réservez un nouveau trajet ou proposez-en un.
                      </p>
                      <Button onClick={() => handleCreateRide('single')}>
                        Proposer un trajet
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="recurring" className="space-y-4 mt-4">
                  {recurringTrips.map(trip => (
                    <Card key={trip.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                  <span className="font-medium">{trip.time} - {trip.returnTime}</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {trip.days.map(day => (
                                      <Badge key={day} variant="outline" className="font-normal text-xs">
                                        {day.substring(0, 3)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Badge className="bg-green-500">Actif</Badge>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-green-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Départ</p>
                                <p className="font-medium">{trip.origin}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-orange-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Destination</p>
                                <p className="font-medium">{trip.destination}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-between items-end">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <Avatar className="h-7 w-7 border-2 border-white">
                                  <AvatarFallback>P1</AvatarFallback>
                                </Avatar>
                                <Avatar className="h-7 w-7 border-2 border-white">
                                  <AvatarFallback>P2</AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <p className="text-sm">
                                  {trip.passengers}/{trip.seats} passagers
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {trip.price.toLocaleString('fr-FR')} FCFA
                              </p>
                              <p className="text-xs text-gray-500">par trajet</p>
                              <Button
                                size="sm"
                                variant="default"
                                className="mt-2"
                              >
                                Gérer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {recurringTrips.length === 0 && (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucun trajet régulier</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-4">
                        Vous n'avez pas de trajets réguliers configurés. Créez un trajet régulier pour vos déplacements quotidiens.
                      </p>
                      <Button onClick={() => handleCreateRide('recurring')}>
                        Créer un trajet régulier
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4 mt-4">
                  {recentTrips
                    .filter(trip => trip.status === 'completed')
                    .map(trip => (
                      <Card key={trip.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">{formatDate(trip.date)}</span>
                                </div>
                                <Badge variant="outline" className="text-gray-500 bg-gray-100">Terminé</Badge>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-green-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-500">Départ</p>
                                  <p className="font-medium text-gray-600">{trip.origin}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-orange-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-500">Destination</p>
                                  <p className="font-medium text-gray-600">{trip.destination}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-between items-end">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={trip.driver.profileImage} />
                                  <AvatarFallback>{trip.driver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-600">{trip.driver.name}</p>
                                  <div className="flex items-center text-sm">
                                    <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                                    <span>{trip.driver.rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-600">
                                  {trip.price.toLocaleString('fr-FR')} FCFA
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2"
                                >
                                  Détails
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-6 mt-6">
              <h2 className="text-xl font-semibold">Mes trajets favoris</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteTrips.map(trip => (
                  <Card 
                    key={trip.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-4">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          <Users className="h-3 w-3 mr-1" />
                          {trip.seats} places
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-500"
                          onClick={() => handleToggleFavorite(trip.id)}
                        >
                          {favorites.includes(trip.id) ? (
                            <Heart className="h-5 w-5" fill="currentColor" />
                          ) : (
                            <HeartOff className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-green-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500">Départ</p>
                            <p className="font-medium">{trip.origin}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-orange-500 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500">Destination</p>
                            <p className="font-medium">{trip.destination}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-3 border-t">
                        <span className="font-semibold text-primary">
                          {trip.price.toLocaleString('fr-FR')} FCFA
                        </span>
                        <Button size="sm">
                          Rechercher
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {favoriteTrips.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun trajet favori</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Vous n'avez pas encore de trajets favoris. Ajoutez-en pour y accéder rapidement.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {createMode === 'single' ? 'Proposer un trajet' : 'Proposer un trajet régulier'}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleCancelCreate}>
              Annuler
            </Button>
          </div>
          
          <RideForm isRecurring={createMode === 'recurring'} />
        </div>
      )}
    </div>
  );
}
