
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BookingExtrasProps {
  specialInstructions: string;
  promoCode: string;
  onSpecialInstructionsChange: (value: string) => void;
  onPromoCodeChange: (value: string) => void;
  onApplyPromoCode: () => void;
}

const BookingExtras = ({
  specialInstructions,
  promoCode,
  onSpecialInstructionsChange,
  onPromoCodeChange,
  onApplyPromoCode
}: BookingExtrasProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="special-instructions">Instructions spéciales (facultatif)</Label>
        <Input
          id="special-instructions"
          placeholder="Informations supplémentaires pour le chauffeur"
          value={specialInstructions}
          onChange={(e) => onSpecialInstructionsChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="promo-code">Code promotionnel (facultatif)</Label>
        <div className="flex gap-2">
          <Input
            id="promo-code"
            placeholder="Entrez un code promo"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
          />
          <Button variant="outline" type="button" onClick={onApplyPromoCode}>
            Appliquer
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingExtras;
