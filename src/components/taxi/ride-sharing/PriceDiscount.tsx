
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Banknote } from "lucide-react";

interface PriceDiscountProps {
  initialPrice: number;
  discountedPrice: number;
}

export const PriceDiscount: React.FC<PriceDiscountProps> = ({ 
  initialPrice, 
  discountedPrice 
}) => {
  return (
    <div className="bg-primary/10 p-3 rounded-md flex justify-between">
      <div className="flex items-center">
        <Banknote className="h-5 w-5 text-primary mr-2" />
        <span>Prix estimé avec réduction</span>
      </div>
      <div className="flex items-center">
        <span className="line-through text-gray-500 mr-2">{initialPrice} FCFA</span>
        <Badge variant="outline" className="bg-primary/20 text-primary">
          {discountedPrice} FCFA
        </Badge>
      </div>
    </div>
  );
};
