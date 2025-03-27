
import React from 'react';
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import PaymentMethodSelector from './PaymentMethodSelector';
import { formatPrice } from './booking-form/bookingFormUtils';

interface EnhancedPaymentSectionProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  estimatedPrice: number;
}

const EnhancedPaymentSection: React.FC<EnhancedPaymentSectionProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  estimatedPrice
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <Label className="text-base">Moyen de paiement</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Choisissez comment vous souhaitez payer votre course
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Montant estimé</p>
          <p className="text-xl font-bold text-primary">{formatPrice(estimatedPrice)}</p>
        </div>
      </div>
      
      <PaymentMethodSelector
        value={paymentMethod}
        onChange={onPaymentMethodChange}
      />
      
      {paymentMethod === 'mobile_money' && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-3 text-sm">
            <p>
              <span className="font-medium">Note:</span> Vous recevrez un code de paiement à la fin de votre course. Aucun paiement n'est prélevé maintenant.
            </p>
          </CardContent>
        </Card>
      )}
      
      {paymentMethod === 'card' && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-3 text-sm">
            <p>
              <span className="font-medium">Note:</span> Votre carte sera débitée uniquement à la fin de votre course. Une pré-autorisation sera effectuée pour vérifier la validité de votre carte.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPaymentSection;
