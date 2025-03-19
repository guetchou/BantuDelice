
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Percent } from "lucide-react";
import type { MenuItem } from '@/types/restaurant';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: () => void;
  onRemoveFromCart: (itemId: string) => void;
  quantity: number;
  showNutritionalInfo?: boolean;
}

const MenuItemCard = ({ 
  item, 
  onAddToCart,
  onRemoveFromCart,
  quantity,
  showNutritionalInfo = false
}: MenuItemCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const hasPromotion = item.promotional_data && item.promotional_data.is_on_promotion;
  const originalPrice = item.price;
  const discountedPrice = hasPromotion && item.promotional_data?.discount_type === 'percentage'
    ? originalPrice * (1 - (item.promotional_data.discount_value / 100))
    : hasPromotion && item.promotional_data?.discount_type === 'fixed_amount'
      ? originalPrice - item.promotional_data.discount_value
      : originalPrice;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white/5 backdrop-blur-sm border-gray-800">
      <div className="relative">
        {item.image_url && (
          <div className="h-40 w-full">
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        {hasPromotion && (
          <Badge className="absolute top-2 right-2 bg-orange-500">
            <Percent className="h-3 w-3 mr-1" />
            {item.promotional_data?.discount_type === 'percentage' 
              ? `-${item.promotional_data.discount_value}%` 
              : `-${item.promotional_data.discount_value} XAF`}
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white text-lg">{item.name}</h3>
          {hasPromotion ? (
            <div className="text-right">
              <span className="text-gray-400 line-through text-sm mr-2">{originalPrice.toLocaleString()} XAF</span>
              <span className="text-white font-bold">{Math.round(discountedPrice).toLocaleString()} XAF</span>
            </div>
          ) : (
            <span className="text-white font-bold">{originalPrice.toLocaleString()} XAF</span>
          )}
        </div>
        
        {item.description && (
          <p className={`text-gray-300 text-sm mb-2 ${!expanded && 'line-clamp-2'}`}>
            {item.description}
          </p>
        )}
        
        {item.description && item.description.length > 100 && (
          <button 
            className="text-xs text-gray-400 hover:text-white mb-2" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Voir moins' : 'Voir plus'}
          </button>
        )}
        
        {showNutritionalInfo && item.nutritional_info && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 mb-3 text-xs text-gray-300">
            {item.nutritional_info.calories && (
              <div>Calories: {item.nutritional_info.calories}</div>
            )}
            {item.nutritional_info.protein && (
              <div>Protéines: {item.nutritional_info.protein}g</div>
            )}
            {item.nutritional_info.carbs && (
              <div>Glucides: {item.nutritional_info.carbs}g</div>
            )}
            {item.nutritional_info.fat && (
              <div>Lipides: {item.nutritional_info.fat}g</div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 text-orange-500 border-orange-500"
                onClick={() => onRemoveFromCart(item.id)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-white font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 text-orange-500 border-orange-500"
                onClick={onAddToCart}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="sm"
            >
              Ajouter
            </Button>
          )}
          
          {item.preparation_time && (
            <div className="text-xs text-gray-400">
              {item.preparation_time} min
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;
