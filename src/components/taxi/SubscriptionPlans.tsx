
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Star, BarChart } from "lucide-react";
import { TaxiSubscriptionPlan } from '@/types/taxi';

interface SubscriptionPlansProps {
  onSelectPlan?: (plan: TaxiSubscriptionPlan) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSelectPlan }) => {
  const subscriptionPlans: TaxiSubscriptionPlan[] = [
    {
      id: "1",
      name: "Plan Essentiel",
      description: "Parfait pour les utilisateurs occasionnels",
      price: 10000,
      duration: 30, // en jours
      features: [
        "10% de réduction sur chaque course",
        "Annulation gratuite jusqu'à 5 min avant le départ",
        "Priorité modérée sur les réservations",
        "Support client standard"
      ],
      discount_percentage: 10,
      max_rides: 15,
      type: "individual",
      popular: false
    },
    {
      id: "2",
      name: "Plan Premium",
      description: "Idéal pour les utilisateurs réguliers",
      price: 25000,
      duration: 30, // en jours
      features: [
        "20% de réduction sur chaque course",
        "Annulation gratuite jusqu'à la prise en charge",
        "Priorité élevée sur les réservations",
        "Support client prioritaire 24/7",
        "Véhicules premium disponibles"
      ],
      discount_percentage: 20,
      max_rides: 30,
      type: "individual",
      popular: true
    },
    {
      id: "3",
      name: "Plan Famille",
      description: "Économisez en famille (jusqu'à 5 membres)",
      price: 45000,
      duration: 30, // en jours
      features: [
        "25% de réduction sur chaque course",
        "Partage avec 5 membres de la famille",
        "Annulation gratuite à tout moment",
        "Support VIP dédié 24/7",
        "Véhicules premium disponibles",
        "Option de facturation unique"
      ],
      discount_percentage: 25,
      max_rides: 60,
      type: "family",
      popular: false
    },
    {
      id: "4",
      name: "Plan Entreprise",
      description: "Solution pour les équipes professionnelles",
      price: 100000,
      duration: 30, // en jours
      features: [
        "30% de réduction sur chaque course",
        "Nombre illimité d'employés",
        "Console d'administration dédiée",
        "Facturation mensuelle simplifiée",
        "Rapports détaillés d'utilisation",
        "Gestionnaire de compte personnel"
      ],
      discount_percentage: 30,
      max_rides: null,
      type: "business",
      popular: false
    }
  ];

  const handleSelectPlan = (plan: TaxiSubscriptionPlan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {subscriptionPlans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`flex flex-col h-full transition-all duration-300 hover:shadow-lg ${
            plan.popular ? 'border-primary shadow-md' : 'border-border'
          }`}
        >
          <CardHeader className="pb-4">
            {plan.popular && (
              <Badge className="self-start mb-2 bg-primary text-white">Populaire</Badge>
            )}
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="text-sm mt-1">{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                {(plan.price).toLocaleString()} FCFA
              </span>
              <span className="text-muted-foreground ml-1 text-sm">/mois</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{plan.duration} jours</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                <span>{plan.discount_percentage}% off</span>
              </div>
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                <span>{plan.max_rides === null ? 'Illimité' : `${plan.max_rides} courses`}</span>
              </div>
            </div>
            <Button 
              className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
              onClick={() => handleSelectPlan(plan)}
            >
              Sélectionner
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
