
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layout } from '@/components/Layout';
import { Check, ChevronRight, Info, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { SubscriptionPlan, SubscriptionBenefit, SubscriptionInterval } from '@/types/subscription';

export default function RestaurantSubscriptionPlans() {
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
        
        // For now we're using dummy data since the table might not exist
        // In production, this would be:
        // const { data: plansData } = await supabase.from('subscription_plans').select('*').eq('partner_type', 'restaurant');
        
        // Dummy data for now
        const plansData: SubscriptionPlan[] = [
          {
            id: 'plan_standard',
            name: 'Standard',
            tier: 'standard',
            description: 'Pour commencer avec les fonctionnalités essentielles',
            price: 0,
            interval: 'monthly',
            partner_type: 'restaurant',
            features: ['Présence sur la plateforme', 'Accès au tableau de bord', 'Gestion des commandes', 'Support standard'],
            commission_rate: 20,
            created_at: new Date().toISOString()
          },
          {
            id: 'plan_premium',
            name: 'Premium',
            tier: 'premium',
            description: 'Pour les restaurants qui veulent plus de visibilité',
            price: 25000,
            interval: 'monthly',
            partner_type: 'restaurant',
            features: [
              'Tout du plan Standard',
              'Visibilité améliorée',
              'Badge "Recommandé"', 
              'Commission réduite (15%)',
              'Support prioritaire',
              'Rapports détaillés',
              'Promotions boostées'
            ],
            popular: true,
            badge_text: 'Populaire',
            commission_rate: 15,
            created_at: new Date().toISOString()
          },
          {
            id: 'plan_elite',
            name: 'Elite',
            tier: 'elite',
            description: 'Pour les restaurants qui cherchent une visibilité maximale',
            price: 50000,
            interval: 'monthly',
            partner_type: 'restaurant',
            features: [
              'Tout du plan Premium',
              'Visibilité maximale',
              'Accès aux clients VIP',
              'Commission minimale (10%)',
              'Support dédié 24/7',
              'Offres exclusives',
              'Outils marketing avancés',
              'Analyses concurrentielles'
            ],
            commission_rate: 10,
            created_at: new Date().toISOString()
          }
        ];
        
        // Yearly plans - Apply a 20% discount for yearly plans
        const yearlyPlans = plansData.map(plan => ({
          ...plan,
          id: plan.id.replace('monthly', 'yearly'),
          interval: 'yearly' as SubscriptionInterval,
          price: Math.round(plan.price * 10.8),  // 10% discount for yearly
        }));
        
        const allPlans = [...plansData, ...yearlyPlans];
        
        setPlans(allPlans.filter(plan => plan.interval === billingInterval));
        
        // Fetch subscription benefits
        const benefitsData: SubscriptionBenefit[] = [
          {
            id: 'visibility_search',
            title: 'Affichage prioritaire',
            description: 'Apparaissez en haut des résultats de recherche',
            category: 'visibility',
            tier: ['premium', 'elite'],
            icon: 'search'
          },
          {
            id: 'visibility_badge',
            title: 'Badge "Recommandé"',
            description: 'Attirez plus de clients avec un badge distinctif',
            category: 'visibility',
            tier: ['premium', 'elite'],
            icon: 'tag'
          },
          {
            id: 'visibility_featured',
            title: 'Mise en avant sur la page d\'accueil',
            description: 'Rotation sur les emplacements VIP de la page d\'accueil',
            category: 'visibility',
            tier: 'elite',
            icon: 'home'
          },
          {
            id: 'commission_reduced',
            title: 'Commission réduite',
            description: 'Réduction sur les commissions prélevées par BuntuDelice',
            category: 'commission',
            tier: ['premium', 'elite'],
            icon: 'percent'
          },
          {
            id: 'commission_delivery',
            title: 'Frais de livraison réduits',
            description: 'Réduction sur les frais de livraison pour certaines zones',
            category: 'commission',
            tier: ['premium', 'elite'],
            icon: 'truck'
          },
          {
            id: 'marketing_promo',
            title: 'Boost des promotions',
            description: 'Plus grande exposition pour vos offres spéciales',
            category: 'marketing',
            tier: ['premium', 'elite'],
            icon: 'megaphone'
          },
          {
            id: 'marketing_ads',
            title: 'Publicité sponsorisée',
            description: 'Emplacements publicitaires sur la plateforme',
            category: 'marketing',
            tier: 'elite',
            icon: 'presentation'
          },
          {
            id: 'marketing_reports',
            title: 'Rapports détaillés',
            description: 'Accès à des statistiques avancées de performance',
            category: 'marketing',
            tier: ['premium', 'elite'],
            icon: 'bar-chart'
          },
          {
            id: 'tools_videos',
            title: 'Médias enrichis',
            description: 'Ajoutez des vidéos et animations à vos fiches',
            category: 'tools',
            tier: ['premium', 'elite'],
            icon: 'video'
          },
          {
            id: 'tools_hours',
            title: 'Gestion avancée des horaires',
            description: 'Planifiez vos horaires exceptionnels à l\'avance',
            category: 'tools',
            tier: ['premium', 'elite'],
            icon: 'calendar'
          },
          {
            id: 'tools_preorder',
            title: 'Gestion des précommandes',
            description: 'Permettez à vos clients de commander à l\'avance',
            category: 'tools',
            tier: 'elite',
            icon: 'clock'
          },
          {
            id: 'support_priority',
            title: 'Assistance prioritaire',
            description: 'Support accéléré en cas de problème',
            category: 'support',
            tier: ['premium', 'elite'],
            icon: 'headset'
          },
          {
            id: 'support_personal',
            title: 'Support personnalisé',
            description: 'Un conseiller dédié pour optimiser votre activité',
            category: 'support',
            tier: 'elite',
            icon: 'users'
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
          //   .eq('partner_type', 'restaurant')
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
      // Check if user has a restaurant
      // const { data: restaurants } = await supabase
      //   .from('restaurants')
      //   .select('id')
      //   .eq('user_id', user.id);
      
      // if (!restaurants || restaurants.length === 0) {
      //   toast.error('Vous devez d\'abord créer un restaurant');
      //   navigate('/restaurant/create');
      //   return;
      // }
      
      // Navigate to checkout page
      navigate(`/restaurant/subscription/checkout/${planId}`);
    } catch (error) {
      console.error('Error initiating subscription:', error);
      toast.error('Erreur lors de l\'initialisation de l\'abonnement');
    }
  };
  
  const isFeatureIncluded = (feature: string, planTier: SubscriptionTier) => {
    if (planTier === 'standard') {
      return feature.includes('standard') || feature.includes('Support standard');
    }
    
    if (planTier === 'premium') {
      return feature.includes('Standard') || !feature.includes('Elite');
    }
    
    return true; // Elite includes all features
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Plans d'abonnement pour Restaurants</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Boostez votre restaurant avec des outils et une visibilité accrue sur BuntuDelice
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
                          {plan.badge_text || 'Populaire'}
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
            <h2 className="text-2xl font-bold mb-8 text-center">Tous les avantages par catégorie</h2>
            
            <Tabs defaultValue="visibility">
              <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-4 mb-8">
                <TabsTrigger value="visibility">Visibilité</TabsTrigger>
                <TabsTrigger value="commission">Commission</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="tools">Outils</TabsTrigger>
              </TabsList>
              
              {['visibility', 'commission', 'marketing', 'tools'].map((category) => (
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
            <div className="flex items-start space-x-4">
              <Info className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="text-lg font-medium mb-2">Besoin d'un plan personnalisé?</h3>
                <p className="text-muted-foreground mb-4">
                  Pour les grandes chaînes de restaurants ou les besoins spécifiques, nous proposons des solutions sur mesure. Contactez notre équipe commerciale pour discuter de vos besoins.
                </p>
                <Button variant="outline" className="mt-2">
                  Contacter l'équipe commerciale
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
