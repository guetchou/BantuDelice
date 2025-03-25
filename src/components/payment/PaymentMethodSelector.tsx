
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'mobile' | 'card' | 'cashdelivery';
  setPaymentMethod: (method: 'mobile' | 'card' | 'cashdelivery') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Méthode de paiement</h3>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button
          type="button"
          variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
          className="flex-1 justify-start"
          onClick={() => setPaymentMethod('mobile')}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile Money
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'card' ? 'default' : 'outline'}
          className="flex-1 justify-start"
          onClick={() => setPaymentMethod('card')}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Carte Bancaire
        </Button>
        <Button
          type="button"
          variant={paymentMethod === 'cashdelivery' ? 'default' : 'outline'}
          className="flex-1 justify-start"
          onClick={() => setPaymentMethod('cashdelivery')}
        >
          <Banknote className="w-4 h-4 mr-2" />
          Paiement à la livraison
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
