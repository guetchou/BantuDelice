
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Utensils } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface RecommendedItemProps {
  item: MenuItem;
  onClick?: () => void;
  onAddToCart?: (item: MenuItem) => void;
}

const RecommendedItem: React.FC<RecommendedItemProps> = ({ 
  item, 
  onClick, 
  onAddToCart 
}) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={onClick}
    >
      <div className="h-32 relative">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Utensils className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {(item.is_vegetarian || item.is_vegan) && (
          <Badge 
            className={`absolute top-2 right-2 ${item.is_vegan ? 'bg-green-600' : 'bg-green-500'}`}
          >
            {item.is_vegan ? 'Vegan' : 'Végétarien'}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium line-clamp-1">{item.name}</h3>
          <span className="text-sm font-semibold">{item.price.toLocaleString()} FCFA</span>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {item.description}
        </p>
        
        {onAddToCart && (
          <Button 
            size="sm" 
            className="w-full mt-2" 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedItem;
