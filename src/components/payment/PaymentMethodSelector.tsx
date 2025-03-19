
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, CreditCard, QrCode } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'mobile' | 'card' | 'cashdelivery';
  setPaymentMethod: (method: 'mobile' | 'card' | 'cashdelivery') => void;
}

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Paiement</h3>
      <p className="text-sm text-muted-foreground">
        Choisissez votre méthode de paiement préférée
      </p>
      
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant={paymentMethod === 'mobile' ? 'default' : 'outline'} 
          className="flex-1"
          onClick={() => setPaymentMethod('mobile')}
        >
          <Phone className="h-4 w-4 mr-2" />
          Mobile Money
        </Button>
        <Button 
          type="button" 
          variant={paymentMethod === 'card' ? 'default' : 'outline'} 
          className="flex-1"
          onClick={() => setPaymentMethod('card')}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Carte Bancaire
        </Button>
        <Button 
          type="button" 
          variant={paymentMethod === 'cashdelivery' ? 'default' : 'outline'} 
          className="flex-1"
          onClick={() => setPaymentMethod('cashdelivery')}
        >
          <QrCode className="h-4 w-4 mr-2" />
          À la livraison
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
