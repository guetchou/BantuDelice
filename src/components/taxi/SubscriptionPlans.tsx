
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, Calendar, Clock, CreditCard, ArrowRight, Compass, 
  Users, Car, Truck, Shield, Star, Wallet, Bell, TimerReset 
} from "lucide-react";
import { useTaxiPricing } from '@/hooks/useTaxiPricing';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { calculateSubscriptionDiscount } = useTaxiPricing();
  const [planView, setPlanView] = useState<'individual' | 'business' | 'family'>('individual');
  
  const standardRidePrice = 5000; // Prix moyen d'une course standard
  
  // Plans individuels
  const individualPlans = [
    {
      id: 'daily',
      name: 'Pass Quotidien',
      frequency: 'daily' as const,
      rides: 20,
      price: calculateSubscriptionDiscount(standardRidePrice, 'daily', 20),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice, 'daily', 20) / 20),
      features: [
        'Courses illimitées en heures creuses',
        'Priorité de réservation',
        'Annulation gratuite',
        'Chauffeurs premium',
        'Service client dédié'
      ],
      popular: false,
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'weekly',
      name: 'Pass Business',
      frequency: 'weekly' as const,
      rides: 10,
      price: calculateSubscriptionDiscount(standardRidePrice, 'weekly', 10),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice, 'weekly', 10) / 10),
      features: [
        'Jusqu\'à 10 courses par semaine',
        'Voitures confort & premium',
        'Réservation à l\'avance',
        'Facture mensuelle unique',
        'Suivi des dépenses'
      ],
      popular: true,
      color: 'bg-primary/5 border-primary',
      buttonColor: 'bg-primary hover:bg-primary/90'
    },
    {
      id: 'monthly',
      name: 'Pass Flexible',
      frequency: 'monthly' as const,
      rides: 8,
      price: calculateSubscriptionDiscount(standardRidePrice, 'monthly', 8),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice, 'monthly', 8) / 8),
      features: [
        '8 courses par mois',
        'Report des courses non utilisées',
        'Chauffeurs 4.8+ étoiles',
        'Véhicules standard et confort',
        'Pas d\'engagement'
      ],
      popular: false,
      color: 'bg-green-50 border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    }
  ];
  
  // Plans familiaux
  const familyPlans = [
    {
      id: 'family-basic',
      name: 'Famille Basique',
      members: 'Jusqu\'à 3 membres',
      frequency: 'monthly' as const,
      rides: 15,
      price: calculateSubscriptionDiscount(standardRidePrice * 0.9, 'monthly', 15),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice * 0.9, 'monthly', 15) / 15),
      features: [
        '15 courses par mois à partager',
        'Courses d\'école programmables',
        'Véhicules adaptés aux familles',
        'Sièges enfants inclus',
        'Annulation gratuite 15 min avant'
      ],
      popular: false,
      color: 'bg-yellow-50 border-yellow-200',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      id: 'family-plus',
      name: 'Famille Plus',
      members: 'Jusqu\'à 5 membres',
      frequency: 'monthly' as const,
      rides: 25,
      price: calculateSubscriptionDiscount(standardRidePrice * 0.85, 'monthly', 25),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice * 0.85, 'monthly', 25) / 25),
      features: [
        '25 courses par mois à partager',
        'Courses d\'école et activités programmables',
        'Véhicules confort adaptés aux familles',
        'Sièges enfants et rehausseurs inclus',
        'Chauffeurs formés pour les enfants',
        'Annulation gratuite 30 min avant'
      ],
      popular: true,
      color: 'bg-primary/5 border-primary',
      buttonColor: 'bg-primary hover:bg-primary/90'
    },
    {
      id: 'family-premium',
      name: 'Famille Premium',
      members: 'Jusqu\'à 8 membres',
      frequency: 'monthly' as const,
      rides: 40,
      price: calculateSubscriptionDiscount(standardRidePrice * 0.8, 'monthly', 40),
      perRidePrice: Math.round(calculateSubscriptionDiscount(standardRidePrice * 0.8, 'monthly', 40) / 40),
      features: [
        '40 courses par mois à partager',
        'Van familial disponible',
        'Courses planifiables jusqu\'à 2 semaines',
        'Réservations multiples simultanées',
        'Assistance personnalisée 24/7',
        'Options de sécurité renforcées'
      ],
      popular: false,
      color: 'bg-purple-50 border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];
  
  // Plans entreprises
  const businessPlans = [
    {
      id: 'team',
      name: 'Pack Team',
      size: 'Pour les petites équipes',
      members: 'Jusqu\'à 5 employés',
      price: 45000,
      rides: 20,
      perRidePrice: Math.round(45000 / 20),
      features: [
        'Jusqu\'à 5 employés',
        '20 courses par mois',
        'Tableau de bord de gestion',
        'Facturation mensuelle unique',
        'Réservations via application et web'
      ],
      popular: false,
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'business',
      name: 'Pack Business',
      size: 'Pour les entreprises en croissance',
      members: 'Jusqu\'à 20 employés',
      price: 120000,
      rides: 60,
      perRidePrice: Math.round(120000 / 60),
      features: [
        'Jusqu\'à 20 employés',
        '60 courses par mois',
        'Analytics et rapports avancés',
        'Gestionnaire de compte dédié',
        'Services VIP disponibles',
        'API d\'intégration basique'
      ],
      popular: true,
      color: 'bg-primary/5 border-primary',
      buttonColor: 'bg-primary hover:bg-primary/90'
    },
    {
      id: 'enterprise',
      name: 'Pack Enterprise',
      size: 'Pour les grandes entreprises',
      members: 'Nombre illimité d\'employés',
      price: 0, // Sur mesure
      rides: 0, // Sur mesure
      perRidePrice: 0, // Sur mesure
      features: [
        'Nombre illimité d\'employés',
        'Volume personnalisé de courses',
        'API d\'intégration complète',
        'Tarifs négociés',
        'Service conciergerie 24/7',
        'Solutions sur mesure'
      ],
      popular: false,
      color: 'bg-gray-50 border-gray-200',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    }
  ];
  
  const handleSelectPlan = (planId: string) => {
    navigate(`/taxi/subscription/${planId}`);
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-3">Abonnements Taxi</h2>
        <p className="text-gray-600">
          Économisez sur vos déplacements réguliers avec nos forfaits adaptés à vos besoins
        </p>
      </div>
      
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
          <TabsTrigger 
            value="individual" 
            onClick={() => setPlanView('individual')}
          >
            Individuels
          </TabsTrigger>
          <TabsTrigger 
            value="family" 
            onClick={() => setPlanView('family')}
          >
            Familles
          </TabsTrigger>
          <TabsTrigger 
            value="business" 
            onClick={() => setPlanView('business')}
          >
            Entreprises
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {individualPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col h-full ${plan.popular ? `${plan.color} shadow-lg` : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 right-6 bg-primary">Populaire</Badge>
                )}
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" />
                    {plan.frequency === 'daily' && 'Idéal pour les trajets quotidiens'}
                    {plan.frequency === 'weekly' && 'Parfait pour les professionnels'}
                    {plan.frequency === 'monthly' && 'Pour les déplacements occasionnels'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold">{(plan.price / 1000).toFixed(1)}k</span>
                      <span className="text-lg font-medium">FCFA</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {plan.frequency === 'daily' && 'Par jour'}
                        {plan.frequency === 'weekly' && 'Par semaine'}
                        {plan.frequency === 'monthly' && 'Par mois'}
                      </span>
                      <span>•</span>
                      <span>{plan.perRidePrice} FCFA/course</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.buttonColor}`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Choisir ce forfait
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium mb-4">Options additionnelles pour les plans individuels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <Car className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Véhicule dédié</h4>
                  <p className="text-sm text-gray-600">+15 000 FCFA/mois - Même chauffeur et véhicule à chaque course</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Star className="h-5 w-5 text-amber-500 mt-1" />
                <div>
                  <h4 className="font-medium">Service VIP</h4>
                  <p className="text-sm text-gray-600">+20 000 FCFA/mois - Accès aux véhicules premium avec services extras</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Bell className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <h4 className="font-medium">Service urgent</h4>
                  <p className="text-sm text-gray-600">+10 000 FCFA/mois - Garantie de disponibilité sous 5 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="family" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {familyPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col h-full ${plan.popular ? `${plan.color} shadow-lg` : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 right-6 bg-primary">Populaire</Badge>
                )}
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4" />
                    <span>{plan.members}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold">{(plan.price / 1000).toFixed(1)}k</span>
                      <span className="text-lg font-medium">FCFA</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Par mois</span>
                      <span>•</span>
                      <span>{plan.perRidePrice} FCFA/course</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.buttonColor}`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Choisir ce forfait
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-6 mt-8 border border-yellow-200">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Sécurité et tranquillité d'esprit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <Car className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium">Chauffeurs vérifiés</h4>
                  <p className="text-sm text-gray-600">Tous nos chauffeurs sont soumis à des vérifications d'antécédents rigoureuses</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium">Mode enfant</h4>
                  <p className="text-sm text-gray-600">Notification aux parents et suivi en temps réel des trajets des enfants</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col h-full ${plan.popular ? `${plan.color} shadow-lg` : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 right-6 bg-primary">Populaire</Badge>
                )}
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4" />
                    <span>{plan.size}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="mb-6">
                    {plan.price > 0 ? (
                      <>
                        <div className="flex items-end gap-1">
                          <span className="text-3xl font-bold">{(plan.price / 1000).toFixed(0)}k</span>
                          <span className="text-lg font-medium">FCFA</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Par mois</span>
                          <span>•</span>
                          <span>{plan.perRidePrice} FCFA/course</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-xl font-medium">Sur mesure</span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.buttonColor}`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === 'enterprise' ? 'Contactez-nous' : 'En savoir plus'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 mt-8 border border-blue-200">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Avantages exclusifs pour les entreprises
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <CreditCard className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium">Facturation centralisée</h4>
                  <p className="text-sm text-gray-600">Facture mensuelle unique pour toutes les courses</p>
                </div>
              </div>
              <div className="flex gap-3">
                <BarChart2 className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium">Analytics avancés</h4>
                  <p className="text-sm text-gray-600">Suivi et optimisation des dépenses de transport</p>
                </div>
              </div>
              <div className="flex gap-3">
                <TimerReset className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium">Politique de flexibilité</h4>
                  <p className="text-sm text-gray-600">Annulations et modifications sans frais</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            Pourquoi choisir un abonnement ?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Économies</h4>
                <p className="text-sm text-gray-600">Jusqu'à 30% d'économies sur vos trajets réguliers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Simplicité</h4>
                <p className="text-sm text-gray-600">Un paiement unique et des réservations simplifiées</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Priorité</h4>
                <p className="text-sm text-gray-600">Accès prioritaire aux chauffeurs, même en heures de pointe</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Flexibilité</h4>
                <p className="text-sm text-gray-600">Modifiez ou annulez sans frais jusqu'à la dernière minute</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
