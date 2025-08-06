import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Clock, Shield, Truck, Zap } from 'lucide-react';

interface PricingFeature {
  id: string;
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  period: string;
  features: PricingFeature[];
  popular?: boolean;
  recommended?: boolean;
  icon: React.ComponentType<unknown>;
  color: string;
  bgColor: string;
}

interface ColisPricingCardProps {
  plans?: PricingPlan[];
  onSelectPlan?: (plan: PricingPlan) => void;
  showComparison?: boolean;
  showFeatures?: boolean;
}

const ColisPricingCard: React.FC<ColisPricingCardProps> = ({
  plans,
  onSelectPlan,
  showComparison = true,
  showFeatures = true
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const defaultPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Pour les envois occasionnels',
      price: 2500,
      currency: 'FCFA',
      period: 'par envoi',
      icon: Package,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      features: [
        { id: 'tracking', name: 'Suivi en temps réel', included: true },
        { id: 'insurance', name: 'Assurance de base', included: true },
        { id: 'support', name: 'Support email', included: true },
        { id: 'express', name: 'Livraison express', included: false },
        { id: 'priority', name: 'Support prioritaire', included: false },
        { id: 'api', name: 'Accès API', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Pour les entreprises',
      price: 15000,
      originalPrice: 20000,
      currency: 'FCFA',
      period: 'par mois',
      popular: true,
      recommended: true,
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      features: [
        { id: 'tracking', name: 'Suivi en temps réel', included: true, highlight: true },
        { id: 'insurance', name: 'Assurance premium', included: true, highlight: true },
        { id: 'support', name: 'Support téléphonique', included: true },
        { id: 'express', name: 'Livraison express', included: true, highlight: true },
        { id: 'priority', name: 'Support prioritaire', included: true },
        { id: 'api', name: 'Accès API complet', included: true, highlight: true }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solutions sur mesure',
      price: 50000,
      currency: 'FCFA',
      period: 'par mois',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      features: [
        { id: 'tracking', name: 'Suivi en temps réel', included: true, highlight: true },
        { id: 'insurance', name: 'Assurance complète', included: true, highlight: true },
        { id: 'support', name: 'Support dédié 24/7', included: true, highlight: true },
        { id: 'express', name: 'Livraison express', included: true, highlight: true },
        { id: 'priority', name: 'Support prioritaire', included: true, highlight: true },
        { id: 'api', name: 'API personnalisée', included: true, highlight: true }
      ]
    }
  ];

  const allPlans = plans || defaultPlans;

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan.id);
    onSelectPlan?.(plan);
  };

  const getDiscount = (plan: PricingPlan) => {
    if (plan.originalPrice) {
      return Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      {/* Toggle de période de facturation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'yearly'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Annuel
            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">-20%</Badge>
          </button>
        </div>
      </div>

      {/* Cartes de prix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allPlans.map((plan) => {
          const Icon = plan.icon;
          const discount = getDiscount(plan);
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card
              key={plan.id}
              className={`relative bg-white/90 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                isSelected ? 'ring-2 ring-orange-500' : ''
              } ${plan.popular ? 'scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}

              {plan.recommended && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                    Recommandé
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${plan.bgColor} mb-4`}>
                  <Icon className={`h-6 w-6 ${plan.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Prix */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {plan.originalPrice.toLocaleString('fr-FR')} {plan.currency}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-gray-800">
                      {plan.price.toLocaleString('fr-FR')} {plan.currency}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.period}</p>
                  {discount > 0 && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Économisez {discount}%
                    </Badge>
                  )}
                </div>

                {/* Fonctionnalités */}
                {showFeatures && (
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature.id} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included 
                            ? feature.highlight 
                              ? 'bg-orange-100 text-orange-600' 
                              : 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {feature.included ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-xs">×</span>
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included 
                            ? feature.highlight 
                              ? 'text-orange-700 font-medium' 
                              : 'text-gray-700'
                            : 'text-gray-500'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bouton d'action */}
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
                      : isSelected
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'Plan sélectionné' : 'Choisir ce plan'}
                </Button>

                {/* Informations supplémentaires */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>✓ Pas de frais cachés</p>
                  <p>✓ Annulation gratuite</p>
                  <p>✓ Support 24/7</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparaison détaillée */}
      {showComparison && (
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Zap className="h-5 w-5 text-orange-500" />
              Comparaison détaillée des plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fonctionnalités</th>
                    {allPlans.map((plan) => (
                      <th key={plan.id} className="text-center py-3 px-4 font-medium text-gray-700">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allPlans[0].features.map((feature) => (
                    <tr key={feature.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-600">{feature.name}</td>
                      {allPlans.map((plan) => {
                        const planFeature = plan.features.find(f => f.id === feature.id);
                        return (
                          <td key={plan.id} className="text-center py-3 px-4">
                            {planFeature?.included ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ ou informations supplémentaires */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Livraison rapide</h3>
            </div>
            <p className="text-blue-700 text-sm">
              Livraison en 24-48h pour les plans Pro et Enterprise. 
              Suivi en temps réel inclus.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-800">Assurance incluse</h3>
            </div>
            <p className="text-green-700 text-sm">
              Tous nos plans incluent une assurance de base. 
              Couverture étendue disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ColisPricingCard; 