
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/calendar";
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const popularDestinations = [
  { from: "Brazzaville", to: "Pointe-Noire", price: "7500-12000", duration: "5-6h" },
  { from: "Brazzaville", to: "Dolisie", price: "6000-9000", duration: "4-5h" },
  { from: "Pointe-Noire", to: "Dolisie", price: "4000-6000", duration: "2-3h" },
  { from: "Brazzaville", to: "Owando", price: "8000-12000", duration: "6-7h" },
];

const drivers = [
  { id: 1, name: "Thomas M.", rating: 4.8, trips: 127, photo: "https://randomuser.me/api/portraits/men/32.jpg", car: "Toyota Corolla", carPhoto: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000" },
  { id: 2, name: "Sophie K.", rating: 4.9, trips: 84, photo: "https://randomuser.me/api/portraits/women/44.jpg", car: "Hyundai Tucson", carPhoto: "https://images.unsplash.com/photo-1588636142475-a62d56692870?auto=format&fit=crop&q=80&w=1000" },
  { id: 3, name: "Jean-Paul B.", rating: 4.7, trips: 56, photo: "https://randomuser.me/api/portraits/men/22.jpg", car: "Renault Duster", carPhoto: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000" },
];

export default function Covoiturage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchResults, setSearchResults] = useState<boolean>(false);

  const handleSearch = () => {
    setSearchResults(true);
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
            Voyagez à moindre coût en partageant vos trajets avec d'autres personnes
          </p>
        </motion.div>

        <Card className="mb-10 bg-black/20 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Trouver un trajet</CardTitle>
            <CardDescription className="text-gray-300">
              Renseignez votre départ, votre destination et la date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-white">Départ</Label>
                <Select defaultValue="brazzaville">
                  <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                    <SelectValue placeholder="Ville de départ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brazzaville">Brazzaville</SelectItem>
                    <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
                    <SelectItem value="dolisie">Dolisie</SelectItem>
                    <SelectItem value="owando">Owando</SelectItem>
                    <SelectItem value="ouesso">Ouesso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to" className="text-white">Destination</Label>
                <Select defaultValue="pointe-noire">
                  <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                    <SelectValue placeholder="Ville de destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brazzaville">Brazzaville</SelectItem>
                    <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
                    <SelectItem value="dolisie">Dolisie</SelectItem>
                    <SelectItem value="owando">Owando</SelectItem>
                    <SelectItem value="ouesso">Ouesso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Date</Label>
                <div className="relative">
                  <DatePicker
                    selected={date}
                    onSelect={setDate}
                    className="w-full"
                    locale={fr}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSearch}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              Rechercher
            </Button>
          </CardFooter>
        </Card>

        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              Trajets disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {drivers.map(driver => (
                <Card key={driver.id} className="overflow-hidden bg-black/20 backdrop-blur-sm border-gray-700 hover:border-teal-500 transition-all">
                  <div className="h-48 relative">
                    <img 
                      src={driver.carPhoto} 
                      alt={driver.car} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex items-center">
                      <img 
                        src={driver.photo} 
                        alt={driver.name} 
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div className="ml-3 text-white">
                        <p className="font-medium">{driver.name}</p>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{driver.rating}</span>
                          <span className="mx-2">•</span>
                          <span>{driver.trips} trajets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Départ</p>
                        <p className="text-lg font-medium text-white">Brazzaville</p>
                        <p className="text-sm text-gray-400">
                          {date && format(date, 'EEEE d MMMM', { locale: fr })}
                        </p>
                        <p className="text-sm text-gray-400">8:00</p>
                      </div>
                      <div className="text-gray-500">→</div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Arrivée</p>
                        <p className="text-lg font-medium text-white">Pointe-Noire</p>
                        <p className="text-sm text-gray-400">
                          {date && format(date, 'EEEE d MMMM', { locale: fr })}
                        </p>
                        <p className="text-sm text-gray-400">14:00</p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div>
                        <p className="text-sm text-gray-400">Véhicule</p>
                        <p className="text-white">{driver.car}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Prix</p>
                        <p className="text-2xl font-bold text-white">9000 FCFA</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600">
                      Réserver
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
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            Destinations populaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, index) => (
              <Card 
                key={index} 
                className="bg-black/20 backdrop-blur-sm border-gray-700 overflow-hidden hover:border-teal-500 transition-all"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center justify-between">
                    <span>{dest.from}</span>
                    <span className="text-gray-400">→</span>
                    <span>{dest.to}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-400">Prix</p>
                      <p className="text-white">{dest.price} FCFA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Durée</p>
                      <p className="text-white">{dest.duration}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white transition-colors"
                  >
                    Voir les trajets
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
