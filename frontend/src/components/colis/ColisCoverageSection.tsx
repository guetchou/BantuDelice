import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Truck, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ColisCoverageSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cities = [
    {
      name: 'Brazzaville',
      region: 'Pool',
      population: '2.3M',
      deliveryTime: '24h',
      agencies: 8,
      rating: 4.8,
      description: 'Capitale économique et politique du Congo',
      coordinates: { lat: -4.2634, lng: 15.2429 }
    },
    {
      name: 'Pointe-Noire',
      region: 'Kouilou',
      population: '1.1M',
      deliveryTime: '24h',
      agencies: 6,
      rating: 4.7,
      description: 'Port principal et centre économique du sud',
      coordinates: { lat: -4.8167, lng: 11.85 }
    },
    {
      name: 'Dolisie',
      region: 'Niari',
      population: '128K',
      deliveryTime: '48h',
      agencies: 3,
      rating: 4.6,
      description: 'Ville industrielle et agricole importante',
      coordinates: { lat: -4.2, lng: 12.67 }
    },
    {
      name: 'Nkayi',
      region: 'Bouenza',
      population: '86K',
      deliveryTime: '48h',
      agencies: 2,
      rating: 4.5,
      description: 'Centre agricole et commercial',
      coordinates: { lat: -4.18, lng: 13.28 }
    },
    {
      name: 'Ouesso',
      region: 'Sangha',
      population: '45K',
      deliveryTime: '72h',
      agencies: 2,
      rating: 4.4,
      description: 'Porte d\'entrée vers le nord du pays',
      coordinates: { lat: 1.61, lng: 16.05 }
    },
    {
      name: 'Gamboma',
      region: 'Plateaux',
      population: '38K',
      deliveryTime: '48h',
      agencies: 2,
      rating: 4.3,
      description: 'Centre administratif et commercial',
      coordinates: { lat: -1.88, lng: 15.88 }
    },
    {
      name: 'Madingou',
      region: 'Bouenza',
      population: '32K',
      deliveryTime: '48h',
      agencies: 1,
      rating: 4.2,
      description: 'Ville agricole et minière',
      coordinates: { lat: -4.15, lng: 13.55 }
    },
    {
      name: 'Mossendjo',
      region: 'Niari',
      population: '28K',
      deliveryTime: '48h',
      agencies: 1,
      rating: 4.1,
      description: 'Centre de transit et commerce',
      coordinates: { lat: -2.95, lng: 12.72 }
    }
  ];

  const selectedCityData = cities.find(city => city.name === selectedCity);

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">
              Villes Principales Desservies
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Notre réseau postal couvre les principales villes du Congo avec des agences dans chaque région
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Carte interactive des villes */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  Carte Interactive des Villes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cities.map((city) => (
                    <div
                      key={city.name}
                      onClick={() => setSelectedCity(city.name)}
                      className={`
                        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                        ${selectedCity === city.name 
                          ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' 
                          : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{city.name}</h3>
                        <p className="text-xs text-gray-500">{city.region}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{city.rating}</span>
                        </div>
                      </div>
                      
                      {/* Badge de délai */}
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 right-2 text-xs bg-green-100 text-green-800"
                      >
                        {city.deliveryTime}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Détails de la ville sélectionnée */}
          <div className="lg:col-span-1">
            {selectedCityData ? (
              <Card className="bg-white shadow-xl border-0 h-fit sticky top-4">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    {selectedCityData.name}
                  </CardTitle>
                  <p className="text-orange-100">{selectedCityData.description}</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Users className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-900">{selectedCityData.population}</div>
                        <div className="text-xs text-gray-500">Population</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Truck className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-900">{selectedCityData.agencies}</div>
                        <div className="text-xs text-gray-500">Agences</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-900">Délai de livraison</div>
                          <div className="text-sm text-gray-600">{selectedCityData.deliveryTime}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="font-semibold text-gray-900">Note client</div>
                          <div className="text-sm text-gray-600">{selectedCityData.rating}/5</div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800"
                      onClick={() => {
                        // Action pour expédier vers cette ville
                        console.log(`Expédition vers ${selectedCityData.name}`);
                      }}
                    >
                      Expédier vers {selectedCityData.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white shadow-xl border-0 h-fit">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-700">Sélectionnez une ville</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">
                    Cliquez sur une ville pour voir les détails de notre service
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="mt-12">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">8</div>
                  <div className="text-sm text-gray-600">Villes principales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">25+</div>
                  <div className="text-sm text-gray-600">Agences totales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">24-72h</div>
                  <div className="text-sm text-gray-600">Délai moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">4.5+</div>
                  <div className="text-sm text-gray-600">Note moyenne</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ColisCoverageSection; 