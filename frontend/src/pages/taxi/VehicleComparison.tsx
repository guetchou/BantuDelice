
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, Shield, Clock, Wallet, CheckCircle, Users, Lightbulb, Battery, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TaxiVehicleComparison = () => {
  const navigate = useNavigate();
  
  const vehicleTypes = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Véhicules économiques pour les trajets quotidiens',
      icon: Car,
      basePrice: '3000 FCFA',
      capacity: '4 passagers',
      waitingTime: '3-5 minutes',
      features: ['Climatisation', 'Prise de charge USB', 'Eau gratuite'],
      advantages: ['Économique', 'Disponible partout', 'Rapide'],
      rating: 4.2,
      recommended: ['Trajets quotidiens', 'Déplacements urbains']
    },
    {
      id: 'comfort',
      name: 'Confort',
      description: 'Véhicules plus spacieux avec équipements premium',
      icon: Shield,
      basePrice: '4500 FCFA',
      capacity: '4 passagers',
      waitingTime: '4-6 minutes',
      features: ['Climatisation premium', 'Sièges en cuir', 'Eau et snacks gratuits', 'Chargeur sans fil'],
      advantages: ['Plus d\'espace', 'Expérience premium', 'Chauffeurs expérimentés'],
      rating: 4.5,
      recommended: ['Rendez-vous professionnels', 'Occasions spéciales']
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Berlines et SUV haut de gamme pour une expérience VIP',
      icon: Star,
      basePrice: '6000 FCFA',
      capacity: '4 passagers',
      waitingTime: '5-8 minutes',
      features: ['Véhicules haut de gamme', 'Service de conciergerie', 'Boissons premium', 'WiFi 5G intégré'],
      advantages: ['Service VIP', 'Confidentialité', 'Statut & prestige'],
      rating: 4.8,
      recommended: ['Événements importants', 'Clients VIP', 'Expériences luxueuses']
    },
    {
      id: 'van',
      name: 'Van',
      description: 'Véhicules spacieux pour les groupes ou bagages volumineux',
      icon: Users,
      basePrice: '7000 FCFA',
      capacity: '7 passagers',
      waitingTime: '6-10 minutes',
      features: ['Grande capacité', 'Espace pour bagages', 'Sièges modulables', 'Prises de charge multiples'],
      advantages: ['Idéal pour groupes', 'Parfait pour bagages', 'Confortable pour longs trajets'],
      rating: 4.3,
      recommended: ['Groupes', 'Aéroport', 'Événements familiaux']
    },
    {
      id: 'electric',
      name: 'Électrique',
      description: 'Véhicules écologiques pour réduire votre empreinte carbone',
      icon: Battery,
      basePrice: '4000 FCFA',
      capacity: '4 passagers',
      waitingTime: '4-7 minutes',
      features: ['Zéro émission', 'Silencieux', 'Moderne', 'Écologique'],
      advantages: ['Respect de l\'environnement', 'Conduite silencieuse', 'Technologies avancées'],
      rating: 4.6,
      recommended: ['Éco-conscients', 'Trajets urbains', 'Entreprises RSE']
    }
  ];
  
  const subscriptionComparison = [
    {
      feature: 'Réduction sur courses',
      basic: '10%',
      premium: '20%',
      business: '25-35%'
    },
    {
      feature: 'Annulations gratuites',
      basic: '1 par mois',
      premium: '3 par mois',
      business: 'Illimitées'
    },
    {
      feature: 'Chauffeurs favoris',
      basic: '✓',
      premium: '✓',
      business: '✓'
    },
    {
      feature: 'Assistance prioritaire',
      basic: '✗',
      premium: '✓',
      business: '✓'
    },
    {
      feature: 'Véhicules premium',
      basic: 'Tarif normal',
      premium: 'Accès prioritaire',
      business: 'Tarif réduit'
    },
    {
      feature: 'Facturation entreprise',
      basic: '✗',
      premium: '✗',
      business: '✓'
    }
  ];
  
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
        <h1 className="text-3xl font-bold">Comparaison des services</h1>
      </div>
      
      <TaxiNavigationMenu />
      
      <div className="max-w-5xl mx-auto mt-6">
        <Tabs defaultValue="vehicles">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="vehicles">Types de véhicules</TabsTrigger>
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicles">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {vehicleTypes.map((vehicle) => {
                const VehicleIcon = vehicle.icon;
                return (
                  <Card key={vehicle.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className={`h-2 w-full ${vehicle.id === 'premium' ? 'bg-amber-500' : vehicle.id === 'electric' ? 'bg-green-500' : 'bg-primary'}`}></div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center text-lg">
                            <VehicleIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                            {vehicle.name}
                          </CardTitle>
                          <CardDescription>{vehicle.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {vehicle.basePrice} base
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted p-2 rounded text-center">
                          <p className="text-xs text-muted-foreground">Capacité</p>
                          <p className="font-medium">{vehicle.capacity}</p>
                        </div>
                        <div className="bg-muted p-2 rounded text-center">
                          <p className="text-xs text-muted-foreground">Attente moyenne</p>
                          <p className="font-medium">{vehicle.waitingTime}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Caractéristiques</h4>
                        <ul className="text-sm space-y-1">
                          {vehicle.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Recommandé pour</h4>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.recommended.map((rec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          className="w-full"
                          variant="outline"
                          onClick={() => navigate(`/taxi/booking?vehicleType=${vehicle.id}`)}
                        >
                          Réserver maintenant
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Comparaison détaillée des véhicules</CardTitle>
                <CardDescription>
                  Choisissez le type de véhicule qui correspond le mieux à vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Caractéristique</TableHead>
                        <TableHead>Standard</TableHead>
                        <TableHead>Confort</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead>Van</TableHead>
                        <TableHead>Électrique</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Tarif de base</TableCell>
                        <TableCell>3000 FCFA</TableCell>
                        <TableCell>4500 FCFA</TableCell>
                        <TableCell>6000 FCFA</TableCell>
                        <TableCell>7000 FCFA</TableCell>
                        <TableCell>4000 FCFA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Prix/km</TableCell>
                        <TableCell>150 FCFA</TableCell>
                        <TableCell>220 FCFA</TableCell>
                        <TableCell>300 FCFA</TableCell>
                        <TableCell>350 FCFA</TableCell>
                        <TableCell>200 FCFA</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Capacité passagers</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>4</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Capacité bagages</TableCell>
                        <TableCell>2 valises</TableCell>
                        <TableCell>3 valises</TableCell>
                        <TableCell>4 valises</TableCell>
                        <TableCell>7+ valises</TableCell>
                        <TableCell>2 valises</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Temps d'attente moyen</TableCell>
                        <TableCell>3-5 min</TableCell>
                        <TableCell>4-6 min</TableCell>
                        <TableCell>5-8 min</TableCell>
                        <TableCell>6-10 min</TableCell>
                        <TableCell>4-7 min</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Annulation gratuite</TableCell>
                        <TableCell>1 min</TableCell>
                        <TableCell>3 min</TableCell>
                        <TableCell>5 min</TableCell>
                        <TableCell>5 min</TableCell>
                        <TableCell>3 min</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Expérience chauffeur</TableCell>
                        <TableCell>Standard</TableCell>
                        <TableCell>Avancée</TableCell>
                        <TableCell>Premium</TableCell>
                        <TableCell>Spécialisée</TableCell>
                        <TableCell>Spécialisée</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Note clients</TableCell>
                        <TableCell>4.2/5</TableCell>
                        <TableCell>4.5/5</TableCell>
                        <TableCell>4.8/5</TableCell>
                        <TableCell>4.3/5</TableCell>
                        <TableCell>4.6/5</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                  Conseils pour choisir le bon véhicule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-3 rounded-lg">
                    <h3 className="font-medium mb-1">Pour les trajets quotidiens</h3>
                    <p className="text-sm text-muted-foreground">
                      Le service <span className="font-medium">Standard</span> ou <span className="font-medium">Électrique</span> 
                      est recommandé pour les déplacements réguliers et économiques.
                    </p>
                  </div>
                  <div className="border p-3 rounded-lg">
                    <h3 className="font-medium mb-1">Pour les rendez-vous professionnels</h3>
                    <p className="text-sm text-muted-foreground">
                      Optez pour <span className="font-medium">Confort</span> ou <span className="font-medium">Premium</span> 
                      qui offrent une expérience plus haut de gamme.
                    </p>
                  </div>
                  <div className="border p-3 rounded-lg">
                    <h3 className="font-medium mb-1">Pour les groupes ou familles</h3>
                    <p className="text-sm text-muted-foreground">
                      Le service <span className="font-medium">Van</span> est idéal pour accommoder 
                      jusqu'à 7 personnes avec leurs bagages.
                    </p>
                  </div>
                  <div className="border p-3 rounded-lg">
                    <h3 className="font-medium mb-1">Pour l'aéroport</h3>
                    <p className="text-sm text-muted-foreground">
                      Choisissez <span className="font-medium">Confort</span> ou <span className="font-medium">Van</span> 
                      qui offrent plus d'espace pour les bagages.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <div className="h-2 w-full bg-blue-500"></div>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>
                    Pour les utilisateurs occasionnels
                  </CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">3 500 FCFA</span>
                    <span className="text-muted-foreground text-sm ml-2">/ mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>10% de réduction sur toutes les courses</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>1 annulation gratuite par mois</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Option de chauffeurs favoris</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full" onClick={() => navigate('/taxi/subscription')}>
                    Souscrire maintenant
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-shadow relative border-primary/30">
                <div className="h-2 w-full bg-primary"></div>
                <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Populaire
                </div>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>
                    Pour les utilisateurs réguliers
                  </CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">8 500 FCFA</span>
                    <span className="text-muted-foreground text-sm ml-2">/ mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>20% de réduction sur toutes les courses</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>3 annulations gratuites par mois</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Assistance prioritaire 24/7</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Accès prioritaire aux véhicules premium</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full" onClick={() => navigate('/taxi/subscription')}>
                    Souscrire maintenant
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <div className="h-2 w-full bg-amber-500"></div>
                <CardHeader>
                  <CardTitle>Business</CardTitle>
                  <CardDescription>
                    Pour les entreprises et leurs employés
                  </CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">Sur mesure</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>25-35% de réduction selon volume</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Annulations gratuites illimitées</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Facturation mensuelle centralisée</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Gestionnaire de compte dédié</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full" onClick={() => navigate('/taxi/business')}>
                    Demander un devis
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Comparaison des abonnements</CardTitle>
                <CardDescription>
                  Un tableau détaillé pour vous aider à choisir le meilleur abonnement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Fonctionnalité</TableHead>
                        <TableHead>Basic</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead>Business</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptionComparison.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.feature}</TableCell>
                          <TableCell>{item.basic}</TableCell>
                          <TableCell>{item.premium}</TableCell>
                          <TableCell>{item.business}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-primary" />
                    Économies estimées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Selon votre fréquence d'utilisation, voici les économies potentielles avec nos abonnements:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border p-3 rounded-lg">
                      <h3 className="font-medium">Utilisateur occasionnel (4 courses/mois)</h3>
                      <ul className="text-sm mt-2 space-y-1">
                        <li className="flex justify-between">
                          <span>Coût moyen sans abonnement:</span>
                          <span className="font-medium">16 000 FCFA</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Coût avec abonnement Basic:</span>
                          <span className="font-medium">17 900 FCFA</span>
                        </li>
                        <li className="flex justify-between text-red-500">
                          <span>Économies:</span>
                          <span className="font-medium">-1 900 FCFA</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border p-3 rounded-lg">
                      <h3 className="font-medium">Utilisateur régulier (10 courses/mois)</h3>
                      <ul className="text-sm mt-2 space-y-1">
                        <li className="flex justify-between">
                          <span>Coût moyen sans abonnement:</span>
                          <span className="font-medium">40 000 FCFA</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Coût avec abonnement Basic:</span>
                          <span className="font-medium">39 500 FCFA</span>
                        </li>
                        <li className="flex justify-between text-green-500">
                          <span>Économies:</span>
                          <span className="font-medium">+500 FCFA</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border p-3 rounded-lg">
                      <h3 className="font-medium">Utilisateur fréquent (20 courses/mois)</h3>
                      <ul className="text-sm mt-2 space-y-1">
                        <li className="flex justify-between">
                          <span>Coût moyen sans abonnement:</span>
                          <span className="font-medium">80 000 FCFA</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Coût avec abonnement Premium:</span>
                          <span className="font-medium">72 500 FCFA</span>
                        </li>
                        <li className="flex justify-between text-green-500">
                          <span>Économies:</span>
                          <span className="font-medium">+7 500 FCFA</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                    Quel abonnement vous convient?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border p-3 rounded-lg">
                      <h3 className="font-medium mb-1">Basic est idéal si vous:</h3>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Utilisez le service 5-8 fois par mois</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Souhaitez des économies modestes</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Avez un budget limité pour l'abonnement</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border p-3 rounded-lg">
                      <h3 className="font-medium mb-1">Premium est idéal si vous:</h3>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Utilisez le service 10+ fois par mois</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Préférez le confort et le service prioritaire</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Changez souvent vos plans (annulations)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border p-3 rounded-lg">
                      <h3 className="font-medium mb-1">Business est idéal si vous:</h3>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Gérez les déplacements de plusieurs employés</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Préférez une facturation centralisée</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>Avez besoin d'un service personnalisé</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaxiVehicleComparison;
