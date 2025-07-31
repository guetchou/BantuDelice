
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { TicketPercent, MessageSquareText, Tag } from 'lucide-react';

interface BookingExtrasProps {
  specialInstructions: string;
  promoCode: string;
  onSpecialInstructionsChange: (instructions: string) => void;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
}

const BookingExtras: React.FC<BookingExtrasProps> = ({
  specialInstructions,
  promoCode,
  onSpecialInstructionsChange,
  onPromoCodeChange,
  onApplyPromoCode
}) => {
  return (
    <div className="space-y-6">
      {/* Instructions spéciales */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-gray-500" />
          <Label htmlFor="special-instructions" className="font-medium">
            Instructions spéciales (facultatif)
          </Label>
        </div>
        <Textarea
          id="special-instructions"
          placeholder="Instructions pour le chauffeur, détails sur le lieu de prise en charge, etc."
          value={specialInstructions}
          onChange={(e) => onSpecialInstructionsChange(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>
      
      {/* Code promo */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TicketPercent className="h-5 w-5 text-gray-500" />
          <Label htmlFor="promo-code" className="font-medium">
            Code promotionnel (facultatif)
          </Label>
        </div>
        <div className="flex gap-2">
          <Input
            id="promo-code"
            placeholder="Entrer un code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
          />
          <Button 
            onClick={onApplyPromoCode}
            variant="outline"
            disabled={!promoCode}
          >
            Appliquer
          </Button>
        </div>
      </div>
      
      {/* Codes promo disponibles */}
      <Card className="bg-amber-50 border-amber-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Tag className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Codes promo disponibles</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-amber-700">NEWUSER</p>
                    <p className="text-xs text-amber-600">20% de réduction sur votre première course</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => onPromoCodeChange('NEWUSER')}
                    className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 py-1 h-auto text-sm"
                  >
                    Utiliser
                  </Button>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-amber-700">WEEKEND25</p>
                    <p className="text-xs text-amber-600">25% de réduction pour les trajets du weekend</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => onPromoCodeChange('WEEKEND25')}
                    className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 py-1 h-auto text-sm"
                  >
                    Utiliser
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingExtras;
