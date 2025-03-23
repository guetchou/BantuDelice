import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, CreditCard, ArrowRight, Compass } from "lucide-react";
import { useTaxiPricing } from '@/hooks/useTaxiPricing';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { calculateSubscriptionDiscount } = useTaxiPricing();
  
  const standardRidePrice = 5000; // Prix moyen d'une course standard
  
  const plans = [
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
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
