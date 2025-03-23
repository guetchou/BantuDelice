
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Clock, Car, CreditCard, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import TaxiNavigationMenu from '@/components/taxi/TaxiNavigationMenu';
import SubscriptionPlans from '@/components/taxi/SubscriptionPlans';
import { TaxiSubscriptionPlan } from '@/types/taxi';

const TaxiSubscriptionPage = () => {
  const navigate = useNavigate();
  
  const handleSelectPlan = (plan: TaxiSubscriptionPlan) => {
    toast.success(`Plan ${plan.name} sélectionné`, {
      description: "Vous allez être redirigé vers la page de paiement"
    });
    
    // Simulate navigation to payment page
    setTimeout(() => {
      navigate('/taxi');
    }, 1500);
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
      
      <TaxiNavigationMenu />
      
      <div className="max-w-5xl mx-auto">
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800">Économisez avec nos abonnements</CardTitle>
            <CardDescription className="text-blue-600">
              Profitez de réductions exclusives et d'avantages premium avec nos forfaits mensuels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start space-x-3">
                <CreditCard className="h-10 w-10 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-800">Économies garanties</h3>
                  <p className="text-sm text-blue-600">Jusqu'à 30% de réduction sur chaque course</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-10 w-10 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-800">Annulation flexible</h3>
                  <p className="text-sm text-blue-600">Annulez gratuitement selon votre forfait</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-10 w-10 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-800">Priorité garantie</h3>
                  <p className="text-sm text-blue-600">Obtenez un chauffeur plus rapidement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Car className="h-10 w-10 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-800">Véhicules premium</h3>
                  <p className="text-sm text-blue-600">Accès aux meilleurs véhicules disponibles</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Choisissez votre forfait</h2>
          <SubscriptionPlans onSelectPlan={handleSelectPlan} />
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Comparez vos économies
            </CardTitle>
            <CardDescription>
              Découvrez combien vous pouvez économiser avec nos différents forfaits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 border-b">Utilisation</th>
                    <th className="text-center p-3 border-b">Sans abonnement</th>
                    <th className="text-center p-3 border-b">Plan Essentiel</th>
                    <th className="text-center p-3 border-b">Plan Premium</th>
                    <th className="text-center p-3 border-b">Plan Famille</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/20">
                    <td className="p-3 border-b">5 courses/mois</td>
                    <td className="text-center p-3 border-b">25 000 FCFA</td>
                    <td className="text-center p-3 border-b text-green-600">22 500 FCFA <br /><span className="text-xs text-green-700">(économie: 2 500 FCFA)</span></td>
                    <td className="text-center p-3 border-b text-green-600">20 000 FCFA <br /><span className="text-xs text-green-700">(économie: 5 000 FCFA)</span></td>
                    <td className="text-center p-3 border-b text-red-600">26 875 FCFA <br /><span className="text-xs text-red-700">(perte: 1 875 FCFA)</span></td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="p-3 border-b">15 courses/mois</td>
                    <td className="text-center p-3 border-b">75 000 FCFA</td>
                    <td className="text-center p-3 border-b text-green-600">67 500 FCFA <br /><span className="text-xs text-green-700">(économie: 7 500 FCFA)</span></td>
                    <td className="text-center p-3 border-b text-green-600">60 000 FCFA <br /><span className="text-xs text-green-700">(économie: 15 000 FCFA)</span></td>
                    <td className="text-center p-3 border-b text-green-600">56 250 FCFA <br /><span className="text-xs text-green-700">(économie: 18 750 FCFA)</span></td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="p-3 border-b">30 courses/mois</td>
                    <td className="text-center p-3 border-b">150 000 FCFA</td>
                    <td className="text-center p-3 border-b text-green-600">135 000 FCFA <br /><span className="text-xs text-green-700">(économie: 15 000 FCFA)</span></td>
                    <td className="text-center p-3 border-b text-green-600">120 000 FCFA <br /><span className="text-xs text-green-700">(économie: 30 000 FCFA)</span></td>
                    <td className="text-center p-3 border-b text-green-600">112 500 FCFA <br /><span className="text-xs text-green-700">(économie: 37 500 FCFA)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              *Basé sur un prix moyen de 5 000 FCFA par course. Les économies réelles peuvent varier en fonction de vos habitudes d'utilisation.
            </p>
          </CardContent>
        </Card>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Des questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Notre équipe est disponible pour vous aider à choisir l'abonnement qui vous convient le mieux.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/contact')}
          >
            Contactez-nous
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxiSubscriptionPage;
