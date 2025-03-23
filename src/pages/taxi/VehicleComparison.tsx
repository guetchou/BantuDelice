
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Check, X, Car, CreditCard, Truck, Bike, BarChart2 } from 'lucide-react';
import { useTaxiPricing } from '@/hooks/useTaxiPricing';

const VehicleComparison = () => {
  const navigate = useNavigate();
  const { getQuickEstimate } = useTaxiPricing();
  const [selectedDistance, setSelectedDistance] = useState<number>(10);
  
  // Définition des véhicules à comparer
  const vehicles = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Pour les trajets quotidiens',
      icon: Car,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-500',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      passengers: '1-4',
      baggage: '2 bagages standards',
      comfort: 3,
      speed: 3,
      price: 3,
      features: {
        climatisation: true,
        wifi: false,
        refreshments: false,
        childSeat: true,
        accessibility: false,
        premiumService: false,
        priorityService: false,
        professionalDriver: true,
        ridesharing: true,
        booking: true,
        payment: ['Espèces', 'Mobile Money', 'Carte'],
        wait: '5 minutes gratuites',
        cancellation: 'Jusqu\'à 2 min après la réservation'
      }
    },
    {
      id: 'comfort',
      name: 'Confort',
      description: 'Confortable pour trajets moyens',
      icon: Car,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-500',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      passengers: '1-4',
      baggage: '3 bagages standards',
      comfort: 4,
      speed: 3,
      price: 4,
      features: {
        climatisation: true,
        wifi: true,
        refreshments: true,
        childSeat: true,
        accessibility: false,
        premiumService: false,
        priorityService: false,
        professionalDriver: true,
        ridesharing: true,
        booking: true,
        payment: ['Espèces', 'Mobile Money', 'Carte', 'Portefeuille électronique'],
        wait: '10 minutes gratuites',
        cancellation: 'Jusqu\'à 5 min après la réservation'
      }
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Expérience haut de gamme',
      icon: CreditCard,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-500',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      passengers: '1-3',
      baggage: '4 bagages standards',
      comfort: 5,
      speed: 4,
      price: 5,
      features: {
        climatisation: true,
        wifi: true,
        refreshments: true,
        childSeat: true,
        accessibility: true,
        premiumService: true,
        priorityService: true,
        professionalDriver: true,
        ridesharing: false,
        booking: true,
        payment: ['Espèces', 'Mobile Money', 'Carte', 'Portefeuille électronique'],
        wait: '15 minutes gratuites',
        cancellation: 'Jusqu\'à 10 min après la réservation'
      }
    },
    {
      id: 'van',
      name: 'Van',
      description: 'Idéal pour groupes',
      icon: Truck,
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-500',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      passengers: '4-7',
      baggage: '7 bagages standards + volumineux',
      comfort: 4,
      speed: 2,
      price: 5,
      features: {
        climatisation: true,
        wifi: true,
        refreshments: false,
        childSeat: true,
        accessibility: true,
        premiumService: false,
        priorityService: false,
        professionalDriver: true,
        ridesharing: false,
        booking: true,
        payment: ['Espèces', 'Mobile Money', 'Carte'],
        wait: '10 minutes gratuites',
        cancellation: 'Jusqu\'à 5 min après la réservation'
      }
    }
  ];

  // Distances pour l'estimation des prix
  const distances = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 20, label: '20 km' },
    { value: 30, label: '30 km' }
  ];

  // Générer les étoiles pour les notations
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded-full ${i < rating ? 'bg-primary' : 'bg-gray-200'}`}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/taxi')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Comparaison des véhicules</h1>
          <p className="text-gray-600 mt-1">
            Trouvez le type de véhicule idéal pour vos déplacements
          </p>
        </div>
      </div>

      <Tabs defaultValue="features" className="w-full mb-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="table">Tableau comparatif</TabsTrigger>
        </TabsList>
        
        {/* Section des fonctionnalités */}
        <TabsContent value="features" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => {
              const VehicleIcon = vehicle.icon;
              return (
                <Card key={vehicle.id} className={`overflow-hidden ${vehicle.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                        <CardDescription>{vehicle.description}</CardDescription>
                      </div>
                      <VehicleIcon className={`h-8 w-8 ${vehicle.iconColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-0">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Capacité</h3>
                        <p>{vehicle.passengers} passagers</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Bagages</h3>
                        <p>{vehicle.baggage}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Confort</h3>
                        {renderRating(vehicle.comfort)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Rapidité</h3>
                        {renderRating(vehicle.speed)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Prix</h3>
                        {renderRating(vehicle.price)}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 py-2">
                        <h3 className="text-sm font-medium">Caractéristiques</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center text-sm">
                            {vehicle.features.climatisation ? 
                              <Check className="h-4 w-4 text-green-500 mr-2" /> : 
                              <X className="h-4 w-4 text-red-500 mr-2" />}
                            <span>Climatisation</span>
                          </div>
                          <div className="flex items-center text-sm">
                            {vehicle.features.wifi ? 
                              <Check className="h-4 w-4 text-green-500 mr-2" /> : 
                              <X className="h-4 w-4 text-red-500 mr-2" />}
                            <span>Wi-Fi</span>
                          </div>
                          <div className="flex items-center text-sm">
                            {vehicle.features.refreshments ? 
                              <Check className="h-4 w-4 text-green-500 mr-2" /> : 
                              <X className="h-4 w-4 text-red-500 mr-2" />}
                            <span>Rafraîchissements</span>
                          </div>
                          <div className="flex items-center text-sm">
                            {vehicle.features.childSeat ? 
                              <Check className="h-4 w-4 text-green-500 mr-2" /> : 
                              <X className="h-4 w-4 text-red-500 mr-2" />}
                            <span>Siège enfant</span>
                          </div>
                          <div className="flex items-center text-sm">
                            {vehicle.features.accessibility ? 
                              <Check className="h-4 w-4 text-green-500 mr-2" /> : 
                              <X className="h-4 w-4 text-red-500 mr-2" />}
                            <span>Accessibilité</span>
                          </div>
                          <div className="flex items-center text-sm">
                            {vehicle.features.priorityService ? 
                              <Check className="h-4 w-4 text-green-500 mr-2" /> : 
                              <X className="h-4 w-4 text-red-500 mr-2" />}
                            <span>Service prioritaire</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button 
                      className={`w-full ${vehicle.buttonColor}`}
                      onClick={() => navigate(`/taxi/booking?vehicle=${vehicle.id}`)}
                    >
                      Réserver ce véhicule
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Section des tarifs */}
        <TabsContent value="pricing" className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6 max-w-3xl mx-auto">
            <div className="flex items-center mb-4">
              <BarChart2 className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-lg font-medium">Estimation des tarifs selon la distance</h2>
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              {distances.map((distance) => (
                <Badge 
                  key={distance.value}
                  variant={selectedDistance === distance.value ? "default" : "outline"}
                  className="cursor-pointer text-base py-1.5 px-3"
                  onClick={() => setSelectedDistance(distance.value)}
                >
                  {distance.label}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vehicles.map((vehicle) => {
                const VehicleIcon = vehicle.icon;
                const estimatedPrice = getQuickEstimate(selectedDistance, vehicle.id as any);
                
                return (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <CardHeader className={`${vehicle.color} pb-3`}>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{vehicle.name}</CardTitle>
                        <VehicleIcon className={`h-5 w-5 ${vehicle.iconColor}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <span className="text-2xl font-bold">{estimatedPrice}</span>
                        <p className="text-sm text-gray-500 mt-1">Pour {selectedDistance} km</p>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Prix de base</span>
                          <span className="font-medium">{
                            {
                              'standard': '500 FCFA',
                              'comfort': '800 FCFA',
                              'premium': '1 200 FCFA',
                              'van': '1 500 FCFA'
                            }[vehicle.id]
                          }</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prix par km</span>
                          <span className="font-medium">{
                            {
                              'standard': '100 FCFA',
                              'comfort': '150 FCFA',
                              'premium': '200 FCFA',
                              'van': '250 FCFA'
                            }[vehicle.id]
                          }</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prix par minute</span>
                          <span className="font-medium">{
                            {
                              'standard': '50 FCFA',
                              'comfort': '75 FCFA',
                              'premium': '100 FCFA',
                              'van': '125 FCFA'
                            }[vehicle.id]
                          }</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/taxi/booking?vehicle=${vehicle.id}`)}
                      >
                        Réserver
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Facteurs influençant le prix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Heures de pointe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Majoration de 25-40% pendant les heures de pointe (7h-9h et 17h-19h)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Nuit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Majoration de 15-20% pour les courses de nuit (22h-5h)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Destination spéciale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Frais supplémentaires pour certaines destinations (aéroport, zone industrielle)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Frais d'attente après le temps d'attente gratuit (25 FCFA/min)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Bagages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Frais pour bagages supplémentaires (500 FCFA par bagage excédentaire)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Réduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Réductions pour les clients fidèles, codes promo et abonnements</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Section du tableau comparatif */}
        <TabsContent value="table" className="mt-6">
          <div className="bg-white rounded-lg border overflow-hidden max-w-4xl mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Caractéristiques</TableHead>
                  {vehicles.map(vehicle => (
                    <TableHead key={vehicle.id} className="text-center">
                      <div className="flex flex-col items-center">
                        <vehicle.icon className={`h-5 w-5 ${vehicle.iconColor} mb-1`} />
                        <span>{vehicle.name}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Passagers</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">{vehicle.passengers}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bagages</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">{vehicle.baggage.split(' ')[0]}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Climatisation</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">
                      {vehicle.features.climatisation ? 
                        <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                        <X className="h-4 w-4 text-red-500 mx-auto" />}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Wi-Fi</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">
                      {vehicle.features.wifi ? 
                        <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                        <X className="h-4 w-4 text-red-500 mx-auto" />}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rafraîchissements</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">
                      {vehicle.features.refreshments ? 
                        <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                        <X className="h-4 w-4 text-red-500 mx-auto" />}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Siège enfant</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">
                      {vehicle.features.childSeat ? 
                        <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                        <X className="h-4 w-4 text-red-500 mx-auto" />}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Accessibilité</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">
                      {vehicle.features.accessibility ? 
                        <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                        <X className="h-4 w-4 text-red-500 mx-auto" />}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Service prioritaire</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">
                      {vehicle.features.priorityService ? 
                        <Check className="h-4 w-4 text-green-500 mx-auto" /> : 
                        <X className="h-4 w-4 text-red-500 mx-auto" />}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Temps d'attente gratuit</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center">{vehicle.features.wait}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Annulation</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center text-xs">{vehicle.features.cancellation}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Prix de base</TableCell>
                  {vehicles.map(vehicle => (
                    <TableCell key={vehicle.id} className="text-center font-medium">{
                      {
                        'standard': '500 FCFA',
                        'comfort': '800 FCFA',
                        'premium': '1 200 FCFA',
                        'van': '1 500 FCFA'
                      }[vehicle.id]
                    }</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Utilisations recommandées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Car className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-lg">Standard</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Déplacements urbains quotidiens</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Trajets professionnels simples</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Petits groupes (1-4 personnes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Économie sur les trajets fréquents</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Car className="h-6 w-6 text-green-500" />
                <CardTitle className="text-lg">Confort</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Déplacements professionnels</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Trajets moyens (10-25 km)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Voyageurs avec bagages standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Confort plus élevé pour un prix modéré</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-purple-500" />
                <CardTitle className="text-lg">Premium</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Trajets d'affaires importants</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Déplacements VIP</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Service et confort maximal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Confidentialité et tranquillité</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-amber-500" />
                <CardTitle className="text-lg">Van</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Groupes de 4-7 personnes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Transport avec bagages volumineux</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Excursions et déplacements familiaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Événements spéciaux en groupe</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          size="lg" 
          onClick={() => navigate('/taxi/booking')}
          className="bg-primary/90 hover:bg-primary"
        >
          Réserver maintenant
        </Button>
      </div>
    </div>
  );
};

export default VehicleComparison;
