
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, MessageSquare, CheckCircle } from "lucide-react";

interface BookingExtrasProps {
  specialInstructions: string;
  promoCode: string;
  onSpecialInstructionsChange: (value: string) => void;
  onPromoCodeChange: (value: string) => void;
  onApplyPromoCode: () => void;
  promoApplied?: boolean;
  promoDiscount?: number;
}

const BookingExtras: React.FC<BookingExtrasProps> = ({
  specialInstructions,
  promoCode,
  onSpecialInstructionsChange,
  onPromoCodeChange,
  onApplyPromoCode,
  promoApplied = false,
  promoDiscount = 0
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="promo-code" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Code promotionnel
        </Label>
        <div className="flex space-x-2">
          <Input
            id="promo-code"
            placeholder="Entrez un code promo"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            disabled={promoApplied}
            className={promoApplied ? "bg-green-50 border-green-200" : ""}
          />
          <Button 
            onClick={onApplyPromoCode} 
            disabled={!promoCode || promoApplied}
            variant={promoApplied ? "outline" : "secondary"}
            className={promoApplied ? "border-green-200 bg-green-50 text-green-600 hover:text-green-600 hover:bg-green-100" : ""}
          >
            {promoApplied ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Appliqué
              </span>
            ) : (
              "Appliquer"
            )}
          </Button>
        </div>
        
        {promoApplied && promoDiscount > 0 && (
          <p className="text-sm text-green-600 mt-1">
            Réduction de {promoDiscount}% appliquée!
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="special-instructions" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Instructions spéciales (facultatif)
        </Label>
        <Textarea
          id="special-instructions"
          placeholder="Ex: J'ai besoin d'aide avec mes bagages, besoin d'un siège bébé, etc."
          value={specialInstructions}
          onChange={(e) => onSpecialInstructionsChange(e.target.value)}
          rows={3}
        />
      </div>
      
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-3 text-sm">
          <p>
            <span className="font-medium">Note:</span> Les informations que vous fournissez ici seront partagées uniquement avec votre chauffeur pour améliorer votre expérience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingExtras;
