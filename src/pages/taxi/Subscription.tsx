
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';
import SubscriptionPlans from '@/components/taxi/SubscriptionPlans';
import PaymentSection from '@/components/taxi/PaymentSection';
import { TaxiSubscriptionPlan } from '@/types/taxi';
import EnhancedPaymentSection from '@/components/taxi/EnhancedPaymentSection';

const TaxiSubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<TaxiSubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [activeTab, setActiveTab] = useState('plans');
  const [viewTab, setViewTab] = useState('available');
  
  const handleSelectPlan = (plan: TaxiSubscriptionPlan) => {
    setSelectedPlan(plan);
    setActiveTab('payment');
    toast.success(`Plan "${plan.name}" sélectionné`);
  };
  
  const handleSubscribe = () => {
    if (!selectedPlan) {
      toast.error("Veuillez sélectionner un plan d'abonnement");
      return;
    }
    
    toast.success("Paiement en cours de traitement", {
      description: "Votre abonnement sera activé après confirmation du paiement"
    });
    
    // Dans une application réelle, ici nous traiterions le paiement
    setTimeout(() => {
      toast.success("Abonnement activé avec succès !");
      navigate(`/taxi/subscription/${selectedPlan.id}`);
    }, 2000);
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
        <h1 className="text-3xl font-bold">Abonnements Taxi</h1>
      </div>
      
      <TaxiNavigationMenu activeRoute="subscription" />
      
      <div className="max-w-3xl mx-auto mt-6">
        <Tabs value={viewTab} onValueChange={setViewTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Plans disponibles</TabsTrigger>
            <TabsTrigger value="active">Mes abonnements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Économisez avec nos plans d'abonnement</CardTitle>
                <CardDescription>
                  Nos abonnements vous permettent d'économiser sur vos courses régulières et d'accéder à des avantages exclusifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="plans">Plans disponibles</TabsTrigger>
                    <TabsTrigger value="payment" disabled={!selectedPlan}>Paiement</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="plans" className="pt-4">
                    <SubscriptionPlans onSelectPlan={handleSelectPlan} />
                  </TabsContent>
                  
                  <TabsContent value="payment" className="pt-4">
                    {selectedPlan && (
                      <div className="space-y-6">
                        <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                          <h3 className="font-medium text-lg mb-1">{selectedPlan.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{selectedPlan.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Prix de l'abonnement:</span>
                            <span className="font-bold">{selectedPlan.price.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Durée:</span>
                            <span>{selectedPlan.duration} jours</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Réduction par course:</span>
                            <span>{selectedPlan.discount_percentage}%</span>
                          </div>
                        </div>
                        
                        <EnhancedPaymentSection 
                          paymentMethod={paymentMethod} 
                          onPaymentMethodChange={setPaymentMethod}
                          estimatedPrice={selectedPlan.price}
                          showDetails={true}
                        />
                        
                        <div className="pt-4">
                          <Button 
                            className="w-full"
                            onClick={handleSubscribe}
                          >
                            Confirmer l'abonnement
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Mes abonnements actifs</CardTitle>
                <CardDescription>
                  Suivez et gérez vos abonnements en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center">
                  <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun abonnement actif</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas d'abonnement actif pour le moment. Souscrivez à un plan pour profiter de réductions sur vos courses.
                  </p>
                  <Button onClick={() => setViewTab('available')}>
                    Voir les plans disponibles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comparez nos abonnements</CardTitle>
            <CardDescription>
              Découvrez quel plan correspond le mieux à vos besoins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/taxi/vehicle-comparison')}
            >
              Voir la comparaison détaillée
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Options de paiement flexibles</CardTitle>
            <CardDescription>
              Nous proposons plusieurs méthodes de paiement pour faciliter vos transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h3 className="font-medium mb-2">Paiement échelonné</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Payez votre abonnement en plusieurs fois sans frais supplémentaires
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  En savoir plus
                </Button>
              </div>
              
              <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h3 className="font-medium mb-2">Facturation entreprise</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Solutions adaptées pour les besoins professionnels avec facturation mensuelle
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contacter notre équipe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxiSubscriptionPage;
