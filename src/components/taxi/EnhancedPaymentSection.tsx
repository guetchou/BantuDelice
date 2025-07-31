
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from './booking-form/bookingFormUtils';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Landmark, Smartphone } from 'lucide-react';

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
      <div>
        <h3 className="text-lg font-medium mb-2">Méthode de paiement</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choisissez comment vous souhaitez payer votre trajet.
        </p>
      </div>
      
      <PaymentMethodSelector
        onPaymentMethodChange={onPaymentMethodChange}
      />
      
      {/* Détails de paiement conditionnels */}
      {paymentMethod === 'card' && (
        <Card className="border border-blue-100 bg-blue-50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-blue-800">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">Paiement par carte</span>
            </div>
            <p className="text-sm text-blue-700">
              Le paiement sera traité de manière sécurisée à la fin de votre course.
            </p>
          </CardContent>
        </Card>
      )}
      
      {paymentMethod === 'mobile_money' && (
        <Card className="border border-green-100 bg-green-50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-green-800">
              <Smartphone className="h-5 w-5" />
              <span className="font-medium">Mobile Money</span>
            </div>
            <p className="text-sm text-green-700">
              Une demande de paiement sera envoyée à votre téléphone avant la fin de votre course.
            </p>
          </CardContent>
        </Card>
      )}
      
      {paymentMethod === 'cash' && (
        <Card className="border border-orange-100 bg-orange-50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-orange-800">
              <Landmark className="h-5 w-5" />
              <span className="font-medium">Paiement en espèces</span>
            </div>
            <p className="text-sm text-orange-700">
              Préparez {formatPrice(estimatedPrice)} à remettre directement au chauffeur.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPaymentSection;
