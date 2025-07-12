
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentAndContactSectionProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  specialInstructions: string;
  onSpecialInstructionsChange: (value: string) => void;
  contactNumber: string;
  onContactNumberChange: (value: string) => void;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  isSharedRide: boolean;
  onSharedRideChange: (value: boolean) => void;
}

const PaymentAndContactSection: React.FC<PaymentAndContactSectionProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  specialInstructions,
  onSpecialInstructionsChange,
  contactNumber,
  onContactNumberChange,
  promoCode,
  onPromoCodeChange,
  isSharedRide,
  onSharedRideChange
}) => {
  const [showPromoInput, setShowPromoInput] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Méthode de paiement</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
          className="gap-4"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="mobile_money" id="mobile_money" />
            <Label htmlFor="mobile_money" className="flex items-center gap-2 cursor-pointer">
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
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
              <Banknote className="h-5 w-5 text-primary" />
              <span>Espèces</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Informations de contact</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contact_number">Numéro de téléphone</Label>
            <Input
              id="contact_number"
              type="tel"
              placeholder="+242 XXXXXXXXX"
              value={contactNumber}
              onChange={(e) => onContactNumberChange(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="special_instructions">Instructions spéciales</Label>
            <Textarea
              id="special_instructions"
              placeholder="Instructions pour le chauffeur..."
              value={specialInstructions}
              onChange={(e) => onSpecialInstructionsChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Covoiturage</h4>
              <p className="text-sm text-muted-foreground">Partagez votre trajet et réduisez le coût</p>
            </div>
            <Switch 
              checked={isSharedRide}
              onCheckedChange={onSharedRideChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Code Promo</h4>
              <p className="text-sm text-muted-foreground">Entrez un code promo pour obtenir une réduction</p>
            </div>
            <Switch 
              checked={showPromoInput}
              onCheckedChange={setShowPromoInput}
            />
          </div>
          
          {showPromoInput && (
            <div className="mt-4">
              <Input
                placeholder="Code promo"
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentAndContactSection;
