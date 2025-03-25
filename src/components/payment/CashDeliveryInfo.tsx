
import React from 'react';
import { AlertCircle, Banknote } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CashDeliveryInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Paiement à la livraison</AlertTitle>
        <AlertDescription>
          Vous paierez le montant total au livreur lors de la réception de votre commande.
        </AlertDescription>
      </Alert>
      
      <div className="p-4 border rounded-md bg-muted/30">
        <div className="flex items-center mb-2">
          <Banknote className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">Informations importantes</h3>
        </div>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Préparez le montant exact si possible</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Le livreur ne peut pas toujours rendre la monnaie sur les gros billets</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Un reçu vous sera fourni à la livraison</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Vérifiez votre commande avant de payer</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashDeliveryInfo;
