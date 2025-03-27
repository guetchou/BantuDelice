
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Smartphone, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Type des méthodes de paiement
interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  icon: React.FC<{ className?: string }> | any;
  color?: string;
}

// Liste des méthodes de paiement disponibles
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Espèces',
    description: 'Paiement en espèces à la livraison',
    icon: Banknote,
    color: 'green'
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'Airtel Money, MTN MoMo, Orange Money',
    icon: Smartphone,
    color: 'orange'
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, etc.',
    icon: CreditCard,
    color: 'blue'
  }
];

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid gap-3"
    >
      {PAYMENT_METHODS.map((method) => (
        <Card
          key={method.id}
          className={cn(
            "relative flex items-center space-x-3 p-4 cursor-pointer transition-all hover:border-primary/50",
            value === method.id && "border-primary bg-primary/5"
          )}
          onClick={() => onChange(method.id)}
        >
          <RadioGroupItem
            value={method.id}
            id={`payment-${method.id}`}
            className="peer sr-only"
          />
          
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            `text-${method.color}-500`,
            value === method.id ? `bg-${method.color}-100` : "bg-muted"
          )}>
            <method.icon className="h-5 w-5" />
          </div>
          
          <div className="space-y-1">
            <Label
              htmlFor={`payment-${method.id}`}
              className="font-medium"
            >
              {method.name}
            </Label>
            {method.description && (
              <p className="text-xs text-muted-foreground">
                {method.description}
              </p>
            )}
          </div>
          
          {value === method.id && (
            <div className="absolute right-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
          )}
        </Card>
      ))}
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
