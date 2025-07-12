
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Plus, Clock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/restaurant';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: () => void;
  onRemoveFromCart?: () => void;
  quantity?: number;
  showNutritionalInfo?: boolean;
  onClick?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart,
  onRemoveFromCart,
  quantity = 0,
  showNutritionalInfo = false,
  onClick 
}) => {
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
      toast({
        title: "Ajouté au panier",
        description: `${item.name} a été ajouté à votre panier`
      });
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Card 
      className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md cursor-pointer" 
      onClick={handleClick}
    >
      {item.image_url && (
        <div className="relative h-36 overflow-hidden">
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          {(item.is_vegetarian || item.is_vegan || item.is_gluten_free) && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {item.is_vegetarian && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  <span className="text-xs">Végétarien</span>
                </Badge>
              )}
              {item.is_vegan && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">Vegan</Badge>
              )}
              {item.is_gluten_free && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Sans Gluten</Badge>
              )}
            </div>
          )}
        </div>
      )}
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="mb-auto">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium">{item.name}</h3>
            <Badge variant="outline" className="font-semibold">
              {item.price.toLocaleString('fr-FR')} FCFA
            </Badge>
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{item.preparation_time || 15} min</span>
          </div>
          {onAddToCart && (
            <Button size="sm" onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
