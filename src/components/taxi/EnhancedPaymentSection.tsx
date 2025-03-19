
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet, CreditCard, Banknote, QrCode, Phone } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface EnhancedPaymentSectionProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  estimatedPrice?: number;
  showDetails?: boolean;
}

const EnhancedPaymentSection = ({ 
  paymentMethod, 
  onPaymentMethodChange,
  estimatedPrice,
  showDetails = false
}: EnhancedPaymentSectionProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="payment-method">Mode de paiement</Label>
      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange} className="space-y-2">
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="mobile_money" id="mobile_money" />
          <Label htmlFor="mobile_money" className="flex-1 flex items-center">
            <Phone className="h-4 w-4 mr-2 text-blue-500" />
            Mobile Money
          </Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex-1 flex items-center">
            <Banknote className="h-4 w-4 mr-2 text-green-500" />
            Paiement en espèces
          </Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="wallet" id="wallet" />
          <Label htmlFor="wallet" className="flex-1 flex items-center">
            <Wallet className="h-4 w-4 mr-2 text-purple-500" />
            Portefeuille électronique
          </Label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-3">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex-1 flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-amber-500" />
            Carte bancaire
          </Label>
        </div>
      </RadioGroup>
      
      {estimatedPrice && (
        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
          {showDetails ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prix de base</span>
                <span>{formatCurrency(Math.round(estimatedPrice * 0.8))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de service</span>
                <span>{formatCurrency(Math.round(estimatedPrice * 0.15))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes</span>
                <span>{formatCurrency(Math.round(estimatedPrice * 0.05))}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t mt-2">
                <span>Montant total:</span>
                <span>{formatCurrency(estimatedPrice)}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Montant estimé:</span>
              <span className="font-semibold">{formatCurrency(estimatedPrice)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedPaymentSection;
