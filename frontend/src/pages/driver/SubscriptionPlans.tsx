
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layout } from '@/components/Layout';
import { Check, ChevronRight, Info, Zap, Percent, Clock, Shield, Award } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { useUser } from '@/hooks/useUser';
import { SubscriptionPlan, SubscriptionBenefit, SubscriptionInterval } from '@/types/subscription';

export default function DriverSubscriptionPlans() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [benefits, setBenefits] = useState<SubscriptionBenefit[]>([]);
  const [billingInterval, setBillingInterval] = useState<SubscriptionInterval>('monthly');
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        
        // Dummy data for now
        const plansData: SubscriptionPlan[] = [
          {
            id: 'driver_standard',
            name: 'Standard',
            tier: 'standard',
            description: 'Pour commencer comme livreur',
            price: 0,
            interval: 'monthly',
            partner_type: 'driver',
            features: ['Accès aux livraisons standard', 'Tableau de bord de base', 'Support par email', 'Commission standard (15%)'],
            commission_rate: 15,
            created_at: new Date().toISOString()
          },
          {
            id: 'driver_premium',
            name: 'Premium',
            tier: 'premium',
            description: 'Pour les livreurs qui veulent gagner plus',
            price: 7500,
            interval: 'monthly',
            partner_type: 'driver',
            features: [
              'Tout du plan Standard',
              'Accès prioritaire aux commandes',
              'Mode multi-livraisons',
              'Commission réduite (10%)',
              'Support prioritaire',
              'Formations exclusives',
              'Bonus sur courses longues'
            ],
            popular: true,
            badge_text: 'Recommandé',
            commission_rate: 10,
            created_at: new Date().toISOString()
          },
          {
            id: 'driver_elite',
            name: 'Elite',
            tier: 'elite',
            description: 'Pour les livreurs professionnels à temps plein',
            price: 15000,
            interval: 'monthly',
            partner_type: 'driver',
            features: [
              'Tout du plan Premium',
              'Livraison express (tarifs majorés)',
              'Assurance livraison incluse',
              'Commission minimale (8%)',
              'Support dédié 24/7',
              'Formation avancée',
              'Priorisation maximale',
              'Statut vérifié et badge Elite'
            ],
            commission_rate: 8,
            created_at: new Date().toISOString()
          }
        ];
        
        // Yearly plans - Apply a 10% discount
        const yearlyPlans = plansData.map(plan => ({
          ...plan,
          id: plan.id + '_yearly',
          interval: 'yearly' as SubscriptionInterval,
          price: Math.round(plan.price * 10.8), // 10% discount for yearly
        }));
        
        const allPlans = [...plansData, ...yearlyPlans];
        
        setPlans(allPlans.filter(plan => plan.interval === billingInterval));
        
        // Fetch subscription benefits
        const benefitsData: SubscriptionBenefit[] = [
          {
            id: 'orders_priority',
            title: 'Accès prioritaire aux livraisons',
            description: 'Recevez les commandes plus rentables en priorité',
            category: 'orders',
            tier: ['premium', 'elite'],
            icon: 'zap'
          },
          {
            id: 'orders_express',
            title: 'Livraisons express',
            description: 'Accès aux courses urgentes avec bonus',
            category: 'orders',
            tier: 'elite',
            icon: 'zap'
          },
          {
            id: 'orders_multi',
            title: 'Mode multi-livraisons',
            description: 'Prenez plusieurs commandes en une seule course',
            category: 'orders',
            tier: ['premium', 'elite'],
            icon: 'layers'
          },
          {
            id: 'commission_reduced',
            title: 'Commission réduite',
            description: 'Moins de frais prélevés sur vos gains',
            category: 'commission',
            tier: ['premium', 'elite'],
            icon: 'percent'
          },
          {
            id: 'commission_bonus',
            title: 'Bonus sur courses spéciales',
            description: 'Primes additionnelles sur courses longues ou complexes',
            category: 'commission',
            tier: ['premium', 'elite'],
            icon: 'plus-circle'
          },
          {
            id: 'tools_analytics',
            title: 'Analyses de performance',
            description: 'Statistiques détaillées sur vos livraisons',
            category: 'tools',
            tier: ['premium', 'elite'],
            icon: 'bar-chart'
          },
          {
            id: 'tools_route',
            title: 'Optimisation des itinéraires',
            description: 'Algorithmes avancés pour optimiser vos parcours',
            category: 'tools',
            tier: ['premium', 'elite'],
            icon: 'map'
          },
          {
            id: 'support_priority',
            title: 'Support prioritaire',
            description: 'Assistance rapide en cas de problème',
            category: 'support',
            tier: ['premium', 'elite'],
            icon: 'headset'
          },
          {
            id: 'support_training',
            title: 'Formations exclusives',
            description: 'Accès à des formations pour optimiser vos livraisons',
            category: 'support',
            tier: ['premium', 'elite'],
            icon: 'graduation-cap'
          },
          {
            id: 'security_insurance',
            title: 'Assurance livraison',
            description: 'Protection contre les incidents pendant les livraisons',
            category: 'security',
            tier: 'elite',
            icon: 'shield'
          },
          {
            id: 'security_verification',
            title: 'Badge vérifié Elite',
            description: 'Badge spécial montrant votre statut vérifié',
            category: 'security',
            tier: 'elite',
            icon: 'check-circle'
          }
        ];
        
        setBenefits(benefitsData);
        
        // Check if user has a current subscription
        if (user) {
          // In production:
          // const { data: subscriptionData } = await supabase
          //   .from('partner_subscriptions')
          //   .select('*, plan:subscription_plans(*)')
          //   .eq('user_id', user.id)
          //   .eq('partner_type', 'driver')
          //   .eq('status', 'active')
          //   .single();
          
          // if (subscriptionData) {
          //   setCurrentPlan(subscriptionData.plan);
          // }
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        toast.error('Erreur lors du chargement des plans d\'abonnement');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [user, billingInterval]);
  
  const handleSubscription = async (planId: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour vous abonner');
      navigate('/auth');
      return;
    }
    
    try {
      // Check if user is a driver
      // const { data: driver } = await supabase
      //   .from('delivery_drivers')
      //   .select('id')
      //   .eq('user_id', user.id)
      //   .single();
      
      // if (!driver) {
      //   toast.error('Vous devez d\'abord vous inscrire comme livreur');
      //   navigate('/driver/registration');
      //   return;
      // }
      
      // Navigate to checkout page
      navigate(`/driver/subscription/checkout/${planId}`);
    } catch (error) {
      console.error('Error initiating subscription:', error);
      toast.error('Erreur lors de l\'initialisation de l\'abonnement');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Plans d'abonnement pour Livreurs</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Maximisez vos revenus avec nos plans d'abonnement pour livreurs
            </p>
            
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Label htmlFor="billing-interval" className="text-sm font-medium">
                Mensuel
              </Label>
              <Switch
                id="billing-interval"
                checked={billingInterval === 'yearly'}
                onCheckedChange={(checked) => setBillingInterval(checked ? 'yearly' : 'monthly')}
              />
              <Label htmlFor="billing-interval" className="text-sm font-medium flex items-center">
                Annuel
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                  -10%
                </Badge>
              </Label>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-lg border shadow-sm bg-card">
                  <CardHeader className="h-40 bg-gray-200"></CardHeader>
                  <CardContent className="p-6">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="h-4 bg-gray-200 rounded-full w-full"></div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="h-12 bg-gray-200 rounded"></CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans
                .filter(plan => plan.interval === billingInterval)
                .sort((a, b) => {
                  const tierOrder = { standard: 1, premium: 2, elite: 3 };
                  return tierOrder[a.tier] - tierOrder[b.tier];
                })
                .map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`rounded-lg border relative ${
                      plan.popular ? 'border-primary shadow-md' : 'shadow-sm'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                        <Badge className="bg-primary text-white">
                          {plan.badge_text || 'Recommandé'}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pt-8">
                      <CardTitle className="text-2xl font-bold mb-1">{plan.name}</CardTitle>
                      <p className="text-muted-foreground">{plan.description}</p>
                      
                      <div className="mt-6 mb-2">
                        <span className="text-3xl font-bold">
                          {plan.price > 0 ? `${plan.price.toLocaleString()} FCFA` : 'Gratuit'}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {plan.price > 0 ? `/${billingInterval === 'monthly' ? 'mois' : 'an'}` : ''}
                        </span>
                      </div>
                      
                      {plan.commission_rate && (
                        <Badge variant="outline" className="mt-2">
                          Commission: {plan.commission_rate}%
                        </Badge>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={plan.tier === 'standard' ? 'outline' : 'default'}
                        onClick={() => handleSubscription(plan.id)}
                      >
                        {plan.tier === 'standard' ? 'Plan actuel' : 'Sélectionner'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Avantages par catégorie</h2>
            
            <Tabs defaultValue="orders">
              <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-5 mb-8">
                <TabsTrigger value="orders">Commandes</TabsTrigger>
                <TabsTrigger value="commission">Gains</TabsTrigger>
                <TabsTrigger value="tools">Outils</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>
              
              {['orders', 'commission', 'tools', 'support', 'security'].map((category) => (
                <TabsContent key={category} value={category} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {benefits
                      .filter(benefit => benefit.category === category)
                      .map(benefit => (
                        <Card key={benefit.id} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-xl flex items-center gap-2">
                              {benefit.title}
                              {Array.isArray(benefit.tier) ? (
                                benefit.tier.includes('premium') && !benefit.tier.includes('elite') ? (
                                  <Badge className="bg-primary/90 text-white">Premium+</Badge>
                                ) : benefit.tier.includes('elite') && !benefit.tier.includes('premium') ? (
                                  <Badge className="bg-teal-600 text-white">Elite</Badge>
                                ) : (
                                  <Badge className="bg-primary/90 text-white">Premium+</Badge>
                                )
                              ) : (
                                <Badge className={benefit.tier === 'elite' ? 'bg-teal-600 text-white' : 'bg-primary/90 text-white'}>
                                  {benefit.tier === 'elite' ? 'Elite' : 'Premium'}
                                </Badge>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{benefit.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="mt-16 bg-muted/50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Commandes prioritaires</h3>
                  <p className="text-muted-foreground">Accédez aux commandes les plus rentables</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Percent className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Commissions réduites</h3>
                  <p className="text-muted-foreground">Gardez une plus grande part de vos gains</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Protection assurée</h3>
                  <p className="text-muted-foreground">Travaillez l'esprit tranquille</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Commencer maintenant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
