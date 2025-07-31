import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Truck, 
  Plane, 
  Ship,
  Clock,
  Star,
  CheckCircle,
  Navigation,
  Globe,
  Building,
  Home,
  Store,
  Factory,
  Zap,
  Shield,
  Users
} from 'lucide-react';

interface City {
  name: string;
  type: 'capital' | 'major' | 'secondary' | 'rural';
  coordinates: { lat: number; lng: number };
  services: string[];
  deliveryTime: string;
  population: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ColisCoverageMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'capital' | 'major' | 'secondary' | 'rural'>('all');

  const cities: City[] = [
    {
      name: 'Brazzaville',
      type: 'capital',
      coordinates: { lat: -4.2634, lng: 15.2429 },
      services: ['standard', 'express', 'premium', 'economy'],
      deliveryTime: '1-3 jours',
      population: '2.3M habitants',
      description: 'Capitale politique et administrative du Congo',
      icon: Building
    },
    {
      name: 'Pointe-Noire',
      type: 'major',
      coordinates: { lat: -4.7989, lng: 11.8363 },
      services: ['standard', 'express', 'premium', 'economy'],
      deliveryTime: '1-3 jours',
      population: '1.1M habitants',
      description: 'Capitale économique et port principal',
      icon: Store
    },
    {
      name: 'Dolisie',
      type: 'major',
      coordinates: { lat: -4.1991, lng: 12.6734 },
      services: ['standard', 'express', 'economy'],
      deliveryTime: '2-4 jours',
      population: '128K habitants',
      description: 'Troisième ville du pays',
      icon: Building
    },
    {
      name: 'Nkayi',
      type: 'secondary',
      coordinates: { lat: -4.1833, lng: 13.2833 },
      services: ['standard', 'economy'],
      deliveryTime: '3-5 jours',
      population: '86K habitants',
      description: 'Ville agricole importante',
      icon: Home
    },
    {
      name: 'Ouesso',
      type: 'secondary',
      coordinates: { lat: 1.6136, lng: 16.0517 },
      services: ['standard', 'economy'],
      deliveryTime: '4-6 jours',
      population: '45K habitants',
      description: 'Porte d\'entrée du nord du pays',
      icon: Home
    },
    {
      name: 'Gamboma',
      type: 'secondary',
      coordinates: { lat: -1.8764, lng: 15.8644 },
      services: ['standard', 'economy'],
      deliveryTime: '3-5 jours',
      population: '38K habitants',
      description: 'Ville de transit importante',
      icon: Home
    },
    {
      name: 'Madingou',
      type: 'secondary',
      coordinates: { lat: -4.1539, lng: 13.5500 },
      services: ['standard', 'economy'],
      deliveryTime: '3-5 jours',
      population: '32K habitants',
      description: 'Centre administratif régional',
      icon: Home
    },
    {
      name: 'Mossendjo',
      type: 'secondary',
      coordinates: { lat: -2.9500, lng: 12.7167 },
      services: ['standard', 'economy'],
      deliveryTime: '3-5 jours',
      population: '28K habitants',
      description: 'Ville minière et agricole',
      icon: Factory
    },
    {
      name: 'Kinkala',
      type: 'rural',
      coordinates: { lat: -4.3614, lng: 14.7644 },
      services: ['economy'],
      deliveryTime: '5-7 jours',
      population: '15K habitants',
      description: 'Ville rurale en développement',
      icon: Home
    },
    {
      name: 'Loandjili',
      type: 'rural',
      coordinates: { lat: -4.8167, lng: 11.8500 },
      services: ['economy'],
      deliveryTime: '5-7 jours',
      population: '12K habitants',
      description: 'Village côtier',
      icon: Home
    },
    {
      name: 'Djambala',
      type: 'rural',
      coordinates: { lat: -2.5447, lng: 14.7533 },
      services: ['economy'],
      deliveryTime: '5-7 jours',
      population: '10K habitants',
      description: 'Ville rurale isolée',
      icon: Home
    },
    {
      name: 'Ewo',
      type: 'rural',
      coordinates: { lat: -0.8722, lng: 14.8206 },
      services: ['economy'],
      deliveryTime: '6-8 jours',
      population: '8K habitants',
      description: 'Ville frontalière',
      icon: Home
    },
    {
      name: 'Sibiti',
      type: 'rural',
      coordinates: { lat: -3.6833, lng: 13.3500 },
      services: ['economy'],
      deliveryTime: '5-7 jours',
      population: '7K habitants',
      description: 'Ville forestière',
      icon: Home
    },
    {
      name: 'Impfondo',
      type: 'rural',
      coordinates: { lat: 1.6167, lng: 18.0667 },
      services: ['economy'],
      deliveryTime: '7-10 jours',
      population: '6K habitants',
      description: 'Ville fluviale du nord',
      icon: Home
    },
    {
      name: 'Makoua',
      type: 'rural',
      coordinates: { lat: 0.0167, lng: 15.6333 },
      services: ['economy'],
      deliveryTime: '6-8 jours',
      population: '5K habitants',
      description: 'Ville forestière du nord',
      icon: Home
    }
  ];

  const filteredCities = cities.filter(city => 
    filterType === 'all' || city.type === filterType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'capital': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      case 'secondary': return 'bg-blue-500';
      case 'rural': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'capital': return 'Capitale';
      case 'major': return 'Ville majeure';
      case 'secondary': return 'Ville secondaire';
      case 'rural': return 'Zone rurale';
      default: return 'Autre';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'standard': return <Truck className="h-4 w-4" />;
      case 'express': return <Plane className="h-4 w-4" />;
      case 'premium': return <Star className="h-4 w-4" />;
      case 'economy': return <Ship className="h-4 w-4" />;
      default: return <Truck className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Couverture Nationale
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Notre réseau couvre tout le Congo avec des services adaptés à chaque région
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Carte interactive */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  Carte de couverture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filtres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterType('all')}
                    size="sm"
                  >
                    Toutes les villes
                  </Button>
                  <Button
                    variant={filterType === 'capital' ? 'default' : 'outline'}
                    onClick={() => setFilterType('capital')}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Capitales
                  </Button>
                  <Button
                    variant={filterType === 'major' ? 'default' : 'outline'}
                    onClick={() => setFilterType('major')}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Villes majeures
                  </Button>
                  <Button
                    variant={filterType === 'secondary' ? 'default' : 'outline'}
                    onClick={() => setFilterType('secondary')}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Villes secondaires
                  </Button>
                  <Button
                    variant={filterType === 'rural' ? 'default' : 'outline'}
                    onClick={() => setFilterType('rural')}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Zones rurales
                  </Button>
                </div>

                {/* Carte stylisée */}
                <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-8 min-h-[400px] border-2 border-green-200">
                  {/* Légende */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
                    <h4 className="font-semibold text-sm mb-2">Légende</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Capitale</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Ville majeure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Ville secondaire</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Zone rurale</span>
                      </div>
                    </div>
                  </div>

                  {/* Villes */}
                  <div className="relative">
                    {filteredCities.map((city, index) => (
                      <div
                        key={city.name}
                        className="absolute cursor-pointer group"
                        style={{
                          left: `${((city.coordinates.lng + 18) / 36) * 100}%`,
                          top: `${((city.coordinates.lat + 5) / 10) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => setSelectedCity(city)}
                      >
                        <div className={`w-4 h-4 ${getTypeColor(city.type)} rounded-full shadow-lg group-hover:scale-150 transition-transform duration-200`}></div>
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          <div className="text-xs font-semibold">{city.name}</div>
                          <div className="text-xs text-gray-600">{city.deliveryTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Axes de transport */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Axe Brazzaville-Pointe-Noire */}
                    <div className="absolute top-1/2 left-1/4 w-1/2 h-1 bg-orange-300 rounded-full opacity-50"></div>
                    {/* Axe nord-sud */}
                    <div className="absolute top-1/4 left-1/2 w-1 h-1/2 bg-blue-300 rounded-full opacity-50 transform -translate-x-1/2"></div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-blue-600">{cities.length}</div>
                    <div className="text-xs text-gray-600">Villes desservies</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-xs text-gray-600">Couverture nationale</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-orange-600">24h</div>
                    <div className="text-xs text-gray-600">Service client</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-purple-600">4</div>
                    <div className="text-xs text-gray-600">Types de service</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Détails de la ville sélectionnée */}
          <div className="space-y-6">
            {selectedCity ? (
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <selectedCity.icon className="h-5 w-5" />
                    {selectedCity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Badge className={`${getTypeColor(selectedCity.type)} text-white`}>
                        {getTypeLabel(selectedCity.type)}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Informations</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Délai de livraison : {selectedCity.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>Population : {selectedCity.population}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-gray-500" />
                          <span>Coordonnées : {selectedCity.coordinates.lat.toFixed(4)}, {selectedCity.coordinates.lng.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Services disponibles</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedCity.services.map((service) => (
                          <div key={service} className="flex items-center gap-2 text-sm">
                            {getServiceIcon(service)}
                            <span className="capitalize">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedCity.description}</p>
                    </div>

                    <Button className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Expédier vers {selectedCity.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Sélectionnez une ville
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    <Globe className="h-12 w-12 mx-auto mb-4" />
                    <p>Cliquez sur un point de la carte pour voir les détails</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Avantages de la couverture */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Avantages de notre réseau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Couverture nationale complète</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Services adaptés à chaque région</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Suivi en temps réel partout</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Agents locaux dédiés</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Tarifs transparents</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColisCoverageMap; 