
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Car, Users, Briefcase, Clock, Zap, Shield, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';

const TaxiVehicleComparisonPage = () => {
  const navigate = useNavigate();
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(['standard', 'comfort']);
  
  const vehicles = [
    {
      id: 'standard',
      name: 'Standard',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Berline confortable pour les déplacements quotidiens',
      basePrice: 5000,
      perKmPrice: 500,
      passengers: 4,
      luggage: 2,
      features: [
        'Climatisation',
        'Eau minérale',
        'Paiement mobile',
        'Siège bébé sur demande'
      ],
      recommendedFor: [
        'Déplacements urbains',
        'Petits groupes',
        'Déplacements professionnels'
      ],
      waitTime: '5-10 min',
      rating: 4.7
    },
    {
      id: 'comfort',
      name: 'Confort',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Berline haut de gamme pour une expérience supérieure',
      basePrice: 7000,
      perKmPrice: 650,
      passengers: 4,
      luggage: 3,
      features: [
        'Climatisation premium',
        'Eau et snacks',
        'WiFi embarqué',
        'Prises de chargement',
        'Siège bébé sur demande',
        'Choix de musique'
      ],
      recommendedFor: [
        'Clients exigeants',
        'Déplacements professionnels',
        'Occasions spéciales'
      ],
      waitTime: '7-12 min',
      rating: 4.8
    },
    {
      id: 'premium',
      name: 'Premium',
      image: 'https://images.unsplash.com/photo-1588618575327-fa8218b75ea2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGF4aXxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Voiture de luxe avec service VIP personnalisé',
      basePrice: 12000,
      perKmPrice: 900,
      passengers: 3,
      luggage: 3,
      features: [
        'Véhicule de prestige',
        'Chauffeur en costume',
        'Rafraîchissements premium',
        'WiFi haut débit',
        'Prises de chargement',
        'Tablettes multimédias',
        'Intimité maximale',
        'Accueil personnalisé'
      ],
      recommendedFor: [
        'Clients VIP',
        'Événements prestigieux',
        'Voyageurs d\'affaires',
        'Célébrations spéciales'
      ],
      waitTime: '10-15 min',
      rating: 4.9
    },
    {
      id: 'van',
      name: 'Van',
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZhbnxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Minivan spacieux pour les groupes et gros bagages',
      basePrice: 10000,
      perKmPrice: 800,
      passengers: 7,
      luggage: 5,
      features: [
        'Espace modulable',
        'Climatisation',
        'Eau minérale',
        'Paiement mobile',
        'Sièges enfants disponibles',
        'Assistance bagages'
      ],
      recommendedFor: [
        'Groupes',
        'Familles',
        'Transports avec bagages',
        'Petits événements'
      ],
      waitTime: '10-20 min',
      rating: 4.6
    },
    {
      id: 'electric',
      name: 'Électrique',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVsZWN0cmljJTIwY2FyfGVufDB8fDB8fHww',
      description: 'Véhicule écologique zéro émission',
      basePrice: 6500,
      perKmPrice: 550,
      passengers: 4,
      luggage: 2,
      features: [
        'Zéro émission',
        'Silencieux',
        'Climatisation',
        'Eau minérale bio',
        'Paiement mobile',
        'WiFi embarqué'
      ],
      recommendedFor: [
        'Écologistes',
        'Courts trajets urbains',
        'Professionnels éco-responsables'
      ],
      waitTime: '8-15 min',
      rating: 4.8
    }
  ];
  
  const toggleVehicleSelection = (vehicleId: string) => {
    if (selectedVehicles.includes(vehicleId)) {
      if (selectedVehicles.length > 1) {
        setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId));
      }
    } else {
      if (selectedVehicles.length < 3) {
        setSelectedVehicles([...selectedVehicles, vehicleId]);
      }
    }
  };
  
  const calculatePrice = (base: number, perKm: number, distance: number) => {
    return base + (perKm * distance);
  };
  
  const sampleDistance = 10; // km
  
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/taxi')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Comparaison des Véhicules</h1>
      </div>
      
      <TaxiNavigationMenu />
      
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="comparison" className="mb-10">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="comparison">Comparaison</TabsTrigger>
            <TabsTrigger value="details">Détails des véhicules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison des véhicules</CardTitle>
                <CardDescription>
                  Sélectionnez jusqu'à 3 types de véhicules pour les comparer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-6">
                  {vehicles.map(vehicle => (
                    <Button
                      key={vehicle.id}
                      variant={selectedVehicles.includes(vehicle.id) ? "default" : "outline"}
                      onClick={() => toggleVehicleSelection(vehicle.id)}
                      className="flex items-center"
                    >
                      <Car className="mr-2 h-4 w-4" />
                      {vehicle.name}
                    </Button>
                  ))}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Caractéristique</th>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <th key={vehicleId} className="text-center p-3">
                              {vehicle?.name}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Image</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <img 
                                src={vehicle?.image} 
                                alt={vehicle?.name} 
                                className="w-28 h-20 rounded-lg object-cover mx-auto"
                              />
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Prix de base</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              {formatPrice(vehicle?.basePrice || 0)}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Prix par km</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              {formatPrice(vehicle?.perKmPrice || 0)}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          Estimation pour {sampleDistance} km
                        </td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          const price = vehicle ? calculatePrice(vehicle.basePrice, vehicle.perKmPrice, sampleDistance) : 0;
                          return (
                            <td key={vehicleId} className="p-3 text-center font-bold">
                              {formatPrice(price)}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Capacité passagers</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <div className="flex items-center justify-center">
                                <Users className="h-5 w-5 mr-1" />
                                <span>{vehicle?.passengers}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Capacité bagages</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <div className="flex items-center justify-center">
                                <Briefcase className="h-5 w-5 mr-1" />
                                <span>{vehicle?.luggage}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Temps d'attente moyen</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <div className="flex items-center justify-center">
                                <Clock className="h-5 w-5 mr-1" />
                                <span>{vehicle?.waitTime}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Note clients</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <div className="flex items-center justify-center">
                                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                                <span>{vehicle?.rating}/5</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Caractéristiques</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <ul className="text-left pl-6 space-y-1">
                                {vehicle?.features.map((feature, index) => (
                                  <li key={index} className="flex items-center">
                                    <Check className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                                    <span className="text-sm">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">Recommandé pour</td>
                        {selectedVehicles.map(vehicleId => {
                          const vehicle = vehicles.find(v => v.id === vehicleId);
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <ul className="text-left pl-6 space-y-1">
                                {vehicle?.recommendedFor.map((recommendation, index) => (
                                  <li key={index} className="flex items-center">
                                    <div className="h-2 w-2 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                                    <span className="text-sm">{recommendation}</span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="hover:bg-muted/30">
                        <td className="p-3 font-medium">Action</td>
                        {selectedVehicles.map(vehicleId => {
                          return (
                            <td key={vehicleId} className="p-3 text-center">
                              <Button
                                onClick={() => navigate(`/taxi/booking?vehicle=${vehicleId}`)}
                                size="sm"
                              >
                                Réserver
                              </Button>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map(vehicle => (
                <Card key={vehicle.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="h-5 w-5 mr-2" />
                      {vehicle.name}
                    </CardTitle>
                    <CardDescription>{vehicle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Prix de base</span>
                        <span className="font-medium">{formatPrice(vehicle.basePrice)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Par kilomètre</span>
                        <span className="font-medium">{formatPrice(vehicle.perKmPrice)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Passagers</span>
                        <span className="font-medium flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {vehicle.passengers}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Bagages</span>
                        <span className="font-medium flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {vehicle.luggage}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Caractéristiques</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {vehicle.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Idéal pour</h4>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.recommendedFor.map((rec, index) => (
                          <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">{vehicle.waitTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{vehicle.rating}/5</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/taxi/booking?vehicle=${vehicle.id}`)}
                    >
                      Réserver ce véhicule
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Disponibilité 24/7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Des chauffeurs disponibles à tout moment pour vos déplacements professionnels ou personnels.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Sécurité garantie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tous nos chauffeurs sont vérifiés et nos véhicules régulièrement inspectés pour assurer votre sécurité.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Rapidité et fiabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Nous vous garantissons une prise en charge rapide et un service fiable pour tous vos trajets.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Prêt à réserver?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Choisissez le véhicule qui correspond à vos besoins et réservez en quelques clics.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/taxi/booking')}
          >
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxiVehicleComparisonPage;
