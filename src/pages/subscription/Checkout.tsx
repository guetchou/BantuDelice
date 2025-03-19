
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { CreditCard, ArrowLeft, Check, AlertCircle, Smartphone } from 'lucide-react';
import MobilePayment from '@/components/payment/MobilePayment';
import { SubscriptionPlan, PartnerSubscription } from '@/types/subscription';

export default function SubscriptionCheckout() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [partnerType, setPartnerType] = useState<'restaurant' | 'driver'>('restaurant');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPlanData = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        setLoading(true);
        
        // Determine the partner type from the planId
        const isDriverPlan = planId?.includes('driver');
        setPartnerType(isDriverPlan ? 'driver' : 'restaurant');
        
        // For now, we use dummy data since tables might not exist yet
        // In production:
        // const { data: planData, error } = await supabase
        //   .from('subscription_plans')
        //   .select('*')
        //   .eq('id', planId)
        //   .single();
        
        // if (error) throw error;
        
        // Dummy plan data based on planId
        let planData: SubscriptionPlan;
        
        if (planId?.includes('standard')) {
          planData = {
            id: planId,
            name: 'Standard',
            tier: 'standard',
            description: 'Plan de base',
            price: 0,
            interval: planId?.includes('yearly') ? 'yearly' : 'monthly',
            partner_type: isDriverPlan ? 'driver' : 'restaurant',
            features: ['Fonctionnalités de base'],
            created_at: new Date().toISOString()
          };
        } else if (planId?.includes('premium')) {
          planData = {
            id: planId,
            name: 'Premium',
            tier: 'premium',
            description: 'Plan avancé avec plus de visibilité',
            price: isDriverPlan ? 7500 : 25000,
            interval: planId?.includes('yearly') ? 'yearly' : 'monthly',
            partner_type: isDriverPlan ? 'driver' : 'restaurant',
            features: ['Tout du plan Standard', 'Visibilité améliorée', 'Commission réduite'],
            commission_rate: isDriverPlan ? 10 : 15,
            created_at: new Date().toISOString()
          };
        } else {
          planData = {
            id: planId || 'unknown',
            name: 'Elite',
            tier: 'elite',
            description: 'Plan premium avec tout inclus',
            price: isDriverPlan ? 15000 : 50000,
            interval: planId?.includes('yearly') ? 'yearly' : 'monthly',
            partner_type: isDriverPlan ? 'driver' : 'restaurant',
            features: ['Tout du plan Premium', 'Visibilité maximale', 'Commission minimale'],
            commission_rate: isDriverPlan ? 8 : 10,
            created_at: new Date().toISOString()
          };
        }
        
        // If yearly, apply discount
        if (planData.interval === 'yearly' && planData.price > 0) {
          planData.price = Math.round(planData.price * 10.8); // 10% discount
        }
        
        setPlan(planData);
        
        // Check if user has a restaurant or is a driver
        if (isDriverPlan) {
          // In production:
          // const { data: driver } = await supabase
          //   .from('delivery_drivers')
          //   .select('id')
          //   .eq('user_id', user.id)
          //   .single();
          
          // if (driver) setPartnerId(driver.id);
          setPartnerId('dummy-driver-id');
        } else {
          // In production:
          // const { data: restaurant } = await supabase
          //   .from('restaurants')
          //   .select('id')
          //   .eq('user_id', user.id)
          //   .single();
          
          // if (restaurant) setPartnerId(restaurant.id);
          setPartnerId('dummy-restaurant-id');
        }
      } catch (error) {
        console.error('Error fetching plan data:', error);
        toast.error('Erreur lors du chargement du plan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlanData();
  }, [planId, user, navigate]);
  
  const handleSubscribe = async () => {
    if (!user || !plan || !partnerId) {
      toast.error('Informations manquantes pour finaliser l\'abonnement');
      return;
    }
    
    try {
      setProcessing(true);
      
      // In production, create subscription records
      // const { data: subscription, error } = await supabase
      //   .from('partner_subscriptions')
      //   .insert({
      //     user_id: user.id,
      //     partner_id: partnerId,
      //     partner_type: partnerType,
      //     plan_id: plan.id,
      //     status: 'active',
      //     current_period_start: new Date().toISOString(),
      //     current_period_end: new Date(Date.now() + (plan.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
      //     cancel_at_period_end: false,
      //   })
      //   .select()
      //   .single();
      
      // if (error) throw error;
      
      // Create a transaction record
      // await supabase.from('subscription_transactions').insert({
      //   subscription_id: subscription.id,
      //   amount: plan.price,
      //   status: 'completed',
      //   payment_method: paymentMethod,
      // });
      
      // For demo purposes, simulate a successful subscription
      setTimeout(() => {
        toast.success('Abonnement activé avec succès!');
        navigate(`/${partnerType}/dashboard`);
      }, 2000);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Erreur lors de la création de l\'abonnement');
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded mt-8"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!plan) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Plan non trouvé</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Le plan d'abonnement demandé n'a pas été trouvé.</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/${partnerType}/subscription/plans`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux plans
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(`/${partnerType}/subscription/plans`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux plans
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Finaliser votre abonnement</CardTitle>
                <CardDescription>
                  {plan.interval === 'monthly' ? 'Abonnement mensuel' : 'Abonnement annuel'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {plan.price > 0 ? (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Méthode de paiement</h3>
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={(v) => setPaymentMethod(v as 'mobile_money' | 'card')}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mobile_money" id="mobile_money" />
                          <Label htmlFor="mobile_money" className="flex items-center">
                            <Smartphone className="h-5 w-5 mr-2 text-orange-500" />
                            Mobile Money (Orange Money, MTN MoMo)
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                            Carte Bancaire (Visa, Mastercard)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    {paymentMethod === 'mobile_money' ? (
                      <MobilePayment 
                        amount={plan.price} 
                        description={`Abonnement ${plan.name} - ${plan.interval === 'monthly' ? 'Mensuel' : 'Annuel'}`}
                        onSuccess={handleSubscribe}
                        onError={() => toast.error('Erreur de paiement')}
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card_number">Numéro de carte</Label>
                          <Input id="card_number" placeholder="1234 5678 9012 3456" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Date d'expiration</Label>
                            <Input id="expiry" placeholder="MM/AA" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom sur la carte</Label>
                          <Input id="name" placeholder="Jean Dupont" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-800">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 mr-2 mt-1 text-green-600" />
                      <div>
                        <h3 className="font-medium">Plan gratuit</h3>
                        <p className="text-sm">Aucun paiement requis pour activer ce plan</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Information importante</h3>
                      <p className="text-sm">
                        {plan.interval === 'monthly'
                          ? 'Votre abonnement sera renouvelé automatiquement chaque mois. Vous pouvez annuler à tout moment depuis votre tableau de bord.'
                          : 'Votre abonnement sera renouvelé automatiquement chaque année. Vous pouvez annuler à tout moment depuis votre tableau de bord.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleSubscribe}
                  disabled={processing || (plan.price > 0 && paymentMethod === 'card')}
                >
                  {processing ? 'Traitement en cours...' : plan.price > 0 ? 'Payer et s\'abonner' : 'Activer l\'abonnement'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Prix</span>
                    <span>{plan.price > 0 ? `${plan.price.toLocaleString()} FCFA` : 'Gratuit'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Période</span>
                    <span>{plan.interval === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                  </div>
                  
                  {plan.commission_rate && (
                    <div className="flex justify-between">
                      <span>Commission</span>
                      <span>{plan.commission_rate}%</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{plan.price > 0 ? `${plan.price.toLocaleString()} FCFA` : 'Gratuit'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
