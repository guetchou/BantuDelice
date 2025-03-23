
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react';
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
      
      <div className="mb-12">
        <SubscriptionPlans />
      </div>
      
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
    </div>
  );
};

export default TaxiSubscriptionPage;
