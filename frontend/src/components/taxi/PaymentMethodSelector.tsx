
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, Smartphone, Receipt } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  icon: unknown;
  color?: string;
}

interface PaymentMethodSelectorProps {
  onPaymentMethodChange: (method: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  onPaymentMethodChange
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('cash');
  
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Espèces',
      description: 'Paiement direct au chauffeur',
      icon: Receipt,
      color: '#F59E0B'
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'Airtel Money, MTN Mobile Money, etc',
      icon: Smartphone,
      color: '#10B981'
    },
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard, etc',
      icon: CreditCard,
      color: '#3B82F6'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      description: 'Utiliser votre solde wallet',
      icon: Wallet,
      color: '#8B5CF6'
    }
  ];
  
  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    onPaymentMethodChange(methodId);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {paymentMethods.map(method => (
        <Card 
          key={method.id}
          className={`cursor-pointer transition-all border-2 ${
            selectedMethod === method.id
              ? `border-primary bg-primary/5`
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleSelectMethod(method.id)}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <div 
              className="rounded-full p-2 flex-shrink-0" 
              style={{ backgroundColor: method.color ? `${method.color}20` : '#f3f4f6' }}
            >
              <method.icon 
                className="h-5 w-5" 
                style={{ color: method.color }} 
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{method.name}</p>
              {method.description && (
                <p className="text-sm text-gray-500">{method.description}</p>
              )}
            </div>
            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
              {selectedMethod === method.id && (
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
