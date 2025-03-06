
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { MapPin, Calendar as CalendarIcon, Clock, Users, CreditCard, Car, Search, Star, Plus, Minus } from "lucide-react";

// Types
type Ride = {
  id: string;
  driver: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    ridesCount: number;
  };
  origin: string;
  destination: string;
  date: Date;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  price: number;
  carModel?: string;
  preferences?: string[];
};

// Mock data
const rides: Ride[] = [
  {
    id: "1",
    driver: {
      id: "d1",
      name: "Thomas Mbengue",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      ridesCount: 127
    },
    origin: "Brazzaville, Centre-ville",
    destination: "Pointe-Noire",
    date: new Date(2023, 6, 15),
    departureTime: "08:00",
    arrivalTime: "14:30",
    availableSeats: 3,
    price: 15000,
    carModel: "Toyota Corolla",
    preferences: ["Non-fumeur", "Climatisé", "Musique"]
  },
  {
    id: "2",
    driver: {
      id: "d2",
      name: "Marie Loemba",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      ridesCount: 89
    },
    origin: "Brazzaville, Bacongo",
    destination: "Dolisie",
    date: new Date(2023, 6, 16),
    departureTime: "09:30",
    arrivalTime: "17:00",
    availableSeats: 2,
    price: 18000,
    carModel: "Hyundai Tucson",
    preferences: ["Non-fumeur", "Climatisé", "Pas d'animaux"]
  },
  {
    id: "3",
    driver: {
      id: "d3",
      name: "Paul Moukala",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 4.7,
      ridesCount: 53
    },
    origin: "Pointe-Noire",
    destination: "Brazzaville",
    date: new Date(2023, 6, 17),
    departureTime: "07:00",
    arrivalTime: "13:30",
    availableSeats: 4,
    price: 14000,
    carModel: "Nissan Patrol",
    preferences: ["Climatisé", "Bagages autorisés"]
  },
  {
    id: "4",
    driver: {
      id: "d4",
      name: "Sandrine Loubota",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.6,
      ridesCount: 32
    },
    origin: "Brazzaville, Poto-Poto",
    destination: "Oyo",
    date: new Date(2023, 6, 18),
    departureTime: "10:00",
    arrivalTime: "15:45",
    availableSeats: 1,
    price: 12000,
    carModel: "Renault Duster",
    preferences: ["Non-fumeur", "Pas d'animaux"]
  }
];

export default function Covoiturage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState(1);
  const [filteredRides, setFilteredRides] = useState<Ride[]>(rides);
  const [activeTab, setActiveTab] = useState("search");

  // Search function
  const handleSearch = () => {
    // Filter rides based on origin, destination, date, and available seats
    const filtered = rides.filter(ride => {
      const matchesOrigin = !origin || ride.origin.toLowerCase().includes(origin.toLowerCase());
      const matchesDestination = !destination || ride.destination.toLowerCase().includes(destination.toLowerCase());
      const matchesDate = !date || format(ride.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      const hasEnoughSeats = ride.availableSeats >= passengers;
      
      return matchesOrigin && matchesDestination && matchesDate && hasEnoughSeats;
    });
    
    setFilteredRides(filtered);
    setActiveTab("results");
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
          <h1 className="text-4xl font-bold mb-4 text-white">Covoiturage</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trouvez un trajet partagé ou proposez le vôtre
          </p>
        </motion.div>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-700 mb-10">
          <CardContent className="p-6">
            <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-black/20 border border-gray-700">
                <TabsTrigger value="search" className="flex-1 text-white data-[state=active]:bg-teal-500/20">
                  Rechercher un trajet
                </TabsTrigger>
                <TabsTrigger value="offer" className="flex-1 text-white data-[state=active]:bg-teal-500/20">
                  Proposer un trajet
                </TabsTrigger>
                <TabsTrigger value="results" className="flex-1 text-white data-[state=active]:bg-teal-500/20">
                  Résultats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Départ</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        className="pl-10 bg-black/30 border-gray-600 text-white"
                        placeholder="Lieu de départ" 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        className="pl-10 bg-black/30 border-gray-600 text-white"
                        placeholder="Lieu d'arrivée" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal bg-black/30 border-gray-600 text-white"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "EEEE d MMMM", { locale: fr }) : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Passagers</label>
                    <div className="flex items-center bg-black/30 border border-gray-600 rounded-md h-10">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-white"
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 text-center text-white">{passengers}</div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-white"
                        onClick={() => setPassengers(Math.min(4, passengers + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 bg-teal-500 hover:bg-teal-600"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher
                </Button>
              </TabsContent>

              <TabsContent value="offer" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Lieu de départ</label>
                      <Input 
                        className="bg-black/30 border-gray-600 text-white"
                        placeholder="Lieu de départ précis" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Destination</label>
                      <Input 
                        className="bg-black/30 border-gray-600 text-white"
                        placeholder="Lieu d'arrivée précis" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Date de départ</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal bg-black/30 border-gray-600 text-white"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Sélectionner une date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                          <Calendar
                            mode="single"
                            initialFocus
                            className="bg-gray-800 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Heure de départ</label>
                        <Input 
                          className="bg-black/30 border-gray-600 text-white"
                          type="time"
                          defaultValue="08:00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Places disponibles</label>
                        <Input 
                          className="bg-black/30 border-gray-600 text-white"
                          type="number"
                          defaultValue="3"
                          min="1"
                          max="7"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Modèle de voiture</label>
                      <Input 
                        className="bg-black/30 border-gray-600 text-white"
                        placeholder="Ex: Toyota Corolla" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Prix par passager (FCFA)</label>
                      <Input 
                        className="bg-black/30 border-gray-600 text-white"
                        type="number"
                        defaultValue="15000"
                        min="1000"
                        step="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Préférences</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="nonsmoking" className="h-4 w-4" />
                          <label htmlFor="nonsmoking" className="text-white">Non-fumeur</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="ac" className="h-4 w-4" />
                          <label htmlFor="ac" className="text-white">Climatisé</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="music" className="h-4 w-4" />
                          <label htmlFor="music" className="text-white">Musique</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="animals" className="h-4 w-4" />
                          <label htmlFor="animals" className="text-white">Animaux autorisés</label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Informations supplémentaires</label>
                      <textarea 
                        className="w-full bg-black/30 border-gray-600 text-white rounded-md p-2"
                        rows={3}
                        placeholder="Précisions sur le lieu de rendez-vous, bagages autorisés, etc."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-teal-500 hover:bg-teal-600">
                  Publier le trajet
                </Button>
              </TabsContent>

              <TabsContent value="results" className="mt-0">
                {filteredRides.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRides.map(ride => (
                      <Card key={ride.id} className="bg-black/30 border-gray-700 hover:border-teal-500 transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex items-start">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={ride.driver.avatar} />
                                <AvatarFallback>{ride.driver.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <h3 className="text-lg font-medium text-white">{ride.driver.name}</h3>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="text-white">{ride.driver.rating}</span>
                                  <span className="text-gray-400 text-sm ml-2">({ride.driver.ridesCount} trajets)</span>
                                </div>
                                {ride.carModel && (
                                  <div className="flex items-center text-gray-300 text-sm mt-1">
                                    <Car className="h-4 w-4 mr-1" />
                                    <span>{ride.carModel}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="flex items-start mb-4">
                                  <MapPin className="h-5 w-5 text-teal-500 mr-2 mt-1" />
                                  <div>
                                    <p className="text-gray-400 text-sm">Départ</p>
                                    <p className="text-white">{ride.origin}</p>
                                    <div className="flex items-center text-gray-300 text-sm mt-1">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>{ride.departureTime}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                                  <div>
                                    <p className="text-gray-400 text-sm">Arrivée</p>
                                    <p className="text-white">{ride.destination}</p>
                                    <div className="flex items-center text-gray-300 text-sm mt-1">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>{ride.arrivalTime}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center mb-2">
                                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className="text-white">{format(ride.date, "EEEE d MMMM yyyy", { locale: fr })}</span>
                                </div>
                                
                                <div className="flex items-center mb-2">
                                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className="text-white">{ride.availableSeats} place{ride.availableSeats > 1 ? 's' : ''} disponible{ride.availableSeats > 1 ? 's' : ''}</span>
                                </div>
                                
                                <div className="flex items-center mb-2">
                                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className="text-white">{ride.price.toLocaleString()} FCFA par personne</span>
                                </div>
                                
                                {ride.preferences && ride.preferences.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {ride.preferences.map((pref, index) => (
                                      <Badge key={index} className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                                        {pref}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-between">
                              <div className="text-2xl font-bold text-white text-right">
                                {ride.price.toLocaleString()} FCFA
                              </div>
                              <Button className="bg-teal-500 hover:bg-teal-600 mt-4">
                                Réserver
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Aucun trajet trouvé</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Essayez de modifier vos critères de recherche ou proposez votre propre trajet.
                    </p>
                    <Button 
                      className="mt-6 bg-teal-500 hover:bg-teal-600"
                      onClick={() => setActiveTab("offer")}
                    >
                      Proposer un trajet
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">Trajets populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { from: "Brazzaville", to: "Pointe-Noire", count: 127, image: "https://images.unsplash.com/photo-1629969387384-56cfdd8c8206?q=80&w=500&auto=format&fit=crop" },
              { from: "Brazzaville", to: "Dolisie", count: 68, image: "https://images.unsplash.com/photo-1590613607026-15c463e30ca5?q=80&w=500&auto=format&fit=crop" },
              { from: "Pointe-Noire", to: "Brazzaville", count: 114, image: "https://images.unsplash.com/photo-1555881400-58903881a25e?q=80&w=500&auto=format&fit=crop" },
              { from: "Brazzaville", to: "Oyo", count: 42, image: "https://images.unsplash.com/photo-1573806706598-7f1641f7db46?q=80&w=500&auto=format&fit=crop" }
            ].map((route, index) => (
              <Card key={index} className="overflow-hidden cursor-pointer bg-black/20 backdrop-blur-sm border-gray-700 hover:border-teal-500 transition-all">
                <div className="h-36 relative">
                  <img 
                    src={route.image} 
                    alt={`${route.from} - ${route.to}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{route.from} → {route.to}</h3>
                    <p className="text-sm text-gray-300">{route.count} trajets</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Comment ça marche ?</CardTitle>
            <CardDescription className="text-gray-300">
              Participez à des trajets partagés en toute simplicité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">1. Trouvez un trajet</h3>
                <p className="text-gray-400">
                  Indiquez votre lieu de départ, votre destination et vos dates pour trouver des conducteurs qui font le même trajet.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">2. Réservez et payez</h3>
                <p className="text-gray-400">
                  Réservez votre place en toute sécurité via notre système de paiement mobile ou en ligne.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">3. Voyagez ensemble</h3>
                <p className="text-gray-400">
                  Rencontrez le conducteur au lieu de rendez-vous et profitez du trajet tout en partageant les frais.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-gray-300">
              Vous avez une voiture ? Proposez des trajets et gagnez de l'argent en partageant vos frais !
            </p>
            <Button 
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => setActiveTab("offer")}
            >
              Proposer un trajet
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
