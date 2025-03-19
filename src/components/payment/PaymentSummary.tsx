
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PaymentSummaryProps {
  amount: number;
  saveMethod: boolean;
  setSaveMethod: (checked: boolean) => void;
}

const PaymentSummary = ({ amount, saveMethod, setSaveMethod }: PaymentSummaryProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="saveMethod" 
          checked={saveMethod} 
          onCheckedChange={(checked) => setSaveMethod(!!checked)} 
        />
        <Label htmlFor="saveMethod" className="text-sm">
          Enregistrer ce mode de paiement
        </Label>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Montant à payer:</span>
          <span className="font-semibold">{amount.toLocaleString()} FCFA</span>
        </div>
      </div>
    </>
  );
};

export default PaymentSummary;
