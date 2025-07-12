
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PaymentSummaryProps {
  amount: number;
  saveMethod: boolean;
  setSaveMethod: (value: boolean) => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  saveMethod,
  setSaveMethod
}) => {
  // Formatter pour afficher les montants en FCFA
  const formatAmount = (value: number): string => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 bg-muted/30">
        <h3 className="font-medium mb-3">Récapitulatif</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Montant</span>
            <span>{formatAmount(amount)} FCFA</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Frais de service</span>
            <span>0 FCFA</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium">
            <span>Total à payer</span>
            <span>{formatAmount(amount)} FCFA</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="save-payment-method"
          checked={saveMethod}
          onCheckedChange={setSaveMethod}
        />
        <Label htmlFor="save-payment-method">
          Enregistrer ce mode de paiement
        </Label>
      </div>
    </div>
  );
};

export default PaymentSummary;
