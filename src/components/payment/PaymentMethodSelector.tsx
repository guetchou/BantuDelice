
import React from 'react';
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface PaymentMethodSelectorProps {
  paymentMethod: "mobile" | "card" | "cashdelivery";
  setPaymentMethod: React.Dispatch<React.SetStateAction<"mobile" | "card" | "cashdelivery">>;
}

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }: PaymentMethodSelectorProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Méthode de paiement</h3>
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value as "mobile" | "card" | "cashdelivery")}
        className="gap-4"
      >
        <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="mobile" id="mobile" />
          <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
            <Smartphone className="h-5 w-5 text-primary" />
            <span>Mobile Money</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Carte bancaire</span>
          </Label>
        </div>

        <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="cashdelivery" id="cashdelivery" />
          <Label htmlFor="cashdelivery" className="flex items-center gap-2 cursor-pointer">
            <Banknote className="h-5 w-5 text-primary" />
            <span>Paiement à la livraison</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
