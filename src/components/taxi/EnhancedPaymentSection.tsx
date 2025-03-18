
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet } from "lucide-react";

interface EnhancedPaymentSectionProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  estimatedPrice?: number;
}

const EnhancedPaymentSection = ({ 
  paymentMethod, 
  onPaymentMethodChange,
  estimatedPrice 
}: EnhancedPaymentSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="payment-method">Mode de paiement</Label>
      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange} className="space-y-2">
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="mobile_money" id="mobile_money" />
          <Label htmlFor="mobile_money" className="flex-1">Mobile Money</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex-1">Paiement en espèces</Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="wallet" id="wallet" />
          <Label htmlFor="wallet" className="flex-1 flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Portefeuille électronique
          </Label>
        </div>
      </RadioGroup>
      
      {estimatedPrice && (
        <div className="mt-3 text-sm text-gray-500">
          Montant estimé à payer: <span className="font-semibold">{estimatedPrice} FCFA</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedPaymentSection;
