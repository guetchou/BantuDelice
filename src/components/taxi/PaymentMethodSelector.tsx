
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, Banknote, QrCode, Phone } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  methods?: { id: string; name: string; icon: React.FC<{ className?: string }> }[];
  showAllOptions?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  methods,
  showAllOptions = true
}) => {
  // Méthodes de paiement par défaut
  const defaultMethods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Paiement via Orange Money, MTN Mobile Money, etc.',
      icon: Phone,
      color: 'text-blue-500'
    },
    {
      id: 'cash',
      name: 'Espèces',
      description: 'Paiement en espèces directement au chauffeur',
      icon: Banknote,
      color: 'text-green-500'
    },
    {
      id: 'wallet',
      name: 'Portefeuille',
      description: 'Utiliser votre solde de portefeuille électronique',
      icon: Wallet,
      color: 'text-purple-500'
    },
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Paiement sécurisé par carte Visa, Mastercard, etc.',
      icon: CreditCard,
      color: 'text-amber-500'
    },
    {
      id: 'qr_code',
      name: 'Code QR',
      description: 'Scannez un code QR pour payer',
      icon: QrCode,
      color: 'text-gray-500'
    }
  ];

  // Si des méthodes personnalisées sont fournies, les utiliser
  const paymentMethods = methods || defaultMethods;
  // Si showAllOptions est false, ne montrer que les méthodes les plus courantes
  const displayedMethods = showAllOptions 
    ? paymentMethods 
    : paymentMethods.filter(m => ['mobile_money', 'cash', 'card'].includes(m.id));

  return (
    <RadioGroup 
      value={selectedMethod} 
      onValueChange={onMethodChange}
      className="space-y-2"
    >
      {displayedMethods.map(method => {
        const Icon = method.icon;
        const isSelected = selectedMethod === method.id;
        
        return (
          <Card 
            key={method.id}
            className={`transition-all cursor-pointer ${
              isSelected 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <CardContent className="p-3 flex items-center">
              <RadioGroupItem 
                value={method.id} 
                id={method.id} 
                className="mr-3"
              />
              <Label 
                htmlFor={method.id} 
                className="flex-1 flex items-center cursor-pointer"
              >
                <Icon className={`h-4 w-4 mr-2 ${method.color || ''}`} />
                <div>
                  <p className="font-medium">{method.name}</p>
                  {method.description && showAllOptions && (
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                  )}
                </div>
              </Label>
            </CardContent>
          </Card>
        );
      })}
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
