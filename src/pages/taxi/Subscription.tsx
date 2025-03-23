
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, CreditCard, CheckCircle, Users, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubscriptionPlans from '@/components/taxi/SubscriptionPlans';

const TaxiSubscriptionPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/taxi')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Abonnements Taxi</h1>
          <p className="text-gray-600 mt-1">
            Forfaits de courses régulières à tarifs avantageux
          </p>
        </div>
      </div>
      
      <div className="mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg">
            Simplifiez vos déplacements quotidiens avec nos forfaits sans engagement.
            Économisez jusqu'à 30% sur vos courses régulières et bénéficiez de nombreux avantages.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="individual" className="w-full mb-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="individual">Particuliers</TabsTrigger>
          <TabsTrigger value="business">Entreprises</TabsTrigger>
        </TabsList>
        <TabsContent value="individual" className="mt-6">
          <SubscriptionPlans />
        </TabsContent>
        <TabsContent value="business" className="mt-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Solutions pour entreprises</h2>
            <p className="text-gray-600 mt-2">
              Des forfaits adaptés aux besoins des professionnels et entreprises de toutes tailles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6 bg-blue-50">
                <h3 className="text-xl font-bold mb-2">Pack Team</h3>
                <p className="text-gray-600">Pour les petites équipes</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">45k</span>
                  <span className="text-lg">FCFA</span>
                  <span className="text-gray-500 text-sm">/mois</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Jusqu'à 5 employés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>20 courses par mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tableau de bord de gestion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Facturation mensuelle unique</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/taxi/business')}>
                  En savoir plus
                </Button>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden border-2 border-primary relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium">Populaire</div>
              <div className="p-6 bg-primary/5">
                <h3 className="text-xl font-bold mb-2">Pack Business</h3>
                <p className="text-gray-600">Pour les entreprises en croissance</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">120k</span>
                  <span className="text-lg">FCFA</span>
                  <span className="text-gray-500 text-sm">/mois</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Jusqu'à 20 employés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>60 courses par mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Analytics et rapports avancés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Gestionnaire de compte dédié</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Services VIP disponibles</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" onClick={() => navigate('/taxi/business')}>
                  En savoir plus
                </Button>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-bold mb-2">Pack Enterprise</h3>
                <p className="text-gray-600">Pour les grandes entreprises</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-xl font-medium">Sur mesure</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Nombre illimité d'employés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Volume personnalisé de courses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>API d'intégration disponible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tarifs négociés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Service conciergerie 24/7</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700" onClick={() => navigate('/taxi/business')}>
                  Contactez-nous
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Questions fréquentes</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Comment fonctionnent les abonnements ?</h3>
              <p className="text-gray-600">
                Nos abonnements vous permettent de payer un montant fixe pour un nombre défini de courses sur une période donnée.
                Vous réalisez des économies sur chaque course et profitez d'avantages exclusifs comme la priorité de réservation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Puis-je annuler mon abonnement à tout moment ?</h3>
              <p className="text-gray-600">
                Oui, tous nos abonnements sont sans engagement. Vous pouvez annuler à tout moment et votre abonnement restera actif jusqu'à la fin de la période en cours.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Que se passe-t-il si je n'utilise pas toutes mes courses ?</h3>
              <p className="text-gray-600">
                Pour le Pass Flexible, les courses non utilisées sont reportées au mois suivant (dans la limite de 3 mois).
                Pour les autres formules, les courses non utilisées sont perdues à la fin de la période.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Les abonnements sont-ils partageables ?</h3>
              <p className="text-gray-600">
                Oui, le Pass Famille et le Pass Business peuvent être partagés avec d'autres personnes.
                Les autres forfaits sont individuels et liés à votre compte.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Garantie de satisfaction</h2>
          <p className="text-gray-600 mb-6">
            Si vous n'êtes pas satisfait de nos services dans les 7 premiers jours de votre abonnement,
            nous vous remboursons intégralement sans conditions.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/taxi/subscription/weekly')}>
            Essayer sans risque
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxiSubscriptionPage;
